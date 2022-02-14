const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

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
            console.log(topic);
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
});
