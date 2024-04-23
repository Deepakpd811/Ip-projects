const faceapi = require("face-api.js");

async function LoadModels() {
  // Load the models
  // __dirname gives the root directory of the server
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
}
LoadModels();

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require('cors')
const bodyParser = require('body-parser')
const { Canvas, Image, loadImage } = require("canvas");
faceapi.env.monkeyPatch({ Canvas, Image });

const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json());

// Connect to MongoDB
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
const Attendance = mongoose.model("Attendance", attendanceSchema);

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Specify the destination folder for uploaded photos
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });

// Function to save face descriptor to database

async function saveFaceDescriptor(userId, photoPath) {
  try {
    // Load the user's photo from the specified path using canvas
    const img = await loadImage(photoPath);

    // Detect the face in the photo and extract facial landmarks and face descriptor
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error("No face detected in the uploaded photo.");
    }

    // Get the face descriptor
    const faceDescriptor = detection.descriptor;

    // Save the face descriptor along with the user ID in the database
    await Attendance.create({ studentId: userId, features: faceDescriptor });

    console.log("Face descriptor saved successfully.");
  } catch (error) {
    console.error("Error saving face descriptor:", error);
  }
}


// Route to handle file upload
app.post("/upload", upload.single("photo"), async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // File uploaded successfully
  const {userName,userId} = req.body;
   // Assuming userId is sent along with the photo
  const photoPath = req.file.path;
  console.log(userName);
  console.log(userId);

  // Call function to save face descriptor to database
  await saveFaceDescriptor(userId, photoPath);

  res.status(200).send("File uploaded successfully.");
});






async function getDescriptorsFromDB(imagePath) {
  try {
    // Load the image from the specified path using canvas
    const img = await loadImage(imagePath);

    // Get all the face data from MongoDB
    const faces = await Attendance.find();

    // Convert features from strings to Float32Array
    const labeledDescriptors = faces.map(face => {
      const faceDescriptorValues = face.features.split(',').map(Number);
      return new faceapi.LabeledFaceDescriptors(face.studentId, [new Float32Array(faceDescriptorValues)]);
    });

    // Create a face matcher
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    

    // Detect faces in the image
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    if (!detections) {
      throw new Error("No face detected in the uploaded photo.");
    }




    // Find matching faces
    const results = detections.map(detection => faceMatcher.findBestMatch(detection.descriptor));

    return results;
  } catch (error) {
    console.error('Error in getDescriptorsFromDB:', error);
    throw error;
  }
}












// app.post("/check-face",upload.single("check") ,async (req, res) => {

//   const photoPath = req.file.path;

//   let result = await getDescriptorsFromDB(photoPath);
//   console.log(result);
//   res.json({ result });
  
// });

app.post("/check-face",async (req, res) => {

  // const photoPath = req.file.path;
  const now = new Date();

  // Extract hours, minutes, and seconds
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let result = false;

  // Format the time as HH:MM:SS
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  console.log("checking face at " + formattedTime )


  
  result = await getDescriptorsFromDB(req.body.image);
  // console.log(result);
  res.json({ msg: result?result[0]:"no data" });

  
});









// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
