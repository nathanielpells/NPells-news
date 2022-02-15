const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();
const {
  handle404,
  handlePsqlError,
} = require("./controllers/errors.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

// handling an invalid api path
app.all("/*", handle404);
//handling other errors
app.use(handlePsqlError);

module.exports = app;
