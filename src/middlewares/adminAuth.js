const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY || 'change-me';

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid admin key'
    });
  }

  next();
};

module.exports = adminAuth;
