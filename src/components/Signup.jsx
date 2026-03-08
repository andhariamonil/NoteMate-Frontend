import { useState } from "react";

export default function Signup({ setIsLogIn }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 201) {
        // Auto-login after signup
        const loginRes = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();
        if (loginRes.status === 200) {
          localStorage.setItem("token", loginData.token);
          setIsLogIn(true); // Trigger logged-in view
        } else {
          setError("Signup successful, but login failed.");
        }
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Network error.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            Register to get started
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 px-4 py-2"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 px-4 py-2"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 px-4 py-2"
                placeholder="********"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 px-4 py-2"
                placeholder="********"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
