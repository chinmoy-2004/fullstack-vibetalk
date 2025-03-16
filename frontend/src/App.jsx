import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Homepage from "./pages/Homepage.jsx";
import Loginpage from "./pages/Loginpage.jsx";
import Signuppage from "./pages/Signuppage.jsx";
import Settingspage from "./pages/Settingspage.jsx";
import Profilepage from "./pages/Profilepage.jsx";
import { useAuthstore } from "./store/useAuthstore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemestore } from "./store/useThemestore.js";

export default function App() {

  const { authUser, checkAuth, ischekingAuth,onlineUsers } = useAuthstore();
  const {theme} = useThemestore();

  console.log({onlineUsers});

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log(authUser);

  if (ischekingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme} >
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <Signuppage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Loginpage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settingspage />} />
        <Route path="/profile" element={authUser ? <Profilepage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </div>
  )
}