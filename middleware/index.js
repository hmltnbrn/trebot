exports.asyncWrap = (fn, cb) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(cb);
  };
}
