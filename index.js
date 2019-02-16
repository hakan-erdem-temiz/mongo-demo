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
