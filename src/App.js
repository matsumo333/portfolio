import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Entrance from "./Components/Entrance";
import Home from "./Components/Home";
import VideoProduction from "./Components/VideoProduction";
import MunicipalArchitect from "./Components/MunicipalArchitect";
import WebDesignIncludeBackend from "./Components/WebDesignIncludeBackend";
import VbaCreate from "./Components/VbaCreate";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/home" element={<Home />} />
        <Route path="/videoproduction" element={<VideoProduction />} />
        <Route path="/municipalarchitect" element={<MunicipalArchitect />} />
        <Route path="/vbacreate" element={<VbaCreate />} />
        <Route
          path="/webdesignincludebackend"
          element={<WebDesignIncludeBackend />}
        />
      </Routes>
    </Router>
  );
}

export default App;
