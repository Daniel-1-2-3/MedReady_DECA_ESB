import { useRef, useState } from "react";
import Webcam from "react-webcam";
import RetinaVid from "../assets/retinaldetachfake.mp4";
import RetinaImg from "../assets/RetinaDetachImg.png";
import AnalyzedImg from "../assets/AnalyzedImg.png";

const EyeDetect = () => {
  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const [blurAmount, setBlurAmount] = useState("blur-sm");
  const [isPlayingVid, setIsPlayingVid] = useState(true);
  const [picTaken, setPicTaken] = useState(false);
  const [useCam, setUseCam] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // New state for analyze spinner

  const captureImg = async () => {
    setIsPlayingVid(false);
    setPicTaken(true);
  };

  const analyzeImg = async () => {
    setAnalyzing(true); // Show analyzing screen
    setTimeout(() => {
      setAnalyzing(false); // Hide analyzing screen
      setShowPopup(true); // Show result popup
    }, 2500); // Delay for 1.5 seconds
  };

  const reset = async () => {
    setBlurAmount("blur-sm");
    setUseCam(true);
    setIsPlayingVid(true);
    setPicTaken(false);
    setShowPopup(false);
    setLoading(false);
    setAnalyzing(false);
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.currentTime = 0;
    }
  };

  const animate = async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const blurDegrees = ["blur-md", "blur-lg", "blur-xl", "blur-3xl"];

    setLoading(true); // Show loading screen
    await wait(500); // Brief delay for effect

    for (const degree of blurDegrees) {
      setBlurAmount(degree);
      await wait(70);
    }

    setUseCam(false);
    setBlurAmount(blurDegrees[2]);
    await wait(1000);

    setBlurAmount("");
    setLoading(false); // Hide loading screen

    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white font-sans">
      {/* Analyze Spinner Screen */}
      {analyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-white">
              AI analyzing for abnormalities...
            </p>
          </div>
        </div>
      )}


      {/* Popup */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white z-50 overflow-y-scroll">
          <div className="bg-gray-800 text-white rounded-xl p-6 shadow-xl text-center w-5/6 max-w-md mt-96">
            <h2 className="text-xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-4 py-3 rounded-md shadow-xl shadow-red-950">
                Retinal Detachment
              </span>{" "}
              <p className="mt-3">Found</p>
            </h2>
            <span
              className="bg-gradient-to-r shadow-lg from-blue-500 via-blue-600 to-blue-700 text-white text-lg px-4 py-2 rounded-md shadow-gray-600 cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:shadow-lg"
            >
              Click for Priority Treatment!
            </span>

            {/* Fundus Image Frame */}
            <div
              className="relative w-64 h-64 bg-black rounded-full mx-auto mb-6 mt-6 overflow-hidden"
              style={{
                clipPath: "circle(50% at center)",
              }}
            >
              <img
                src={AnalyzedImg}
                alt="Retinal Detachment"
                style={{ filter: "saturate(0.65)" }}
                className="w-full h-full object-cover transform scale-125"
              />
            </div>

            <div className="bg-slate-950 bg-opacity-50 p-4 rounded-md">
              <p className="mb-4 text-left font-semibold text-gray-300">
                White folds and wrinkled areas indicate retinal detachment.
              </p>
              <p className="mb-4 text-left text-gray-300">
                Retinal detachment is a serious eye condition where the retina, a
                thin layer of light-sensitive tissue at the back of the eye,
                becomes separated from its underlying supportive tissue. Leaving
                untreated for 2 weeks + may lead to permanent blindness.
              </p>
              <p className="mb-6 text-left leading-relaxed text-gray-300">
                <a
                  className="text-blue-400 hover:text-blue-500 underline transition-all"
                >
                  More information here
                </a>
              </p>
              <button
                className="px-6 py-2 bg-blue-900 text-white rounded-xl shadow-lg transition-all duration-200"
                onClick={() => setShowPopup(false)} // Close the popup
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-40">
          <h2 className="text-white text-2xl font-bold animate-pulse">
            Autofocusing...
          </h2>
        </div>
      )}

      {/* Header */}
      <header className="py-4 bg-blue-950 shadow-lg shadow-gray-800">
        <h1 className="text-center text-xl sm:text-2xl font-bold">
          Eye Disease Detection
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center w-full">
        <div className="flex flex-col justify-center h-[50vh] w-full max-w-md bg-slate-900 p-4 my-5">
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              clipPath: "circle(55% at center)",
            }}
          >
            {useCam ? (
              <Webcam
                ref={webcamRef}
                className={`w-full h-full shadow-lg filter ${blurAmount} transform scale-150`}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            ) : isPlayingVid ? (
              <div className={`${blurAmount}`}>
                <video
                  ref={videoRef}
                  src={RetinaVid}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className={`w-full h-full shadow-lg filter transform scale-150`}
                  style={{ filter: "saturate(0.65)" }}
                ></video>
              </div>
            ) : (
              <img
                src={RetinaImg}
                alt="Retinal Detachment"
                className="w-full h-full object-contain shadow-lg transform scale-150"
                style={{ filter: "saturate(0.65)" }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 py-3 rounded-md">
        <div className="flex gap-3">
          {!picTaken ? (
            <button
              onClick={captureImg}
              className="ml-20 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-gray-700"
            >
              Capture
            </button>
          ) : (
            <button
              onClick={analyzeImg}
              className="ml-10 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-gray-700"
            >
              Analyze Image
            </button>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-900"
          >
            Reset
          </button>
          <button
            onClick={animate}
            className="px-8 bg-transparent"
          ></button>
        </div>
      </footer>
    </div>
  );
};

export default EyeDetect;
