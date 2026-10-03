const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first ? first.message : 'Validation failed.' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id.' });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error.' });
};

module.exports = { notFound, errorHandler };
