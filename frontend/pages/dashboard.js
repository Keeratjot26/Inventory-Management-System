import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"; // ✅ Make sure firebase.js exports auth
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔒 Protect route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // redirect to login if not logged in
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Show while checking auth
  }

  return (
    <div>
      <Navbar />
      <h1>Dashboard</h1>
      <p>
        This will redirect to the ML Team’s dashboard once they give us the
        link.
      </p>
      <button disabled>Go to Dashboard</button>
    </div>
  );
}