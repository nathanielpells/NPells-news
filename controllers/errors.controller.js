exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "page not found" });
};

exports.handlePsqlError = (err, req, res, next) => {
  if (err.code === "22P02")
    res.status(400).send({ msg: "invalid data type(s) given" });
  if (err.code === "23502")
    res.status(400).send({ msg: "invalid key and property given" });
  if (err.code === "23503")
    res
      .status(404)
      .send({
        msg: 'Key (author)=(not-registered) is not present in table "users".',
      });
  else next(err);
};

exports.handleCustomError = (err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle500 = (err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
