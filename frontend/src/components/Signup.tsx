import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

function Signup({ setToken }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", {
        username: email.split("@")[0],
        email: email,
        password: password,
        role: "user",
      });

      alert("Signup successful!");
      console.log(response.data);

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setToken(response.data.access_token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-12 bg-gradient-to-br from-blue-400 to-indigo-500 text-black">
        <div>
          <img
            src="https://companieslogo.com/img/orig/JSWENERGY.NS-b8b0c8f8.png?t=1731039532"
            alt="JSW Logo"
            className="h-12 mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">
            Welcome to ticket management system
          </h1>
          <p className="text-lg mb-6">
            Streamline support workflow, track issues efficiently,
            provide or get exceptional services.
          </p>
          <ul className="space-y-3 text-base">
            <li>✔ Track issues in one place</li>
            <li>✔ Monitor progress with custom dashboards</li>
          </ul>
          <p className="mt-10 text-sm opacity-75">
            © 2025 JSW. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-sm">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign up for a new account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
