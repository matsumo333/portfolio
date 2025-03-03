import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Entrance from "./Components/Entrance";
import Home from "./Components/Home";
import VideoProduction from "./Components/VideoProduction";
import MunicipalArchitect from "./Components/MunicipalArchitect";
import WebDesignIncludeBackend from "./Components/WebDesignIncludeBackend";
import VbaCreate from "./Components/VbaCreate";
import FirestoreService from "./Components/FirestoreService";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import SocialEfficiency from "./Components/SocialEfficiency";
import TennisRelated from "./Components/TennisRelated";
import MemberDetailConfirm from "./Components/MemberDetailConfirm";
import { MemberProvider } from "./Contexts/MemberContext";
import { AuthProvider } from "./Contexts/AuthContext";
import MemberCreate from "./Components/MemberCreate";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MemberProvider>
          <Navbar />
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="membercreate" element={<MemberCreate />} />
            <Route path="membercreate/:id" element={<MemberCreate />} />
            <Route path="logout" element={<Logout />} />
            <Route path="/" element={<Entrance />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="memberdetailconfirm"
              element={<MemberDetailConfirm />}
            />
            <Route path="/firestoreservice" element={<FirestoreService />} />
            {/* <Route path="/firestoreservice" element={<FirestoreService />} /> */}
            <Route
              path="/firestoreservice/:Id/:eventState"
              element={<FirestoreService />}
            />

            <Route path="/videoproduction" element={<VideoProduction />} />
            <Route
              path="/municipalarchitect"
              element={<MunicipalArchitect />}
            />
            <Route path="/vbacreate" element={<VbaCreate />} />
            <Route
              path="/webdesignincludebackend"
              element={<WebDesignIncludeBackend />}
            />
            <Route
              path="/webdesignincludebackend/:Id/:eventState"
              element={<WebDesignIncludeBackend />}
            />
            <Route path="/tennisrelated" element={<TennisRelated />} />
            <Route
              path="/tennisrelated/:Id/:eventState"
              element={<TennisRelated />}
            />
            <Route path="/socialefficiency" element={<SocialEfficiency />} />
            <Route
              path="/socialefficiency/:Id/:eventState"
              element={<SocialEfficiency />}
            />
          </Routes>
        </MemberProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
