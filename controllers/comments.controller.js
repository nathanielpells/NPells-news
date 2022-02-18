const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id: id } = req.params;
  removeCommentById(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
