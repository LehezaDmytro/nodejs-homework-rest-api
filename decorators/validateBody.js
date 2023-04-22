const { HttpError } = require("../helpers");

const validateBody = (shema) => {
  const func = (req, res, next) => {
    if (
      Object.keys(req.body).length === 0 &&
      req.route.path === "/:contactId/favorite"
    ) {
      next(HttpError(400, "missing field favorite"));
    }
    if (Object.keys(req.body).length === 0) {
      next(HttpError(400, "missing fields"));
    }
    const { error } = shema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
