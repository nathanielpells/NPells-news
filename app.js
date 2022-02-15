const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const {
  handle404,
  handlePsqlError,
} = require("./controllers/errors.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.use(express.json());
app.get("/api/topics", getTopics);
console.log(getArticleById);
app.get("/api/articles/:article_id", getArticleById);

// handling an invalid api path
app.all("/*", handle404);
//handling other errors
app.use(handlePsqlError);

module.exports = app;
