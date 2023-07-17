import GameRoom from "./pages/GameRoom";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { UsersProvider } from "./context/Users";

function App() {
  return (
    <div className="App">
      <UsersProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Profile />}></Route>
            <Route path="/game" element={<GameRoom />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </Router>
      </UsersProvider>
    </div>
  );
}

export default App;
