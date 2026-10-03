const Message = require('../models/Message');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact  (public)
exports.createMessage = async (req, res, next) => {
  try {
    const { name = '', email = '', message = '' } = req.body || {};

    if (String(name).trim().length < 2) {
      return res.status(400).json({ message: 'Enter your full name.' });
    }
    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (String(message).trim().length < 10) {
      return res.status(400).json({ message: 'Message should be at least 10 characters.' });
    }

    await Message.create({ name, email, message });
    res.status(201).json({ message: 'Message sent.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact  (admin)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/contact/:id/read  (admin)
exports.toggleRead = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found.' });
    msg.read = !msg.read;
    await msg.save();
    res.json(msg);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/contact/:id  (admin)
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    next(err);
  }
};
