import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import Home from "./components/Home";
import Ticket_raise from "./components/Ticket_raise";
import User_dashboard from "./components/User_dashboard";
import TicketDetails from "./components/TicketDetails";
import Footer from "./components/Footer";  // import Footer

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <Router>
      {/* Flex container to enable sticky footer */}
      <div className="flex flex-col min-h-screen">
        {/* Header shown only if logged in */}
        {token && <Header setToken={setToken} />}
        
        {/* Main content grows to fill remaining space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/signup" element={<Signup setToken={setToken} />} />
            <Route path="/"  element={ <PrivateRoute>
                                          <User_dashboard />
                                       </PrivateRoute>
                                     } />

            <Route path="/raise-ticket" element={<PrivateRoute>
                                                    <Ticket_raise />
                                                  </PrivateRoute>
                                                }/>
                                                
            <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
          </Routes>
        </main>

        {/* Sticky Footer shown only if logged in */}
        {token && <Footer />}
      </div>
    </Router>
  );
};

export default App;
