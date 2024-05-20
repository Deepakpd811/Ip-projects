const faceapi = require("face-api.js");
const { Canvas, Image, loadImage } = require("canvas");
faceapi.env.monkeyPatch({ Canvas, Image });
const { Student, AttendanceMarked } = require('../db.js');

async function loadModels() {
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/../models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/../models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/../models");
}

async function saveFaceDescriptor(req, res) {
  const { name, rollNumber } = req.body;
  const photoPath = req.file.path;

  console.log("upoading......");

  try {
    const img = await loadImage(photoPath);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
      return res.status(400).send("No face detected in the uploaded photo.");
    }

    const faceDescriptor = detection.descriptor;
    await Student.create({ name, studentId: rollNumber, features: faceDescriptor });

    res.status(200).json({ msg: "File uploaded successfully." });
  } catch (error) {
    console.error("Error saving face descriptor:", error);
    res.status(500).json({ error: "Error saving face descriptor" });
  }
  console.log("done")
}

async function checkFace(req, res) {
  
  const now = new Date();
  const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  console.log("checking at "+formattedTime)
  try {
    const result = await getDescriptorsFromDB(req.body.image);
    res.json({ msg: result[0] === undefined ? { _label: "no data" } : result[0] });
  } catch (error) {
    console.error('Error in checkFace:', error);
    res.status(500).json({ error: 'Error checking face' });
  }
  console.log("done")
}

async function getDescriptorsFromDB(imagePath) {
  try {
    // Load the image from the specified path using canvas
    const img = await loadImage(imagePath);

    // Get all the face data from MongoDB
    
    const faces = await Student.find();

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

module.exports = {
  loadModels,
  saveFaceDescriptor,
  checkFace
};
