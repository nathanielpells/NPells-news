const db = require("../db/connection");
// const articles = require("../db/data/test-data/articles");

exports.fetchArticleById = (id) => {
  console.log(id);
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((articles) => {
      console.log(articles.rows);
      return articles.rows[0];
    });
};
