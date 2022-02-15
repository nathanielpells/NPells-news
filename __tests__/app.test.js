const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles.js");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("app", () => {
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
    test("status: 404 - response with message - page not found", () => {
      return request(app)
        .get("/bad/path/")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("page not found");
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
    test("status: 404 - response with message - page not found", () => {
      return request(app)
        .get("/bad/path/")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("page not found");
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
});
