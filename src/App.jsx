import { createHashRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import EyeDetect from "./pages/EyeDetect";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route path="/eye_detect" element={<EyeDetect />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;