import { motion } from "framer-motion";
import styles from "../styles/index.module.css";
import Navbar from "../components/Navbar";

export default function Home() {
  const featureData = [
    {
      icon: "📊",
      title: "KPI Tracking",
      desc: "Monitors stock levels, identifies fast/slow-moving products, and calculates key metrics like turnover ratio, revenue, and profit."
    },
    {
      icon: "📈",
      title: "Demand Forecasting",
      desc: "Uses regression and moving average techniques to predict future sales, helping businesses prepare for demand fluctuations."
    },
    {
      icon: "⚠️",
      title: "Risk Management",
      desc: "Generates automated alerts for potential stockouts, overstocking, and products nearing expiry dates."
    },
    {
      icon: "🔥",
      title: "Profitability Heatmap",
      desc: "Visualizes product-wise and seasonal profit contributions, enabling strategic pricing and marketing decisions."
    },
    {
      icon: "🚀",
      title: "Demand Spike Detection",
      desc: "Identifies abnormal demand surges during festivals, promotions, or events, allowing timely stock replenishment."
    },
    {
      icon: "🧪",
      title: "What-If Simulator",
      desc: "Test various business scenarios (supplier delays, demand spikes) to assess their impact on inventory and profitability."
    }
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.heroTitle}>Smarter Inventory Management 🚀</h1>
        <p className={styles.heroSubtitle}>
          Optimize stock, predict demand, and maximize profitability with our AI-powered platform.
        </p>
        <motion.a
          href="/products"
          className={styles.ctaBtn}
          whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(20,184,166,0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>
      </motion.section>

      {/* Parallax About Section */}
      <section className={styles.about}>
        <motion.div
          className={styles.aboutContent}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Why Choose Us? 🌍</h2>
          <p>
            Our platform isn’t just about tracking products – it’s about transforming the way you manage inventory.
            With AI-driven forecasting, smart alerts, and profitability insights, you’ll always stay ahead of the curve.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>✨ Key Features</h2>
        <div className={styles.featureGrid}>
          {featureData.map((f, idx) => (
            <motion.div
              key={idx}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Smart Inventory. All rights reserved.</p>
      </footer>
    </div>
  );
}
