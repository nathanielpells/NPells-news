const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");
const app = express();
const {
  handle404,
  handlePsqlError,
  handle500,
} = require("./controllers/errors.controller");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);

// handling an invalid api path
app.all("/*", handle404);
//handling other errors
app.use(handlePsqlError);
app.use(handle500);

module.exports = app;
