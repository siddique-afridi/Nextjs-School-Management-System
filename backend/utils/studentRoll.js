import mongoose from "mongoose";

const Counter = mongoose.model(
  "Counter",
  new mongoose.Schema({
    id: String,
    seq: Number,
  }),
);

const getNextRollNo = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: "studentRoll" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return counter.seq;
};

export default getNextRollNo;