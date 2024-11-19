import "./App.css";
import Home from "./Screens/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./Screens/Login";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import Signup from "./Screens/Signup.js";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>}></Route>
          <Route exact path="/home" element={<Home />}></Route>
          <Route exact path="/Signup" element={<Signup />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
