const db = require("../db/connection");

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

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.comment_id)AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.fetchCommentsById = (id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [id])
    .then((comments) => {
      return comments.rows;
    });
};

exports.addComment = (id, reqBody) => {
  const { username, body } = reqBody;
  const reqKeys = Object.keys(reqBody);
  if (reqKeys.length < 2) {
    return Promise.reject({
      status: 400,
      msg: "missing fields in request",
    });
  } else if (!reqKeys.includes("username") || !reqKeys.includes("body")) {
    return Promise.reject({
      status: 400,
      msg: "invalid key",
    });
  } else {
    return db
      .query(
        "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
        [id, username, body]
      )
      .then(({ rows: comment }) => {
        return comment;
      });
  }
};
