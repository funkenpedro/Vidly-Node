let server;
const request = require("supertest");

describe("/api/genres", () => {
  //inside here add more test suites
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
  }); // you need to start and stop the server for each test run
  // or you will try to use an already open port

  describe("GET /", () => {
    it("should return all genres", async () => {
      const res = await request(server).get("/api/genres"); //request is a supertest function
      expect(res.status).toBe(200);
    });
  });
});
