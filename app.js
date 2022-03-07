const express = require("express");
const { getEndpoints } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const {
  getArticleById,
  getArticles,
  patchArticleById,
  getCommentsById,
  postComment,
} = require("./controllers/articles.controller");
const {
  handle404,
  handlePsqlError,
  handle500,
  handleCustomError,
} = require("./controllers/errors.controller");
const app = express();
app.use(express.json());
const cors = require("cors");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);

// handling an invalid api path
app.all("/*", handle404);
//handling other errors
app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handle500);

module.exports = app;
