const mongoose = require("mongoose");

function createDatabase() {
  mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("connected to mongodb test messagse"))
    .catch((err) => console.log(err.message));

  const genreSchema = new mongoose.Schema({
    id: Number,
    name: String,
  });
  const Genre = mongoose.model("Genre", genreSchema);
  const genre = new Genre({
    id: 1,
    name: "Porn",
  });
  genre.save();
}

/*
const Course = mongoose.model("Course", courseSchema); // creates a class
async function createCourse() {
  const course = new Course({
    name: "angular course",
    author: "pedro",
    tags: ["angular", "frontend"],
    isPublished: true,
  });



getCourses();

async function getCourses() {
  const courses = await Course.find({ author: "pedro", isPublished: true })
    .limit(10)
    .sort({ name: 1 }) //problem here, course is not global
    .select({ name: 1, tags: 1 });
  // .count -->returns number of results
  console.log(courses);
}
//const result = await genre.save();
//console.log(result);
*/
