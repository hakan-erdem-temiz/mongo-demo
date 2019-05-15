const _ = require("lodash");
const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost/mongo-exercises")
//   .then(() => console.log("Connected"))
//   .catch(() => console.log("error here"));

const Schema = mongoose.Schema;
var scheme = new Schema({
  request: {
    type: Schema.ObjectId,
    ref: "Request"
  },
  agent_name: String,
  agent_login_id: String,
  agent_extension: String,
  transition_time: String,
  agent_state: String,
  reason_code: String,
  duration: Number,
  latestSynchedTime: String,
  day: String,
  hour: Number,
  year: Number,
  month: String,
  numberOfmonth: Number,
  dayOfMonth: Number,
  numberOfDay: Number,
  dayOfWeek: Number,
  interval_start_time: String,
  interval_end_time: String
});

const AgentStateDetail = mongoose.model("AgentStateDetail", scheme);
const ReasonCode = require("./reason-code");

async function getFormattedListHourlyAndDailyRS(req, res, next) {
  //let rc = await ReasonCode.find({}, { label: 1, code: 1 });
  let rc = await ReasonCode.aggregate([{ $project: { _id: 1, label: 1 } }]);
  let reasonCodes = [];
  rc.map(r => (reasonCodes[r.label] = r._id));

  /// test area
  const start = "2018-11-28 00:00:00";
  const end = "2018-11-30 00:00:00";
  const startRangeHour = "00"; // req.body.shift.start;
  const endRangeHour = "24"; // req.body.shift.end;
  const agents = ["agent6161", "osman", "KaanVM", "kaanboz", "mehmetali"]; //agent_name
  let datas;
  try {
    datas = await AgentStateDetail.aggregate([
      {
        $match: {
          interval_start_time: { $gte: start },
          interval_end_time: { $lte: end },
          agent_login_id: { $in: agents }
        }
      },

      {
        $project: {
          hour: { $substr: ["$transition_time", 11, 2] },
          day: "$day", //{ $substr: ["$transition_time", 8, 2] },
          transition_time: 1,
          agent_login_id: 1,
          agent_state: 1,
          reason_code: 1,
          duration: 1
        }
      },
      {
        $match: {
          hour: { $gte: startRangeHour, $lte: endRangeHour }
        }
      },

      {
        $group: {
          _id: {
            hour: "$hour",
            day: "$day"
          },
          data: {
            $push: {
              hour: "$_id.hour",
              transition_time: "$transition_time",
              agentId: "$agent_login_id",
              states: "$agent_state",
              reasons: "$reason_code",
              duration: "$duration"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            day: "$_id.day"
          },
          // agent_login_id: { $first: "$agent_login_id" },
          // transition_time: { $first: "$transition_time" },
          // agent_state: { $first: "$agent_state" },
          // reason_code: { $first: "$reason_code" },
          // duration: { $first: "$duration" }
          data: {
            $push: {
              hour: "$_id.hour",
              transition_time: "$data.transition_time",
              agentId: "$data.agentId",
              states: "$data.states",
              reasons: "$data.reasons",
              duration: "$data.duration"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  } catch (err) {
    throw Error(err);
  }

  console.log(JSON.stringify(datas, null, 2));
  let outputIntervals = [];

  datas.map(intervals => {
    let dateIntervals = {
      hour: intervals._id.hour,
      agents: []
    };

    _.mapValues(_.groupBy(intervals.agents, "agentId"), alist => {
      let agentDataModel = {
        agentId: 0,
        states: {
          // ready: 0,
          // notReady: 0,
          // reserved: 0,
          // talking: 0,
          // work: 0,
          // hold: 0
        },
        reasons: {
          // "250": 0,
          // "251": 0,
          // "252": 0,
          // "32760": 0,
          // "32761": 0,
          // "32762": 0
        }
      };

      alist.map(agentData => {
        const state = camelize(agentData.states);

        // if (agentDataModel.states[state] || agentDataModel.states[state] == 0) {
        //   agentDataModel.states[state] += agentData.duration;
        // }

        if (state) {
          if (agentDataModel.states[state]) {
            agentDataModel.states[state] += agentData.duration;
          } else {
            agentDataModel.states[state] = agentData.duration;
          }
        }

        const reasonCode = reasonCodes[agentData.reasons];

        if (reasonCode) {
          if (agentDataModel.reasons[reasonCode]) {
            agentDataModel.reasons[reasonCode] += agentData.duration;
          } else {
            agentDataModel.reasons[reasonCode] = agentData.duration;
          }
        }

        agentDataModel.agentId = agentData.agentId;
      });

      dateIntervals.agents.push(agentDataModel);
    });

    outputIntervals.push(dateIntervals);
  });

  //test area

  //console.log(outputIntervals);
  //console.log(JSON.stringify(outputIntervals, null, 2));
  console.log("DONE!!");
  //res.json(outputIntervals); //8
}

async function getFormattedListHourlyAndDaily(req, res, next) {
  const start = "2019-03-00 00:00:00";
  const end = "2019-11-29 00:00:00";

  const $match = {
    interval_start_time: { $gte: start },
    interval_end_time: { $lte: end }
  };

  let datas;
  try {
    datas = await AgentStateDetail.aggregate([
      { $match },
      {
        $group: {
          _id: {
            hour: { $substr: ["$transition_time", 11, 2] },
            day: "$day" // { $substr: ["$transition_time", 8, 2] }
          },
          agents: {
            $push: {
              agentId: "$agent_login_id",
              states: "$agent_state",
              reasons: "$reason_code",
              duration: "$duration"
            }
          }
        }
      },
      { $sort: { "_id.hour": 1 } },
      {
        $group: {
          _id: {
            day: "$_id.day"
          },
          dailyData: {
            $push: {
              hour: "$_id.hour",
              hourlyData: "$agents"
            }
          }
        }
      }
      // {
      //   $project: {
      //     day: "$numberOfDay"
      //   }
      // }
    ]);
  } catch (err) {
    throw Error(err);
  }

  console.log(
    JSON.stringify({ startDate: start, endDate: end, days: datas }, null, 2)
  );
  console.log("DONE!!");
}

async function getFormattedListHourly(req, res, next) {
  //let rc = await ReasonCode.find({}, { label: 1, code: 1 });
  let rc = await ReasonCode.aggregate([{ $project: { _id: 1, label: 1 } }]);
  let reasonCodes = [];
  rc.map(r => (reasonCodes[r.label] = r._id));

  /// test area
  const start = "2017-11-00 00:00:00";
  const end = "2019-11-29 00:00:00";
  const startRangeHour = "00"; // req.body.shift.start;
  const endRangeHour = "24"; // req.body.shift.end;
  const agents = ["agent6161", "osman", "KaanVM", "kaanboz"]; //agent_name

  const $match = {
    interval_start_time: { $gte: start },
    interval_end_time: { $lte: end },
    agent_login_id: { $in: agents }
  };

  const $group = {
    _id: {
      hour: { $substr: ["$transition_time", 11, 2] },
      day: { $substr: ["$transition_time", 8, 2] }
    },
    agents: {
      $push: {
        agentId: "$agent_login_id",
        states: "$agent_state",
        reasons: "$reason_code",
        duration: "$duration"
      }
    }
  };

  let datas;
  try {
    datas = await AgentStateDetail.aggregate([
      { $match },

      {
        $project: {
          hour: { $substr: ["$transition_time", 11, 2] },
          day: { $substr: ["$transition_time", 8, 2] },
          transition_time: 1,
          agent_login_id: 1,
          agent_state: 1,
          reason_code: 1,
          duration: 1
        }
      },
      {
        $match: {
          hour: { $gte: startRangeHour, $lte: endRangeHour }
        }
      },

      {
        $group
      },
      { $sort: { _id: 1 } }
    ]);
  } catch (err) {
    throw Error(err);
  }

  //console.log(JSON.stringify(datas, null, 2));
  let outputIntervals = [];

  datas.map(intervals => {
    let dateIntervals = {
      hour: intervals._id.hour,
      agents: []
    };

    _.mapValues(_.groupBy(intervals.agents, "agentId"), alist => {
      let agentDataModel = {
        agentId: 0,
        states: {
          // ready: 0,
          // notReady: 0,
          // reserved: 0,
          // talking: 0,
          // work: 0,
          // hold: 0
        },
        reasons: {
          // "250": 0,
          // "251": 0,
          // "252": 0,
          // "32760": 0,
          // "32761": 0,
          // "32762": 0
        }
      };

      alist.map(agentData => {
        const state = camelize(agentData.states);

        // if (agentDataModel.states[state] || agentDataModel.states[state] == 0) {
        //   agentDataModel.states[state] += agentData.duration;
        // }

        if (state) {
          if (agentDataModel.states[state]) {
            agentDataModel.states[state] += agentData.duration;
          } else {
            agentDataModel.states[state] = agentData.duration;
          }
        }

        const reasonCode = reasonCodes[agentData.reasons];

        if (reasonCode) {
          if (agentDataModel.reasons[reasonCode]) {
            agentDataModel.reasons[reasonCode] += agentData.duration;
          } else {
            agentDataModel.reasons[reasonCode] = agentData.duration;
          }
        }

        agentDataModel.agentId = agentData.agentId;
      });

      dateIntervals.agents.push(agentDataModel);
    });

    outputIntervals.push(dateIntervals);
  });

  //test area

  //console.log(outputIntervals);
  console.log(JSON.stringify(outputIntervals, null, 2));
  console.log("DONE!!");
  //res.json(outputIntervals); //8
}

async function updateQueryFirstCourse() {
  console.log("started...");

  const start = "2019-02-07 00:00:00";
  const end = "2019-02-10 00:00:00";

  const $match = {
    interval_start_time: { $gte: start },
    interval_end_time: { $lte: end }
  };

  const $group = {
    _id: {
      startDateTime: "$interval_start_time",
      endDateTime: "$interval_end_time"
    },
    agents: {
      $push: {
        agentId: "$agent_login_id",
        states: "$agent_state",
        reasons: "$reason_code",
        duration: "$duration"
      }
    }
  };

  const group2 = {
    $group: {
      _id: "$agents.agentId",
      agentsById: {
        $push: {
          agentId: "$agentId",
          states: "$agentId",
          reasons: "$agentId",
          duration: "$duration"
        }
      }
    }
  };

  let datas;
  try {
    datas = await AgentStateDetail.aggregate([
      { $match },
      {
        $group: {
          _id: {
            startDateTime: "$interval_start_time",
            endDateTime: "$interval_end_time",
            agentId: "$agent_login_id",
            state: "$agent_state"
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $group: {
          _id: {
            startDateTime: "$_id.startDateTime",
            endDateTime: "$_id.endDateTime",
            agentId: "$_id.agentId"
          },
          stateNames: {
            $push: {
              name: "$_id.state",
              count: "$count"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            startDateTime: "$_id.startDateTime",
            endDateTime: "$_id.endDateTime"
          },
          agents: {
            $push: {
              agentId: "$_id.agentId",
              states: "$stateNames"
            }
          }
        }
      }
    ]);
  } catch (err) {
    throw Error(err);
  }

  console.log(JSON.stringify(datas, null, 2));
  console.log("Done");
}

async function getFormattedList(req, res, next) {
  //let rc = await ReasonCode.find({}, { label: 1, code: 1 });
  let rc = await ReasonCode.aggregate([{ $project: { _id: 1, label: 1 } }]);
  let reasonCodes = [];
  rc.map(r => (reasonCodes[r.label] = r._id));

  /// test area
  const start = "2019-02-07 00:00:00";
  const end = "2019-02-10 00:00:00";

  const $match = {
    interval_start_time: { $gte: start },
    interval_end_time: { $lte: end }
  };

  const $group = {
    _id: {
      startDateTime: "$interval_start_time",
      endDateTime: "$interval_end_time"
    },
    agents: {
      $push: {
        agentId: "$agent_login_id",
        states: "$agent_state",
        reasons: "$reason_code",
        duration: "$duration"
      }
    }
  };

  let datas;
  try {
    datas = await AgentStateDetail.aggregate([
      { $match },
      {
        $group
      }
    ]);
  } catch (err) {
    throw Error(err);
  }

  let outputIntervals = [];

  datas.map(intervals => {
    let dateIntervals = {
      startDateTime: intervals._id.startDateTime,
      endDateTime: intervals._id.endDateTime,
      agents: []
    };

    _.mapValues(_.groupBy(intervals.agents, "agentId"), alist => {
      let agentDataModel = {
        agentId: 0,
        states: {
          // ready: 0,
          // notReady: 0,
          // reserved: 0,
          // talking: 0,
          // work: 0,
          // hold: 0
        },
        reasons: {
          // "250": 0,
          // "251": 0,
          // "252": 0,
          // "32760": 0,
          // "32761": 0,
          // "32762": 0
        }
      };

      alist.map(agentData => {
        const state = camelize(agentData.states);

        // if (agentDataModel.states[state] || agentDataModel.states[state] == 0) {
        //   agentDataModel.states[state] += agentData.duration;
        // }

        if (state) {
          if (agentDataModel.states[state]) {
            agentDataModel.states[state] += agentData.duration;
          } else {
            agentDataModel.states[state] = agentData.duration;
          }
        }

        const reasonCode = reasonCodes[agentData.reasons];

        if (reasonCode) {
          if (agentDataModel.reasons[reasonCode]) {
            agentDataModel.reasons[reasonCode] += agentData.duration;
          } else {
            agentDataModel.reasons[reasonCode] = agentData.duration;
          }
        }

        agentDataModel.agentId = agentData.agentId;

        //return _.omit(agentData, "agentId");
      });

      dateIntervals.agents.push(agentDataModel);
    });

    outputIntervals.push(dateIntervals);
  });

  //test area
  console.log(JSON.stringify(outputIntervals, null, 2));
  console.log("DONE!!");
  //res.json(outputIntervals); //8
}

function camelize(str) {
  str = str.replace("-", " ");
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

exports.getFormattedListHourlyAndDailyRS = getFormattedListHourlyAndDailyRS;
exports.getFormattedListHourlyAndDaily = getFormattedListHourlyAndDaily;
exports.getFormattedListHourly = getFormattedListHourly;
exports.updateQueryFirstCourse = updateQueryFirstCourse;
exports.getFormattedList = getFormattedList;
