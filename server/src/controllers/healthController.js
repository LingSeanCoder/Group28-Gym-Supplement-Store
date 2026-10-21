const pool = require('../config/db');

exports.check = (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' }, error: null });
};

exports.checkDb = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      success: true,
      data: { 
        status: 'ok', 
        db_time: result.rows[0].now 
      },
      error: null,
    });
  } catch (err) {
    next(err); // Đẩy lỗi cho middleware xử lý
  }
};