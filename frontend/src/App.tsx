import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,   // ✅ added
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import Home from "./components/Home";
import Ticket_raise from "./components/User/Ticket_raise";
import User_dashboard from "./components/User/User_dashboard";
import TicketDetails from "./components/User/TicketDetails";
import Footer from "./components/Footer";  // import Footer
import Agent_dashboard from "./components/Agent/Agent_dashboard";
import Service_tickets from "./components/Agent/Service_tickets";
import Asset_tickets from "./components/Agent/Asset_tickets";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC<{ token: string | null; setToken: any }> = ({ token, setToken }) => {
  const location = useLocation(); // ✅ get current route

  // ✅ hide header/footer on login & signup pages
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header shown only if logged in and not on login/signup */}
      {token && !hideHeaderFooter && <Header setToken={setToken} />}
      
      {/* Main content grows to fill remaining space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                {/* <TicketDetails
                    id={101}
                    title="Unable to access VPN"
                    description="I am unable to connect to the company VPN from home. It shows authentication failed even with correct credentials."
                    created_by="Aastha Sharma"
                    category="Network"
                    priority="High"
                    status="Open"
                    created_at="2025-08-18 09:45 AM"
                    response="Our IT team is checking the VPN server issue. Please try again in 30 minutes."
                    onClose={() => alert("Ticket Closed!")}
                    onDelete={() => alert("Ticket Deleted!")}
                  /> */}
                {/* <Agent_dashboard /> */}
                {/* <Service_tickets /> */}
                <Service_tickets />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </main>

      {/* Sticky Footer shown only if logged in and not on login/signup */}
      {token && !hideHeaderFooter && <Footer />}
    </div>
  );
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
      <AppContent token={token} setToken={setToken} />
    </Router>
  );
};

export default App;
