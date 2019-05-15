async function exercise1() {
  return await Course.find({
    isPublished: true,
    tag: { $in: ["frontend", "backend"] }
  })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function exercise2() {
  return Course.find({ isPublished: true })
    .sort({ price: -1 })
    .select({ name: 1, author: 1 });
}

async function exercise3() {
  return Course.find({ isPublished: true }).or([
    { price: { $gte: 15 } },
    { name: /.*by.*/i }
  ]);
}

async function run() {
  const ex1 = await exercise1();
  const ex2 = await exercise2();
  const ex3 = await exercise3();
  console.log(ex3);
}

async function updateQueryFirstCourse(id) {
  console.log("test:");
  const course = await Course.findById(id);
  if (!course) return;

  //   course.set({
  //     isPublished: true,
  //     author: "Another Author"
  //   });

  course.isPublished = true;
  course.author = "Another Author";

  const result = await course.save();
  console.log("test:" + result);
}

async function updateFirstCourse(id) {
  const result = Course.update(
    { _id: id },
    {
      $set: {
        author: "het",
        isPublished: false
      }
    }
  );

  console.log(result);
}
async function updateFirstCourse2(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "erdem",
        isPublished: true
      }
    },
    { new: true }
  ); //last paramater for getting updated data. Other wise u get old document data.

  console.log(course);
}

updateQueryFirstCourse("5a68fde3f09ad7646ddec17e");

//test area

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Could not connect"));

const skillSchema = new mongoose.Schema({
  name: String,
  Level: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isLiked: Boolean
});

const Skill = mongoose.model("Skill", skillSchema); // Pascal Case for classes

async function createSkill() {
  const skill = new Skill({
    name: "ReactJS",
    Level: "Mid",
    tags: ["frontend"],
    isLiked: true
  });

  const result = await skill.save();
  console.log(result);
}

//createSkill();

async function getSkills() {
  const pageNumber = 2;
  const pageSize = 10;

  const skills = await Skill.find({ isLiked: true })
    // .find({name:'/^StartsWith/'})
    // .find({name:'/EndsWith$/i'}) //i ignore lowerupper case
    // .find({name:'/.*Contains.*/i'})
    //.find({isLİked:{$in:[true,false]}})
    .skip((pageNumber - 1) * pageSize)
    .or([{ Level: "Mid" }, { Level: "Expert" }])
    //.and([])
    .limit(pageSize)
    .sort({ name: 1 }) // 1 is decending -1 reverse
    .select({ name: 1, tags: 1 }); //get only name and tags propories
  // .count();
  console.log(skills);
}

getSkills();
