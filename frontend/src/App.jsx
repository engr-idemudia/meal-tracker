import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Meals from "./pages/Meals";
import NewMeal from "./pages/NewMeal";
import EditMeal from "./pages/EditMeal";
import Reports from "./pages/Reports";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/meals" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/meals"
            element={
              <PrivateRoute>
                <Meals />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals/new"
            element={
              <PrivateRoute>
                <NewMeal />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals/:id/edit"
            element={
              <PrivateRoute>
                <EditMeal />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
