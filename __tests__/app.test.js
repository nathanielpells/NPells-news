const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles.js");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("app", () => {
  test("status: 404 - response with message - page not found", () => {
    return request(app)
      .get("/bad/path/")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("page not found");
      });
  });
});

describe("GET - /api/topics", () => {
  test("status 200 responds with an array of treasure objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
      });
  });
  test("status 200. topics object should have all of the required properties.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const resObj = res.body;
        resObj.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });

  describe("GET - /api/articles/:article_id", () => {
    test("status 200, responds the correct object with the correct properties and values", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.author).toEqual("butter_bridge"),
            expect(article.title).toEqual(
              "Living in the shadow of a great man"
            ),
            expect(article.article_id).toEqual(1),
            expect(article.body).toEqual("I find this existence challenging"),
            expect(article.topic).toEqual("mitch"),
            expect(typeof article.created_at).toBe("string"),
            expect(article.votes).toEqual(100);
        });
    });
    test("status 400 for a post with the wrong data type with a message of invalid data type given", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "invalid data type(s) given" });
        });
    });
  });

  describe("PATCH - /api/articles/:article_id ", () => {
    test("status 200 - update the first article so its votes is incremented by a positive number then respond with the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 101,
            })
          );
        });
    });
    test("status 200 - update the first article so its votes is incremented by a negative then respond with the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 99,
            })
          );
        });
    });
    test("status 400 for a request with an invalid increment number object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "hello" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "invalid data type(s) given" });
        });
    });
    test("status 400 for a request with an invalid id", () => {
      return request(app)
        .patch("/api/articles/hello")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "invalid data type(s) given" });
        });
    });
    test("status 400 for a request with an invalid object key and property", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ hello: "hello" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "invalid key and property given" });
        });
    });

    test("status: 404 - id requested is the correct data type but does not exist", () => {
      return request(app)
        .patch("/api/articles/123456789")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 123456789");
        });
    });
  });

  describe("GET - /api/users", () => {
    test("status 200 - responds with all of the objects with the username property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          const resObj = res.body;
          resObj.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 404 - response with message - page not found", () => {
      return request(app)
        .get("/bad/path/")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("page not found");
        });
    });
  });
  describe("GET - GET /api/articles", () => {
    test("status 200, responds with article object with all of the required properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const resObj = res.body;
          resObj.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200 - returns articles objects ordered by date by default and in descending ordering ", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status: 404 - response with message - page not found", () => {
      return request(app)
        .get("/bad/path/")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("page not found");
        });
    });
  });

  describe("GET - /api/articles/:article_id/comments", () => {
    test("Status 200 - respond with an array of comments for the given article_id with all of the correct properties.", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          const resObj = res.body;
          resObj.comments.forEach((comments) => {
            expect(comments).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status 400 for a request with an invalid id", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "invalid data type(s) given" });
        });
    });
    test("status: 404 - id requested is the correct data type but does not exist", () => {
      return request(app)
        .patch("/api/articles/123456789")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 123456789");
        });
    });
  });

  describe("GET - /api/articles/:article:id (comment count)", () => {
    test("status 200 - responds with the correct article with a comment_count property added.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: 11,
            })
          );
        });
    });
  });
});
