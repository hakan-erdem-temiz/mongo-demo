const Joi = require("joi");
ObjectID = require("mongodb").ObjectID;

const CalltypeGroup = require("../models/call-types-groups");

function validateCalltypeGroup(group) {
  const ctGroupSchema = {
    name: Joi.string().required(),
    group: Joi.array().required()
  };

  return Joi.validate(group, ctGroupSchema);
}

async function CreateCalltypeGroup(req, res) {
  console.log("testing ctGroup");

  //fake Request
  req = {};
  req.body = {};
  req.body.userId = "5cca956156bac15519a90fc6";
  req.body.name = "BILLING";
  req.body.group = [1, 5001, 5002];
  //fake Request

  // const { error } = validateCalltypeGroup(req.body);
  // if (error)  return res.status(400).send(error.details[0].message + req.body);

  const ctGroup = new CalltypeGroup({
    userId: req.body.userId,
    name: req.body.name,
    group: req.body.group
  });

  await ctGroup.save();
  //res.send(ctGroup);
}

async function GetCalltypeGroup(req, res) {
  //fake Request
  req = {};
  req.body = {};
  req.body.id = "5cca943e2ab7d254d30aa3ad";
  //fake Request

  const ctGroup = await CalltypeGroup.findById(req.body.id); //skills.find(s => s.id === parseInt(req.params.id));
  // if (!ctGroup) {
  //   return res.status(404).send("The group with given ID was not found.");
  // }

  console.log(ctGroup);

  //res.send(skill);
}

async function DeleteCalltypeGroup(req, res) {
  //fake Request
  req = {};
  req.params = {};
  req.params.id = "5cca943e2ab7d254d30aa3ad";
  //fake Request

  const ctGroup = await CalltypeGroup.findByIdAndRemove(req.params.id);

  console.log(ctGroup);

  //res.send(ctGroup);
}

async function UpdateCalltypeGroup() {
  console.log("updating..");
  // const { error } = validate(req.body);
  // if (error) return res.send(error.details[0].message).status(400);

  //fake Request
  req = {};
  req.params = {};
  req.params.id = "5cca943e2ab7d254d30aa3ad";
  req.body = {};
  req.body.id = "5cca1bdbe0502451247494d8";
  req.body.name = "SERVICE";
  req.body.group = [1, 5001, 5002];
  //fake Request

  const ctGroup = await CalltypeGroup.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    group: req.body.group
  });

  // if (!ctGroup)
  //   return res.status(404).send("The group with the given ID was not found.");

  //res.send(ctGroup);

  //   CalltypeGroup.findOne({_id: 123})
  //   .populate('userId')
  //   .exec(function(err, post) {
  //       // do stuff with post
  //   });
}

exports.CreateCalltypeGroup = CreateCalltypeGroup;
exports.GetCalltypeGroup = GetCalltypeGroup;
exports.DeleteCalltypeGroup = DeleteCalltypeGroup;
exports.UpdateCalltypeGroup = UpdateCalltypeGroup;
