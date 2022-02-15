exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "page not found" });
};

exports.handlePsqlError = (err, req, res, next) => {
  console.log(err.code);
  if (err.code === "22P02")
    res.status(400).send({ msg: "invalid data type(s) given" });
  else next(err);
};
