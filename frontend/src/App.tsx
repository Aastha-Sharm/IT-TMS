import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Ticket_raise from "./components/User/Ticket_raise";
import User_dashboard from "./components/User/User_dashboard";
import Agent_dashboard from "./components/Agent/Agent_dashboard";
import Footer from "./components/Footer";
import Asset_tickets from "./components/Agent/Asset_tickets";
import Service_tickets from "./components/Agent/Service_tickets";
import Service_description from "./components/Agent/Service_description";
import Asset_description from "./components/Agent/Asset_description";

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const Layout: React.FC<{
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ token, setToken }) => {
  const location = useLocation();

  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {token && !hideHeaderFooter && <Header setToken={setToken} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                {/* <Service_description
                  id={1}
                  title="Software Installation"
                  description="Docker Installation"
                  created_by="Aastha Sharma"
                  status="Created"
                  priority="Low"
                  type="Service"
                  created_at="jfjbvj"
                  category="Software Installation"
                  onUpdate={() => {}}
                /> */}
                {/* <Asset_description
                  id={1}
                  title="Asset Management"
                  description="Manage your assets effectively"
                  created_by="John Doe"
                  status="Active"
                  priority="High"
                  type="Asset"
                  created_at="2023-01-01"
                  category="IT Assets"
                  onUpdate={() => {}}
                /> */}
                <Agent_dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/raise-ticket"
            element={
              <PrivateRoute>
                <Ticket_raise />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </main>

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
      <Layout token={token} setToken={setToken} />
    </Router>
  );
};

export default App;
