const db = require("../db/connection");
// const articles = require("../db/data/test-data/articles");

// "SELECT CAST(COUNT(comments.comment_id)AS int) AS comment_count FROM comments WHERE article_id = $1 GROUP BY article_id;"

exports.fetchArticleById = (id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.comment_id)AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [id]
    )
    .then((articles) => {
      return articles.rows[0];
    });
};

exports.updateArticle = (id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [id, votes]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${id}`,
        });
      }
      return article;
    });
};
