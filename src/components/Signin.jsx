import { useState } from "react";
import Signup from "./Signup";
import Cards from "./Cards";
import Searchbar from "./Search";
import Inputs from "./Inputs";

export default function Signin({ setIsLogIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setIsSignedIn(true);
        setIsLogIn(true);
      } else {
        setError("Signin failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Signin failed. Please try again.");
    }
  };

  if (isSignedIn) {
    return (
      <>
        <Searchbar />
        <Inputs />
        <Cards />
      </>
    );
  }

  if (showSignup) {
    return <Signup />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200 transition-all duration-300">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            Sign in to your account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-700 focus:outline-none transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-700 focus:outline-none transition-all duration-200"
                placeholder="********"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 hover:scale-[1.02] transition-transform duration-300"
            >
              Sign In
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => setShowSignup(true)}
                className="text-gray-800 font-medium hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
