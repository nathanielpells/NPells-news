const {
  fetchArticleById,
  updateArticle,
  fetchArticleWithComments,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleWithComments = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id);
  fetchArticleWithComments(article_id)
    .then((article) => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
