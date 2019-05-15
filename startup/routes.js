const express = require("express");
const cscDailyDigest = require("../routes/csc-daily-digest");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.use("/cscdailydigest", cscDailyDigest);

  // console.log(`NODE_ENV: ${process.env.NODE_ENV}`); //undefined
  // app.get('env'); //development
};
