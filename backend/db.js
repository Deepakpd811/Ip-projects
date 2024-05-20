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
const student = new mongoose.Schema({
  name:String,
  studentId: String,
  features: String,
  timestamp: { type: Date, default: Date.now },
});

const attendanceMarkedSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true, // Ensure a student reference is provided
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Excused', 'Late'],
  },
  date: { type: Date, default: Date.now },
});

attendanceMarkedSchema.pre('save', function(next) {
  if (!this.status) { // Check if status is not set
    this.status = 'Absent';
  }
  next();
});



const AttendanceMarked = mongoose.model('AttendanceMarked', attendanceMarkedSchema);
const Student = mongoose.model("Attendance", student);

module.exports = {AttendanceMarked,Student}