const assert = require('node:assert/strict');
const { once } = require('node:events');
const { after, before, test } = require('node:test');

process.env.NODE_ENV = 'test';
// A healthy API must not require a database connection.
process.env.DATABASE_URL = '';
process.env.PGHOST = '127.0.0.1';
process.env.PGPORT = '1';

const app = require('../src/app');
const pool = require('../src/config/db');
const { corsOrigin } = require('../src/config/env');
const errorHandler = require('../src/middlewares/errorHandler');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  await pool.end();
});

for (const route of ['/health', '/api/health']) {
  test(`GET ${route} returns liveness without connecting to PostgreSQL`, async () => {
    const response = await fetch(`${baseUrl}${route}`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.error, null);
    assert.equal(body.data.status, 'ok');
    assert.ok(Number.isFinite(Date.parse(body.data.timestamp)));
    assert.equal(typeof body.data.uptime, 'number');
    assert.equal(pool.totalCount, 0);
  });
}

test('unknown routes use the JSON error contract', async () => {
  const response = await fetch(`${baseUrl}/api/missing`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    success: false,
    data: null,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

test('malformed JSON is rejected without exposing the body', async () => {
  const response = await fetch(`${baseUrl}/api/missing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"private_input":',
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    data: null,
    error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' },
  });
});

test('CORS uses the configured frontend origin', async () => {
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Origin: 'http://localhost:5173' },
  });

  assert.equal(response.headers.get('access-control-allow-origin'), corsOrigin);
});

test('internal errors hide implementation details and database error codes', (t) => {
  t.mock.method(console, 'error', () => {});
  let status;
  let body;
  const response = {
    status(value) { status = value; return this; },
    json(value) { body = value; },
  };
  const error = Object.assign(new Error('private database details'), { code: '28P01' });

  errorHandler(error, {}, response, () => assert.fail('unexpected next()'));

  assert.equal(status, 500);
  assert.deepEqual(body, {
    success: false,
    data: null,
    error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' },
  });
});
