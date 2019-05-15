const mongoose = require("mongoose");
const express = require("express");
const config = require("config");
var app = express();

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected"))
  .catch(() => console.log("error here"));

require("./startup/routes")(app);

const {
  getFormattedListHourlyAndDailyRS,
  getFormattedListHourlyAndDaily,
  getFormattedListHourly,
  updateQueryFirstCourse,
  getFormattedList
} = require("./mongoTests/agent-state-detail");

const { getList, callTypesOffered } = require("./mongoTests/sharedList");
const {
  CreateCalltypeGroup,
  GetCalltypeGroup,
  DeleteCalltypeGroup,
  UpdateCalltypeGroup
} = require("./mongoTests/calltypeGroupList");

const { getCalls } = require("./mongoTests/ctg");
//getFormattedListHourlyAndDailyRS();
//getList();

//----- CalltypeGroup

//CreateCalltypeGroup();
//UpdateCalltypeGroup();
//DeleteCalltypeGroup();
//GetCalltypeGroup();
//getCalls();

const port = "5050"; //process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
