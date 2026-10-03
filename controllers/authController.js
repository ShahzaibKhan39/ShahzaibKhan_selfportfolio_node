const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin credentials come from .env; the password is hashed once at startup
let adminHash = null;
const getAdminHash = () => {
  if (!adminHash) adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || '', 10);
  return adminHash;
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body || {};
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();

    const emailOk = String(email).trim().toLowerCase() === adminEmail;
    const passOk = await bcrypt.compare(String(password), getAdminHash());

    if (!emailOk || !passOk) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ email: adminEmail, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    res.json({ token, email: adminEmail });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ email: req.admin.email });
};
