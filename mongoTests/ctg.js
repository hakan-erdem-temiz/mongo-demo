const CalltypeGroup = require("../models/call-types-groups");
const CallsHistDigest = require("../models/calls-hist-digest-daily");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const _ = require("lodash");
//ctg/calls-offered
async function getCalls(req, res) {
  const $match = {
    userId: ObjectId("5cca956156bac15519a90fc6")
  };

  let datas;
  try {
    datas = await CalltypeGroup.aggregate([{ $match }]);
  } catch (err) {
    throw Error(err);
  }

  let groupsOffers = [];

  await Promise.all(
    datas.map(async d => {
      const group = await getSumOffered(d.group);
      groupsOffers.push({ name: d.name, data: group });
      return group;
    })
  );

  let dailyCallsGroups = [];

  for (i = 0; i < 31; i++) {
    dailyCallsGroups.push({});
  }
  groupsOffers.map(groups => {
    let index = 0;

    groups.data.map(g => {
      dailyCallsGroups[index][groups["name"]] = g.sumOffered;
      dailyCallsGroups[index].time = g.time;
      index++;
    });
  });

  console.log(JSON.stringify(dailyCallsGroups, null, 2));

  //console.log(datas);
}

async function getSumOffered(calltypes) {
  let dailyCalls;
  try {
    dailyCalls = await CallsHistDigest.aggregate([
      {
        $match: {
          id: { $in: calltypes }
        }
      },
      {
        $group: {
          _id: {
            time: "$datetime"
          },
          data: {
            $push: {
              id: "$id",
              offered: "$offered"
            }
          },
          sum_offered: {
            $sum: "$offered"
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          time: "$_id.time",
          sumOffered: "$sum_offered"
        }
      }
    ]);
  } catch (err) {
    throw Error(err);
  }
  return dailyCalls;
  console.log(JSON.stringify(dailyCalls, null, 2));
}

//ctg/calls-offered-percent
async function getCallsPercent(req, res) {
  const $match = {
    userId: ObjectId("5cca956156bac15519a90fc6")
  };

  let datas;
  try {
    datas = await CalltypeGroup.aggregate([{ $match }]);
  } catch (err) {
    throw Error(err);
  }

  console.log(datas);
}

exports.getCalls = getCalls;
