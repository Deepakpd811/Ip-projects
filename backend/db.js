const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/attendance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define schema for attendance records
const attendanceSchema = new mongoose.Schema({
  name:String,
  studentId: String,
  features: String,
  timestamp: { type: Date, default: Date.now },
});

const attendanceMarkedSchema = new mongoose.Schema({
  id: String,
  marked:String,
  date: { type: Date, default: Date.now }
});

const AttendanceMarked = mongoose.model('AttendanceMarked', attendanceMarkedSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = {AttendanceMarked,Attendance}