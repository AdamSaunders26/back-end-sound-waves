const app = require("../dist/app");
const seed = require("../dist/db/seeds/seed");
const testData = require("../dist/db/test-data/index");
const request = require("supertest");
const db = require("../dist/db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => {
  db.end();
});

describe("GET /api/waves", () => {
  test("200: Should return all 10 waves", () => {
    return request(app)
      .get("/api/waves")
      .expect(200)
      .then(({ body }) => {
        const { waves } = body;
        expect(Array.isArray(waves)).toBe(true);
        expect(body.waves).toHaveLength(10);
        const expectedWave = {
          wave_id: expect.any(Number),
          title: expect.any(String),
          created_at: expect.any(String),
          username: expect.any(String),
          board_name: expect.any(String),
          board_slug: expect.any(String),
          comment_count: expect.any(String),
          likes: expect.any(Number),
          transcript: expect.any(String),
          censor: expect.any(Boolean),
          wave_url: expect.any(String),
          avatar_url: expect.any(String),
        };
        waves.forEach((wave) => {
          expect(wave).toMatchObject(expectedWave);
        });
      });
  });
});

describe("GET /api/boards", () => {
  test("200: Should return all boards", () => {
    return request(app)
      .get("/api/boards")
      .expect(200)
      .then(({ body }) => {
        const { boards } = body;
        expect(Array.isArray(boards)).toBe(true);
        expect(body.boards).toHaveLength(10);
        const expectedBoards = {
          board_name: expect.any(String),
          board_slug: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          username: expect.any(String),
          avatar_url: expect.any(String),
        };
        boards.forEach((board) => {
          expect(board).toMatchObject(expectedBoards);
        });
      });
  });
});

describe("GET /api/waves/:wave_id/comments", () => {
  test("200: Should return all the comments for a specific wave_id", () => {
    return request(app)
      .get("/api/waves/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(body.comments).toHaveLength(2);
        const expectedComments = {
          comment: expect.any(String),
          likes: expect.any(Number),
          created_at: expect.any(String),
          username: expect.any(String),
          avatar_url: expect.any(String),
          comment_id: expect.any(Number),
          wave_id: expect.any(Number),
        };
        comments.forEach((comment) => {
          expect(comment).toMatchObject(expectedComments);
        });
      });
  });
});

describe("GET /api/waves/:wave_id", () => {
  test("200: Should return a single wave when given an id ", () => {
    return request(app)
      .get("/api/waves/4")
      .expect(200)
      .then(({ body }) => {
        const { wave } = body;
        const expectedWave = {
          wave_id: 4,
          title: expect.any(String),
          wave_url: expect.any(String),
          created_at: expect.any(String),
          transcript: expect.any(String),
          likes: expect.any(Number),
          censor: expect.any(Boolean),
          username: expect.any(String),
          avatar_url: expect.any(String),
          board_slug: "jerky-boys-the",
          board_name: expect.any(String),
          comment_count: expect.any(String),
        };
        expect(wave).toMatchObject(expectedWave);
      });
  });
});

describe("POST /api/waves", () => {
  test("201: Creates a new wave", () => {
    const testFormData = new FormData();

    testFormData.append("title", "Test Wave Title");
    testFormData.append("username", "testuser");
    testFormData.append("board_slug", "board-slug");

    const testUpload = new Blob();

    // const testRequestData = {
    //     title: 'Test Wave Title',
    //     username: 'testuser',
    //     board_slug: 'board-slug',
    //     upload: fs
    // };

    // console.log(testFormData);
  });
});

describe("GET /api", () => {
  test("200: Should return an object of the endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/waves?board=board_slug", () => {
  test("200: Should return all the waves from a specific board", () => {
    return request(app)
      .get("/api/waves?board=cottage-country")
      .expect(200)
      .then(({ body }) => {
        const { waves } = body;
        expect(Array.isArray(waves)).toBe(true);
        const expectedWave = {
          wave_id: expect.any(Number),
          title: expect.any(String),
          wave_url: expect.any(String),
          created_at: expect.any(String),
          transcript: expect.any(String),
          likes: expect.any(Number),
          censor: expect.any(Boolean),
          username: expect.any(String),
          board_slug: "cottage-country",
          avatar_url: expect.any(String),
        };
        waves.forEach((wave) => {
          expect(wave).toMatchObject(expectedWave);
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: Should return all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        const expectedUser = {
          username: expect.any(String),
          email: expect.any(String),
          avatar_url: expect.any(String),
          password: expect.any(String),
        };
        users.forEach((user) => {
          expect(user).toMatchObject(expectedUser);
        });
      });
  });
});

describe("POST /api/waves/:wave_id/comments", () => {
  test("201: Should respond with posted comment", () => {
    const commentToPost = {
      username: "BigA",
      comment: "This was very informative.Love it!",
    };
    return request(app)
      .post("/api/waves/1/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("comment_id"),
        expect.any(Number),
        expect(comment.username).toBe("BigA"),
        expect(comment.comment).toBe("This was very informative.Love it!"),
        expect(comment).toHaveProperty("created_at"),
        expect.any(String),
        expect(comment).toHaveProperty("likes"),
        expect(0),
        expect(comment.wave_id).toBe(1);
      });
  });
});
