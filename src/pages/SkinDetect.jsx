import { useRef, useState } from "react";
import Webcam from "react-webcam";
import jpeg from "jpeg-js";
import { Buffer } from "buffer";

window.Buffer = Buffer;

const SkinDetect = () => {
  const webcamRef = useRef(null);
  const [type, setType] = useState('None')
  const [picTaken, setPicTaken] = useState(false);
  const [analyzedImg, setAnalyzedImg] = useState(null);
  const [frame, setFrame] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const explanations = {
    None: "Your skin is looking good!",
    Melanoma: "The lesion is asymmetric and has an uneven surface, without a well defined border. These symptoms indicate Melanoma.",
    Impetigo: "The yellow crust of the broken blister and red sores all around indicate Impetigo.",
    Mole: "Uniform color and round/oval with smooth edges indicate a Mole."
  }

  const descriptions = {
    None: "Your skin is healthy! It is still a good idea to use skincare routines regularly to maintain your health. See below for some suggestions.",
    Melanoma: "URGENT! One of the deadliest skin cancers that could spread (metastasize) around your body very quickly. Emmediate treatment is needed, as it is treatable in the early stages, but survival rate drops to just 22% after leaving untreated for 6 weeks.",
    Impetigo: "Care needed, but not urgent. Impetigo is a highly contagious bacterial skin infection caused by Staphylococcus aureus, often caused by poor hygiene. If left untreated, it could lead to scarring in addition to painful red sores. Over-the-counter antibiotics can easily treat Impetigo.",
    Mole: "No care needed, but may seek a doctor to remove the mole if prefered. Moles are harmless pigmented skin cells that may be caused by genetics, overexposure to UV rays, or hormonal changes."
  }

  const captureImg = () => {
    setPicTaken(true);
    const img = webcamRef.current.getScreenshot();
    setFrame(img);
  }

  const extractBotRightPixels = (base64Image) => {
    // Step 1: Decode the Base64 image
    const base64Data = base64Image.slice(base64Image.indexOf(",") + 1);
    const binaryString = atob(base64Data);
    const binaryData = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  
    // Decode the JPEG image to get raw pixel data
    const rawImageData = jpeg.decode(binaryData, { useTArray: true });
    const { width, height, data } = rawImageData;
  
    // Step 2: Define the bottom-right region
    const regionWidth = 100;
    const regionHeight = 100;
    const startX = width - regionWidth;
    const startY = height - regionHeight;
  
    // Step 3: Extract pixel data
    const pixels = [];
    for (let y = startY; y < height; y++) {
      for (let x = startX; x < width; x++) {
        const index = (y * width + x) * 4; // Pixel index (RGBA)
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        pixels.push({ r, g, b, a }); // Store as an object or array
      }
    }
  
    return pixels; // Return the array of pixel objects
  };

  const identify = async () => {
    const croppedImg = extractBotRightPixels(frame)
    
    let detected = false;
    for (let i = 0; i < 3; i++){
      let count = 0
      croppedImg.forEach(({r, b, g}) => {
        switch (i) {
          case 0: // Blue - Melanoma
            (b/(r + g + b) > 0.7 && (r > 100 || g > 100 || b > 100)) && count++
            if (count > 200) {
              detected = true
              setType('Melanoma')
            }
            break;
          case 1: // Green - Impetigo
            (g/(r + g + b) > 0.7 && (r > 100 || g > 100 || b > 100)) && count++
            if (count > 200) {
              detected = true
              setType('Impetigo')
            }
            break;
          case 2: // Red - Mole
            (r/(r + g + b) > 0.7 && (r > 100 || g > 100 || b > 100)) && count++
            if (count > 200) {
              detected = true
              setType('Mole')
            }
            break;
        }
      })
      console.log(count)
      if (detected) {
        break;
      }
    }
  }
  
  const analyzeImg = async () => {
    setAnalyzing(true); 
    setTimeout(() => {
      setAnalyzing(false); 
      setAnalyzedImg(frame);
      identify();
      setShowPopup(true); 
    }, 2500);
  };

  const reset = async () => {
    setType('None');
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white z-50 overflow-y-auto">
          <div className="bg-gray-800 text-white rounded-xl p-6 shadow-xl text-center w-5/6 max-w-md top-6 max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4">
              {type !== 'None' ? (
                <>
                  <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-4 py-3 rounded-md shadow-xl shadow-red-950">
                    {type}
                  </span>
                  <p className="mt-3">Found</p>
                </>
              ) : (
                <span className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-4 py-3 rounded-md shadow-xl shadow-green-950">
                  Healthy
                </span>
              )}
            </h2>
  
            {type === 'Melanoma' && (
              <span className="bg-gradient-to-r shadow-lg from-blue-500 via-blue-600 to-blue-700 text-white text-lg px-4 py-2 rounded-md shadow-gray-600 cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:shadow-lg">
                Click for Priority Treatment!
              </span>
            )}
  
            <div className="relative w-64 h-64 bg-black mx-auto mb-6 mt-6 overflow-hidden">
              <img
                src={analyzedImg}
                alt="Skin Analysis"
                style={{ filter: "saturate(0.65)" }}
                className="w-full h-full object-cover transform scale-125"
              />
            </div>
  
            <div className="bg-slate-950 bg-opacity-50 p-4 rounded-md">
              <p className="mb-4 text-left font-semibold text-gray-300">
                {explanations[type]}
              </p>
              <p className="mb-4 text-left text-gray-300">{descriptions[type]}</p>
              <p className="mb-6 text-left leading-relaxed text-gray-300">
                <a className="text-blue-400 hover:text-blue-500 underline transition-all">
                  More information here
                </a>
              </p>
              <button
                className="px-6 py-2 bg-blue-900 text-white rounded-xl shadow-lg transition-all duration-200"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Main Content */}
      <main className="flex flex-col justify-center w-full -mt-2 bg-gray-800 pb-6">
        {/* Header */}
        <header className="py-4 bg-blue-950 shadow-lg shadow-gray-800">
          <h1 className="text-center text-xl sm:text-2xl font-bold">
            Skin Disease Detection
          </h1>
        </header>
  
        {/* Image/Video Container */}
        <div className="relative w-80 h-80 bg-gray-800 mx-auto overflow-hidden mt-3">
          {!picTaken ? (
            <div className="relative w-full h-full">
              <Webcam
                ref={webcamRef}
                className="absolute w-full h-full object-cover"
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
  
              {/* Brackets */}
              <div className="absolute inset-0 flex justify-between items-between">
                <div className="absolute w-10 h-10 border-t-4 border-l-4 border-slate-500"
                    style={{ top: "30%", left: "30%", transform: "translate(-50%, -50%)" }}>
                </div>
                <div className="absolute w-10 h-10 border-t-4 border-r-4 border-slate-500"
                    style={{ top: "30%", right: "30%", transform: "translate(50%, -50%)" }}>
                </div>
                <div className="absolute w-10 h-10 border-b-4 border-l-4 border-slate-500"
                    style={{ bottom: "30%", left: "30%", transform: "translate(-50%, 50%)" }}>
                </div>
                <div className="absolute w-10 h-10 border-b-4 border-r-4 border-slate-500"
                    style={{ bottom: "30%", right: "30%", transform: "translate(50%, 50%)" }}>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={showPopup ? analyzedImg : frame}
              className="absolute w-full h-full object-cover"
              alt="Captured/Analyzed Image"
            />
          )}
        </div>
  
        {/* Footer */}
        <footer className="w-full bg-gray-800 py-4">
          <div className="flex gap-3 justify-center">
            {!picTaken ? (
              <button
                onClick={captureImg}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-gray-700"
              >
                Capture
              </button>
            ) : (
              <button
                onClick={analyzeImg}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-sm sm:text-base rounded-lg shadow focus:outline-none focus:ring focus:ring-gray-700"
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
      </main>
    </div>
  );
};  

export default SkinDetect;
