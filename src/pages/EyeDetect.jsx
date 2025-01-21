import { useRef, useState } from 'react';
import Webcam from "react-webcam";
import RetinaVid from '../assets/retinaldetachfake.mp4';
import RetinaImg from '../assets/RetinaDetachImg.png';

const EyeDetect = () => {
  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const [blurAmount, setBlurAmount] = useState('blur-sm');
  const [isPlayingVid, setIsPlayingVid] = useState(true);
  const [useCam, setUseCam] = useState(true);

  const captureImg = async () => {
    setIsPlayingVid(false);
  };

  const reset = async () => {
    setBlurAmount('blur-sm');
    setUseCam(true);
    setIsPlayingVid(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const animate = async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const blurDegrees = ['blur-md', 'blur-lg', 'blur-xl', 'blur-3xl'];
    for (let i = 0; i < 4; i++) {
      setBlurAmount(blurDegrees[i]);
      await wait(70);
    }
    setUseCam(false);
    for (let i = 0; i < 4; i++) {
      setBlurAmount(blurDegrees[3 - i]);
      await wait(70);
    }
    setBlurAmount('');
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div className="overflow-hidden w-full min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="w-full py-4 bg-gray-800 shadow-lg">
        <h1 className="text-center text-xl sm:text-2xl font-bold">
          Eye Disease Detection
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center w-full">
        <div className="relative flex w-full max-w-md h-96 sm:h-full items-center justify-center mt-8">
          {/* Dynamic Content */}
          {useCam ? (
            <Webcam
              ref={webcamRef}
              className={`w-full h-full shadow-lg transform filter ${blurAmount}`}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          ) : isPlayingVid ? (
            <video
              ref={videoRef}
              src={RetinaVid}
              muted
              autoPlay
              loop
              playsInline
              className={`w-full h-full shadow-lg transform filter ${blurAmount}`}
            ></video>
          ) : (
            <img
              src={RetinaImg}
              className="flex justify-center items-center h-full shadow-lg transform filter"
              alt="Retinal Detachment"
            />
          )}
        </div>
      </main>

      {/* Controls */}
      <footer className="w-full bg-gray-800 py-3 fixed bottom-0">
        <div className="flex justify-center space-x-3 px-4">
          <button
            onClick={captureImg}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-gray-700"
          >
            Capture
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-900"
          >
            Reset
          </button>
          <button
            onClick={animate}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-green-700"
          >
            Animate
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EyeDetect;
