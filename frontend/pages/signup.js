// pages/signup.js
import { useState } from "react";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save extra details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        createdAt: new Date(),
      });

      toast.success("✅ Account created!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to sign up");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ✅ Save Google user in Firestore if new
      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName || "",
        email: user.email,
        createdAt: new Date(),
      }, { merge: true });

      toast.success("✅ Signed up with Google!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Google signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo" aria-hidden="true">
          <span className="sparkle">✨</span>
          <span className="brand">OptiStocks</span>
        </div>

        <h3 className="auth-title">Create Account</h3>
        <p className="auth-subtitle">Sign up to start using OptiStocks</p>

        <form onSubmit={handleSignup}>
          <input
            className="auth-input"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

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

          <button className="auth-btn" type="submit">
            Sign Up
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button className="auth-google" type="button" onClick={handleGoogleSignup}>
          Sign up with Google
        </button>

        <div className="auth-link" onClick={() => router.push("/login")}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}