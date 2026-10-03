const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createMessage,
  getMessages,
  toggleRead,
  deleteMessage,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
});

router.post('/', submitLimiter, createMessage);
router.get('/', protect, getMessages);
router.patch('/:id/read', protect, toggleRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
