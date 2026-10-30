// server/src/utils/response.js
export const sendSuccess = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

export const sendError = (res, message = 'An error occurred', code = 'INTERNAL_ERROR', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    error: {
      code,
      message
    }
  };
  if (details && process.env.NODE_ENV !== 'production') {
    payload.error.details = details;
  }
  return res.status(statusCode).json(payload);
};
