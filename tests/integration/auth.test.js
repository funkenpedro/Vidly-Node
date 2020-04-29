const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
    // you need to start and stop the server for each test run
    // or you will try to use an already open port
  });
  let token;
  //happy path
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
/*
Issues running these tests?

I found the answer to this issue.
the solution is added --runInBand at our package.json

"test": "jest --watchAll --verbose --runInBand"
*/
