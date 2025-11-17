import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion } from "framer-motion";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link href="/" className={styles.logo}>✨ OptiStocks</Link>

      <div className={styles.navLinks}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className={styles.link}>Home</Link>
        </motion.div>

        {user ? (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/products" className={styles.link}>Products</Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard" className={styles.link}>Dashboard</Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#0f766e" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login" className={styles.loginBtn}>Login</Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup" className={styles.signupBtn}>Signup</Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
}