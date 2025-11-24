import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { BrainIcon } from "lucide-react";

const Login = () => {
  const { login, verifyOtp, socialLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phase, setPhase] = useState("login");
  const [loading, setLoading] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await login(email, password);

      if (res.status === "verify_otp") {
        setStoredEmail(res.email);
        setPhase("otp");
      } else if (res.status === "success") {
        alert(`Welcome ${res.user.username}`);
      }
    } catch (err) {
      alert(err.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp(storedEmail, otp);

      if (res.status === "success") {
        alert(res.message);
        setPhase("login");
        setEmail("");
        setPassword("");
        setOtp("");
      }
    } catch (err) {
      alert(err.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const res = await socialLogin(provider);
      if (res.status === "success") {
        alert(`Welcome ${res.user.username}`);
      }
    } catch (err) {
      alert(err.error || `Failed to login with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 relative text-white px-4">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 bg-blue-500 opacity-10 rounded-full blur-[180px]"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-3xl shadow-xl relative z-10 border border-gray-800">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BrainIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SophiaAI
          </span>
        </div>

        {/* Login Phase */}
        {phase === "login" && (
          <>
            <h1 className="text-3xl font-semibold mb-6 text-white">Welcome Back</h1>

            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-800 rounded-2xl mb-3 outline-none border border-gray-700 focus:border-blue-500 transition"
              placeholder="Email (@zetech.ac.ke)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full px-4 py-3 bg-gray-800 rounded-2xl mb-4 outline-none border border-gray-700 focus:border-blue-500 transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold mb-4"
            >
              {loading ? "Processing..." : "Continue"}
            </button>

            <div className="space-y-2">
              <button
                onClick={() => handleSocialLogin("google")}
                className="w-full py-3 rounded-2xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
              >
                Continue with Google
              </button>
              <button
                onClick={() => handleSocialLogin("apple")}
                className="w-full py-3 rounded-2xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
              >
                Continue with Apple
              </button>
              <button
                onClick={() => handleSocialLogin("phone")}
                className="w-full py-3 rounded-2xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
              >
                Continue with Phone
              </button>
            </div>
          </>
        )}

        {/* OTP Phase */}
        {phase === "otp" && (
          <>
            <h1 className="text-3xl font-semibold mb-4">Verify OTP</h1>
            <p className="text-gray-400 mb-3">
              Enter the 6-digit code sent to <strong>{storedEmail}</strong>
            </p>

            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800 rounded-2xl mb-4 outline-none border border-gray-700 focus:border-blue-500 transition"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleOtpVerify}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-500 transition font-semibold"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;