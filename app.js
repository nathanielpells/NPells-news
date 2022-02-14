const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const { handle404 } = require("./controllers/errors.controller");

app.get("/api/topics", getTopics);
// handling an invalid api path
app.all("/*", handle404);

module.exports = app;
