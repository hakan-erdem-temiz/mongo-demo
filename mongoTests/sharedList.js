const CallsHistDigest = require("../models/calls-hist-digest-daily");

async function getList() {
  //Fake Request Data
  const start = "2019-11-28 00:00:00"; // req.body.shift.start;
  const end = "2019-11-30 00:00:00"; // req.body.shift.end;
  const calltypeList = [
    { id: 6692, name: "a" },
    { id: 5001, name: "abc" },
    { id: 6646, name: "bbc" }
  ]; // req.body.shift.calltypeList;
  //
  const calltypeIds = [];
  calltypeList.map(c => calltypeIds.push(c.id));

  let endDay = 30;
  const $match = {
    datetime: { $gte: start },
    datetime: { $lte: end },
    id: { $in: calltypeIds }
  };

  let datas;
  try {
    datas = await CallsHistDigest.aggregate([{ $match }]);
  } catch (err) {
    throw Error(err);
  }

  let dailyCalls = [];

  datas.map(data => {
    for (let i = 0; i <= endDay; i++) {
      i = i < 10 ? "0" + i.toString() : i.toString();
      data.datetime = data.datetime.replace(
        /(\d{4})-(\d{2})-(\d{2})/,
        `$1-$2-${i}`
      );

      dailyCalls.push(Object.assign({}, data));
    }
  });

  console.log(dailyCalls);
  return dailyCalls;
}

// function callTypesOffered() {
//   const callsHistDigest = getList();

//   //Fake Request Data
//   const start = "2019-11-28 00:00:00"; // req.body.shift.start;
//   const end = "2019-11-30 00:00:00"; // req.body.shift.end;
//   const calltypeList = [{ id: 5001, name: "abc" }, { id: 5002, name: "bbc" }]; // req.body.shift.calltypeList;
//   //
//   const calltypeIds = [];
//   calltypeList.map(c => calltypeIds.push(c.id));

//   let endDay = 30;
//   const $match = {
//     datetime: { $gte: start },
//     datetime: { $lte: end },
//     id: { $in: calltypeIds }
//   };

//   callsHistDigest.aggregate([$match]);
// }

exports.getList = getList;
//exports.callTypesOffered = callTypesOffered;
