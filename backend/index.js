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
const {Attendance,AttendanceMarked} = require('./db')


const app = express();
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json());



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

async function saveFaceDescriptor(userName,userId, photoPath) {
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
    await Attendance.create({ name:userName, studentId: userId, features: faceDescriptor });

    console.log("Face descriptor saved successfully.");
  } catch (error) {
    console.error("Error saving face descriptor:", error);
  }
}

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

// Route to handle file upload
app.post("/upload", upload.single("photo"), async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // File uploaded successfully
  const {name,rollNumber} = req.body;
   // Assuming userId is sent along with the photo
  const photoPath = req.file.path;

  // console.log(name);
  // console.log(rollNumber);
  // console.log(image);n

  // Call function to save face descriptor to database
  await saveFaceDescriptor(name,rollNumber, photoPath);

  res.status(200).send("File uploaded successfully.");
});

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
  console.log("done");
  // console.log(typeof(result));
  res.json({ msg: result[0] === undefined ? {_label: "no data"} : result[0]});
});

app.get('/roll/:id',async (req,res)=>{
    let id = req.params.id;

  
    if(id!=="no data" && id!=="unknown"){

      const today = new Date(); // Get today's date
      let marked = [];
      await AttendanceMarked.find({
        id: id, 
        date: { $gte: today.setHours(0, 0, 0, 0) } 
      })
      .then(attendance => {
       
        marked = attendance;
        console.log(attendance); 
      })
      .catch(error => {
        console.error(error);
      });
      // console.log("--->"+marked)

      if(marked.length !=0) return res.json({msg:"alredy marked"})

      await AttendanceMarked.create({
        id:id,
        marked: "present",
      })

    }

    res.json({msg:"Attendence Marked "});
  })
  
app.get('/dash',async (req,res)=>{
    let marked = await AttendanceMarked.find();
    res.json({msg:"done", marked:marked});
})

app.get('/studentDetail',async (req,res)=>{
    let marked = await Attendance.find({}, { name: 1, _id: 1 ,studentId:1});   
    res.json({msg:"done", marked:marked});
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
