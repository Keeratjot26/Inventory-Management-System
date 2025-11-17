// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Logged in successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("✅ Logged in with Google!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Google login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo" aria-hidden="true">
          <span className="sparkle">✨</span>
          <span className="brand">OptiStocks</span>
        </div>

        <h3 className="auth-title">Welcome Back!</h3>
        <p className="auth-subtitle">Login to access your dashboard</p>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div
            className="forgot-password"
            onClick={() => alert("Forgot password flow - add later")}
          >
            Forgot Password?
          </div>

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button className="auth-google" type="button" onClick={handleGoogleLogin}>
          
          Login with Google
        </button>

        <div className="auth-link" onClick={() => router.push("/signup")}>
          Don’t have an account? Sign up
        </div>
      </div>
    </div>
  );
}
