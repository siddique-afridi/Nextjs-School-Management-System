const AggUser = require("../../models/aggModel/aggModel");

exports.aggregatePractice = async () => {
  try {
    await AggUser.insertMany([
      { name: "Ali", country: "Pakistan", age: 22, isActive: true },
      { name: "Sara", country: "Pakistan", age: 27, isActive: false },
      { name: "John", country: "USA", age: 31, isActive: true },
      { name: "Emily", country: "UK", age: 24, isActive: true },
      { name: "Ahmed", country: "Pakistan", age: 29, isActive: false },
    ]);
    console.log("Users inserted successfully!");
  } catch (err) {
    console.log("nothing");
  }
};

exports.getUserBYCountry = async (req, res) => {
  try {
    const result = await AggUser.aggregate([
      {
        $match: { country: "Pakistan" },                 //match returns all the documents that has same specified field
      },
      {
        $project: {_id:0, name: 1, country: 1, age:1 },
      },
      {
        $group :{                             //group returns single document that has same specified field, group must use accumulator($sum,$avg  etc)
          _id : "$country",
          totalUsers: {$sum:1}
        }
      },

    ]);

    console.log("aggregation result", result);
    res.status(200).json({ message: "aggregated result", result });
  } catch (err) {
    console.log("error fetching users");
  }
};
