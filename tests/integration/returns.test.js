//post /api/returns {customerId, movie}
//the test cases
//return 401 if client is not logged  in
// return 400 if custoerId is not proviede
// return 400 if mmovieID is not provided
// return 404 if no rental is found for this customer and movie
// return 400 if rental already processed
// return 200 if valid request
// set the return date
// calculate the rental fee
// increaset the stock
// return the rental to the client

const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");

describe("/api/returns", () => {
  let customerId;
  let server;
  let movieId;
  let rental;
  let token;
  let movie;
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();
    rental = new Rental({
      customer: {
        name: "232323",
        phone: "1234567",
        _id: customerId,
      },
      movie: { _id: movieId, title: "123456", dailyRentalRate: 2 },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    // you need to start and stop the server for each test run
    // or you will try to use an already open port
    await Rental.remove({}); //this is here to clean up after tests creation of documents in database
    await Movie.remove({});
  });
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 if rental has been processed", async () => {
    //set the return ddateReturnedate first
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if its a valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should set the return date if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(15000);
  });
  it("should set the rental fee input is valid", async () => {
    //have to set date out
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  it("should increase teh movie stock", async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(11);
  });
  it("should return rental if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    //expect(res.body).toMatchObject(rentalInDb);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
