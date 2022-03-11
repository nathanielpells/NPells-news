const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
  fetchCommentsById,
  addComment,
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

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  fetchArticles(sort_by, order, topic, limit, p)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id: id } = req.params;
  const { username: user } = req.body;
  const body = req.body;
  addComment(id, body)
    .then((body) => {
      res.status(201).send({ comment: body[0] });
    })
    .catch((err) => {
      next(err);
    });
};
