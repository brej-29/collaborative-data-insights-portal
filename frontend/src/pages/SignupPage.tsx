import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateUsername = (username: string) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must include an uppercase letter";
    if (!/[a-z]/.test(password)) return "Must include a lowercase letter";
    if (!/[0-9]/.test(password)) return "Must include a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Must include a special character";
    return "";
  };

  const handleSignup = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const isFormValid =
    !usernameError &&
    !emailError &&
    !passwordError &&
    username &&
    email &&
    password;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">📝 Sign Up</h2>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-1 rounded"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError(validateUsername(e.target.value));
          }}
        />
        {usernameError && (
          <p className="text-red-500 text-sm mb-2">{usernameError}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-1 rounded"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
        />
        {emailError && (
          <p className="text-red-500 text-sm mb-2">{emailError}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-1 rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(validatePassword(e.target.value));
          }}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mb-4">{passwordError}</p>
        )}

        <button
          className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          onClick={handleSignup}
          disabled={!isFormValid}
        >
          ✅ Register
        </button>
      </div>
    </div>
  );
}
