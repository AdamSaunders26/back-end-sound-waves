const app = require("../dist/app");
const seed = require("../dist/db/seeds/seed");
const testData = require("../dist/db/test-data/index");
const request = require("supertest");
const db = require("../dist/db/connection");

beforeEach(() => seed(testData));
afterAll(() => {
  db.end();
});

describe("GET /api/waves", () => {
  test("200: should return all 10 waves", () => {
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
        };
        waves.forEach((wave) => {
          expect(wave).toMatchObject(expectedWave);
        });
      });
  });
});
describe("GET /api/boards", () => {
  test("200: should return all boards", () => {
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
        };
        boards.forEach((board) => {
          expect(board).toMatchObject(expectedBoards);
        });
      });
  });
});

describe("GET /api/waves/:wave_id/comments", () => {
  test("200: should return all the comments for a specific wave_id", () => {
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
          comment_id: expect.any(Number),
          wave_id: expect.any(Number),
        };
        comments.forEach((comment) => {
          expect(comment).toMatchObject(expectedComments);
        });
      });
  });
});

describe('GET /api/boards', () => {
    test('200: should return all boards', () => {
        return request(app)
            .get('/api/boards')
            .expect(200)
            .then(({ body }) => {
                const { boards } = body
                expect(Array.isArray(boards)).toBe(true)
                expect(body.boards).toHaveLength(10)
                const expectedBoards = {
                    board_id: expect.any(Number),
                    title: expect.any(String),
                    slug: expect.any(String),
                    created_at: expect.any(String),
                    user_id: expect.any(Number),
                    description: expect.any(String),
                }
                boards.forEach((board) => {
                    expect(board).toMatchObject(expectedBoards)
                })
            })
    });
});

describe('POST /api/waves', () => {
    test.only('201: Creates a new wave', () => {
        const testFormData = new FormData;

        testFormData.append('title', 'Test Wave Title');
        testFormData.append('username', 'testuser');
        testFormData.append('board_slug', 'board-slug');

        const testUpload = new Blob()

        // const testRequestData = {
        //     title: 'Test Wave Title',
        //     username: 'testuser',
        //     board_slug: 'board-slug',
        //     upload: fs
        // };

         console.log(testFormData);
    });
});
