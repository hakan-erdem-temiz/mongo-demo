const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(console.log("Connected"))
  .catch(console.log("error here"));

const Schema = {
  tags: [String],
  date: { type: Date, default: Date.now },
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number
};

const Course = mongoose.model("Course", Schema);

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

run();

// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost/playground")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(() => console.log("Could not connect"));

// const skillSchema = new mongoose.Schema({
//   name: String,
//   Level: String,
//   tags: [String],
//   date: { type: Date, default: Date.now },
//   isLiked: Boolean
// });

// const Skill = mongoose.model("Skill", skillSchema); // Pascal Case for classes

// async function createSkill() {
//   const skill = new Skill({
//     name: "ReactJS",
//     Level: "Mid",
//     tags: ["frontend"],
//     isLiked: true
//   });

//   const result = await skill.save();
//   console.log(result);
// }

// //createSkill();

// async function getSkills() {
//   const pageNumber = 2;
//   const pageSize = 10;

//   const skills = await Skill.find({ isLiked: true })
//     // .find({name:'/^StartsWith/'})
//     // .find({name:'/EndsWith$/i'}) //i ignore lowerupper case
//     // .find({name:'/.*Contains.*/i'})
//     //.find({isLİked:{$in:[true,false]}})
//     .skip((pageNumber - 1) * pageSize)
//     .or([{ Level: "Mid" }, { Level: "Expert" }])
//     //.and([])
//     .limit(pageSize)
//     .sort({ name: 1 }) // 1 is decending -1 reverse
//     .select({ name: 1, tags: 1 }); //get only name and tags propories
//   // .count();
//   console.log(skills);
// }

// getSkills();
