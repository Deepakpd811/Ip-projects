import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Attendance() {
  const [recognitionResult, setRecognitionResult] = useState({});
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const sendRoll = (roll) => {
    if (roll._label !== "no date" && roll._label !== "unknown" && roll !== null) {
      console.log("Sending recognition result to server");
      axios.get(`http://localhost:3000/roll/${roll}`)
        .then((response) => {
          console.log("Recognition result:", response.data.msg);
        })
        .catch((error) => {
          console.error("Error sending recognition result to server:", error);
        });
    }
  };

  const capture = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");

    axios.post("http://localhost:3000/check-face", { image: dataUrl })
      .then((response) => {
        console.log("Recognition result:", response.data.msg);
        setRecognitionResult(response.data.msg);
      })
      .catch((error) => {
        console.error("Error sending image to server:", error);
      });
  };

  useEffect(() => {
    capture();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (Object.keys(recognitionResult).length !== 0) {
      sendRoll(recognitionResult._label);
    }
  }, [recognitionResult]);

  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div>
      <video id="video" width="640" height="480" autoPlay ref={videoRef}></video>
      <h1 id="roll">{recognitionResult._label}</h1>
      <button onClick={stopCapture}>Stop</button>
      <button onClick={captureImage}>Capture Image</button>
    </div>
  );
}

export default Attendance;
