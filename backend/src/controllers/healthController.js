const healthService = require('../services/healthService');

exports.check = (req, res) => {
  res.status(200).json({
    success: true,
    data: healthService.getStatus(),
    error: null,
  });
};
