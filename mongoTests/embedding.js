const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema]
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.update(
    { _id: courseId },
    {
      $set: {
        "author.name": "Hakan Erdem Temiz"
      }
    }
  );
}

//updateAuthor("5c6a5bbb576f39059bf139d1");

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

removeAuthor("5c6a5f207d4a29061fee2a2e", "5c6a60d9df1f12063fd68e1b");

//addAuthor("5c6a5f207d4a29061fee2a2e", new Author({ name: "Mimi" }));

// createCourse("Node Course", [
//   new Author({ name: "Hkn" }),
//   new Author({ name: "Erdm" })
// ]);
