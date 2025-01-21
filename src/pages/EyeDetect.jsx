import { useRef, useState } from 'react';
import Webcam from "react-webcam";

const EyeDetect = () => {
  const webcamRef = useRef(null);
  const [frame, setFrame] = useState(null);

  const captureImg = async () => {
    if (webcamRef.current) {
      const currentFrame = webcamRef.current.getScreenshot();
      setFrame(currentFrame);
    }
  };

  const videoConstraints = {
    facingMode: "user",
  };

  return (
    <div className="overflow-x-hidden w-full min-h-screen bg-gray-900 text-white font-sans">
      {/* Wrapper container */}
      <div className="flex flex-col items-center justify-between min-h-screen w-full">
        {/* Header */}
        <header className="w-full py-4 bg-gray-800 shadow-lg">
          <h1 className="text-center text-2xl font-bold">Eye Detection</h1>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center w-full">
          {/* Webcam Container */}
          <div className="relative w-full max-w-screen-sm h-64">
            <div className="overflow-hidden w-full h-full">
              <Webcam
                ref={webcamRef}
                className="w-full h-full shadow-lg transform scale-x-[-1]"
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={captureImg}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow focus:outline-none focus:ring focus:ring-gray-500"
            >
              Capture
            </button>
            <button
              onClick={() => setFrame(null)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg shadow focus:outline-none focus:ring focus:ring-red-500"
            >
              Reset
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-2 bg-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 EyeDetect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default EyeDetect;
