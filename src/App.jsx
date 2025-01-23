import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import EyeDetect from "./pages/EyeDetect";
import SkinDetect from "./pages/SkinDetect"; // Create this page for demonstration

const Layout = () => (
  <div className="min-h-screen bg-gray-900 text-white overflow-y-hidden overflow-x-hidden">
    {/* Navbar always visible */}
    <Navbar />
    {/* Outlet renders the current route */}
    <div className="p-6">
      <Outlet />
    </div>
  </div>
);

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/eye_detect" />} />
          <Route path="eye_detect" element={<EyeDetect />} />
          <Route path="skin_detect" element={<SkinDetect />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
