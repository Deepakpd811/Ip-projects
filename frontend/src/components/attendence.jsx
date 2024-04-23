
import { useState, useRef } from "react";
import axios from "axios";

function Attendence() {
  const [roll, setRoll] = useState("");
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const capture = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          intervalRef.current = setInterval(() => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL("image/jpeg");

            axios
              .post("http://localhost:3000/check-face", { image: dataUrl })
              .then((response) => {
                console.log("Recognition result:", response.data.msg._label);
                setRoll(response.data.msg._label);
              })
              .catch((error) => {
                console.error("Error sending image to server:", error);
              });
          }, 5000); // Send an image every 5 seconds
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  };

  const stopCapture = () => {
    clearInterval(intervalRef.current);
  };
  return (
    <div>
      <video
        id="video"
        width="640"
        height="480"
        autoPlay
        ref={videoRef}
      ></video>
      <h1 id="roll">{roll}</h1>
      <button onClick={capture}>Start</button>
      <button onClick={stopCapture}>Stop</button>
    </div>
  );
}

export default Attendence;
