import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import CoreTalentsTest from "./Pages/CoreTalentsTest";
import CoreTalentsResults from "./Pages/CoreTalentsResults";
import BigFiveTest from "./Pages/BigFiveTest";
import BigFiveResultsPage from "./Pages/BigFiveResultsPage";
import MBTITest from "./Pages/MBTITest";
import MBTIResults from "./Pages/MBTIResults";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import HeroJourney from "./Pages/HeroJourney"; // ✅ добавлено
import HabitTracker from "./Pages/HabitTracker"; // ✅ НОВОЕ

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/coretalents"
          element={
            <PrivateRoute>
              <CoreTalentsTest />
            </PrivateRoute>
          }
        />
        <Route
          path="/coretalents/results"
          element={
            <PrivateRoute>
              <CoreTalentsResults />
            </PrivateRoute>
          }
        />

        <Route
          path="/bigfive"
          element={
            <PrivateRoute>
              <BigFiveTest />
            </PrivateRoute>
          }
        />
        <Route
          path="/bigfive/results"
          element={
            <PrivateRoute>
              <BigFiveResultsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/mbti"
          element={
            <PrivateRoute>
              <MBTITest />
            </PrivateRoute>
          }
        />
        <Route
          path="/mbti/results"
          element={
            <PrivateRoute>
              <MBTIResults />
            </PrivateRoute>
          }
        />

        <Route
          path="/hero"
          element={
            <PrivateRoute>
              <HeroJourney />
            </PrivateRoute>
          }
        />

        <Route
          path="/habits"
          element={
            <PrivateRoute>
              <HabitTracker />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
