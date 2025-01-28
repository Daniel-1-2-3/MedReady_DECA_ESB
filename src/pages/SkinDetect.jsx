import { useRef, useState } from "react";
import Webcam from "react-webcam";
import jpeg from "jpeg-js";
import { Buffer } from 'buffer';
import melanoma from "../assets/Melanoma.jpg"

window.Buffer = Buffer;

const SkinDetect = () => {
  const webcamRef = useRef(null);
  const [picTaken, setPicTaken] = useState(false);
  const [analyzedImg, setAnalyzedImg] = useState(null);
  const [frame, setFrame] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const captureImg = async () => {
    setPicTaken(true);
    const img = webcamRef.current.getScreenshot();
    setFrame(img);
  };

  const scan = async () => {
    try {
      // Extract Base64 data and decode it
      const base64Data = frame.slice(frame.indexOf(",") + 1);
      const binaryString = atob(base64Data);
      const binaryData = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  
      // Decode the JPEG image using jpeg-js
      const rawImageData = jpeg.decode(binaryData, { useTArray: true });
  
      const { width, height, data } = rawImageData;
  
      // Define bounding box sizes
      const boxSizes = [90, 100, 110];
  
      let darkestBox = { x: 0, y: 0, size: 0, brightness: Infinity };
  
      // Scan for the darkest region with each box size
      for (const boxSize of boxSizes) {
        const blocksX = Math.floor(width / boxSize);
        const blocksY = Math.floor(height / boxSize);
  
        for (let by = 0; by < blocksY; by++) {
          for (let bx = 0; bx < blocksX; bx++) {
            let totalBrightness = 0;
            let pixelCount = 0;
  
            // Iterate over each pixel in the box
            for (let y = by * boxSize; y < Math.min((by + 1) * boxSize, height); y++) {
              for (let x = bx * boxSize; x < Math.min((bx + 1) * boxSize, width); x++) {
                const index = (y * width + x) * 4; // Pixel index (RGBA)
  
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
  
                const brightness = r + g + b;
                totalBrightness += brightness;
                pixelCount++;
              }
            }
  
            // Calculate average brightness for the box
            const averageBrightness = totalBrightness / pixelCount;
  
            // Update darkest box if this one is darker
            if (averageBrightness < darkestBox.brightness) {
              darkestBox = { x: bx * boxSize, y: by * boxSize, size: boxSize, brightness: averageBrightness };
            }
          }
        }
      }
  
      // Draw the bounding box on the raw pixel data
      for (let y = darkestBox.y; y < darkestBox.y + darkestBox.size; y++) {
        for (let x = darkestBox.x; x < darkestBox.x + darkestBox.size; x++) {
          const index = (y * width + x) * 4;
  
          // Draw a red border around the box
          if (
            y === darkestBox.y || // Top border
            y === darkestBox.y + darkestBox.size - 1 || // Bottom border
            x === darkestBox.x || // Left border
            x === darkestBox.x + darkestBox.size - 1 // Right border
          ) {
            data[index] = 255; // Red
            data[index + 1] = 0; // Green
            data[index + 2] = 0; // Blue
          }
        }
      }
  
      // Encode the modified image back to JPEG
      const encodedImage = jpeg.encode({ data, width, height }, 90); // Quality set to 90
  
      // Convert the encoded data to Base64 without Buffer
      const base64Image =
        "data:image/jpeg;base64," +
        btoa(String.fromCharCode(...encodedImage.data));
  
      setAnalyzedImg(base64Image)
    } catch (error) {
      console.error("Error processing the image:", error);
    }
  };
  const analyzeImg = async () => {
    setAnalyzing(true); 
    setTimeout(() => {
      setAnalyzing(false); 
      scan()
      setShowPopup(true); 
    }, 2500);
  };

  const reset = async () => {
    setPicTaken(false);
    setFrame(null);
  }

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
                  Melanoma
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
                className="relative w-64 h-64 bg-black  mx-auto mb-6 mt-6 overflow-hidden"
              >
                <img
                  src={analyzedImg}
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
  
        {/* Main Content */}
        <main className="flex flex-col justify-center w-full -mt-2">
          {/* Header */}
          <header className="py-4 bg-blue-950 shadow-lg shadow-gray-800">
            <h1 className="text-center text-xl sm:text-2xl font-bold">
              Skin Disease Detection
            </h1>
          </header>
          <div className="w-full max-w-md p-4 bg-gray-800 aspect-square overflow-hidden">
            {!picTaken ? (
              <Webcam
                ref={webcamRef}
                className="w-full h-full object-cover"
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            ) : (
              <img 
                className="w-full h-full object-cover"
                src={frame}
              />
            )}
          </div>
        </main>
  
        {/* Footer */}
        <footer className="w-full bg-gray-800 py-3 rounded-b-md">
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
          </div>
        </footer>
      </div>
    );
}

export default SkinDetect
