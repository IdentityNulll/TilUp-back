export const notFound = (req, res) => {
  res.status(404).json({ message: `Yo'l topilmadi: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  console.error(err);
  res.status(statusCode).json({
    message: err.message || 'Serverda xatolik yuz berdi',
  });
};
