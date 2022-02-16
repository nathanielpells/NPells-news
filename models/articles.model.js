const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then((articles) => {
      return articles.rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC;")
    .then(({ rows: articles }) => {
      return articles;
    });
};
