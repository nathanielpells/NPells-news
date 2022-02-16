const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const {
  handle404,
  handlePsqlError,
  handleCustomError,
} = require("./controllers/errors.controller");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controller");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

// handling an invalid api path
app.all("/*", handle404);
//handling other errors
app.use(handlePsqlError);
app.use(handleCustomError);

module.exports = app;
