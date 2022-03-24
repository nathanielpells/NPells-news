const db = require("../db/connection");

exports.fetchArticleById = async (id) => {
  const { rows: article } = await db.query(
    "SELECT articles.*, COUNT(comments) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
    [id]
  );
  if (article.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
  return article[0];
};

exports.updateArticle = async (id, votes) => {
  const { rows } = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
    [id, votes]
  );
  const article = rows[0];
  if (!article) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${id}`,
    });
  }
  return article;
};

exports.fetchArticles = async (sort_by, order, topic, limit = 10, p) => {
  //MAIN QUERY
  let queryStr = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.votes,articles.created_at,CAST(COUNT(comments.comment_id)AS int) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;
  //SORT_BY
  let sortByStr = `ORDER BY articles.created_at `;
  if (sort_by) {
    if (
      ![
        "title",
        "article_id",
        "topic",
        "author",
        "body",
        "votes",
        "created_at",
        "comment_count",
      ].includes(sort_by)
    ) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
    sortByStr = `ORDER BY ${sort_by} `;
  }

  //ORDER
  if (order) {
    if (!["ASC", "DESC"].includes(order)) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
    sortByStr += `${order} `;
  } else {
    sortByStr += `DESC `;
  }
  //TOPIC
  const queryValues = [];
  if (topic) {
    const { rows: topics } = await db.query(
      "SELECT * FROM topics WHERE slug = $1;",
      [topic]
    );

    if (topics.length === 0) {
      return Promise.reject({ status: 404, msg: "topic not found" });
    }

    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  // LIMIT;
  let limitStr = "";
  if (limit) {
    if (!/\d/.test(limit)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    limitStr = `LIMIT ${limit} `;
  }
  //PAGE
  let pageStr = ";";
  if (p) {
    if (!/\d/.test(p)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    pageStr = `OFFSET ${(p - 1) * limit};`;
  }

  //DO QUERY
  // queryStr += `GROUP BY articles.article_id ` + sortByStr + limitStr + pageStr;
  const { rows: rows_1 } = await db.query(
    queryStr + `GROUP BY articles.article_id ` + sortByStr + limitStr + pageStr,
    queryValues
  );
  const [articles, { rowCount }] = await Promise.all([
    rows_1,
    db.query(
      queryStr + `GROUP BY articles.article_id ` + sortByStr,
      queryValues
    ),
  ]);
  return { articles, total_count: rowCount };
};

exports.fetchCommentsById = async (id) => {
  const comments = await db.query(
    "SELECT * FROM comments WHERE article_id = $1;",
    [id]
  );
  return comments.rows;
};

exports.addComment = async (id, reqBody) => {
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
    const { rows: comment } = await db.query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [id, username, body]
    );
    return comment;
  }
};
