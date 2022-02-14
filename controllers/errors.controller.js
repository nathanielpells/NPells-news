exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "page not found" });
};
