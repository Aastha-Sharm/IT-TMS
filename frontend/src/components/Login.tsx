import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface LoginProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", email.trim()); // Backend expects "username"
      formData.append("password", password.trim());

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Login successful:", response.data);

      // Save token
      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);

      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Blue Panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-12 bg-gradient-to-br from-blue-400 to-indigo-500 text-black">
        <div>
          <img
            src="https://companieslogo.com/img/orig/JSWENERGY.NS-b8b0c8f8.png?t=1731039532"
            alt="JSW Energy"
            className="h-12 mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">
            Welcome to ticket management system
          </h1>
          <p className="mb-6 text-lg">
            Streamline support workflow, track issues efficiently,
            provide or get exceptional services.
          </p>
          <ul className="space-y-3 text-base">
            <li>✔ Track issues in one place</li>
            {/* <li>✔ Assign tickets to your team members</li> */}
            <li>✔ Monitor progress with custom dashboards</li>
          </ul>
          <p className="mt-10 text-sm opacity-75">© 2025 JSW. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt=""
            src="https://companieslogo.com/img/orig/JSWENERGY.NS-b8b0c8f8.png?t=1731039532"
            className="mx-auto h-10 w-auto md:hidden"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Sign in
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
