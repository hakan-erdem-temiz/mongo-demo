const express = require("express");
const router = express.Router();

const cscDailyDigest = require("../models/csc-daily-digest");

module.exports = router;

router.post("/daily", async (req, res) => {
  const start = req.body.startTime;
  const end = req.body.endTime;

  const $match = {
    date: { $gte: start, $lte: end }
  };

  let data;
  try {
    data = await cscDailyDigest.aggregate([{ $match }]);
  } catch (err) {
    throw Error(err);
  }

  console.log("csc-daily-digest.....");
  console.log(data);
  res.send(data);
});
