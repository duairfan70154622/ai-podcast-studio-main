import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const stats = [
    { title: "Active Pipelines", value: 4 },
    { title: "Episodes Published", value: 12 },
    { title: "Audio Minutes", value: 340 },
    { title: "Success Rate", value: "92%" },
  ];

  const data = [
    { name: "Mon", episodes: 2 },
    { name: "Tue", episodes: 4 },
    { name: "Wed", episodes: 3 },
    { name: "Thu", episodes: 6 },
    { name: "Fri", episodes: 5 },
  ];

  const handleGenerate = async () => {
    if (!topic) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setResult(data);

    } catch (error) {
      setResult({ error: "Backend connection failed" });
    }

    setLoading(false);
  };

  const theme = darkMode
    ? {
        bg: "#0f172a",
        card: "#1e293b",
        text: "#ffffff",
        sub: "#cbd5e1",
      }
    : {
        bg: "#f1f5f9",
        card: "#ffffff",
        text: "#0f172a",
        sub: "#334155",
      };

  return (
    <div style={{ ...styles.container, background: theme.bg }}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={{ color: theme.text }}>AI Podcast Studio</h2>

        <div style={styles.navRight}>
          <input placeholder="Search..." style={styles.search} />

          <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
            {darkMode ? <FaSun color="yellow" /> : <FaMoon color="black" />}
          </div>

          <FaBell color={theme.text} />
          <FaUserCircle color={theme.text} size={22} />
        </div>
      </div>

      {/* GENERATE */}
      <div style={{ ...styles.generateBox, background: theme.card }}>
        <h2 style={{ color: theme.text }}>Generate AI Podcast</h2>

        <div style={styles.generate}>
          <input
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button} onClick={handleGenerate}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* ⭐ PREMIUM RESULT UI */}
        {result && (
          <div style={styles.resultBox}>

            {result.error ? (
              <p style={{ color: "red" }}>{result.error}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                <h3 style={{ color: theme.text }}>
                  🎧 Generated Podcast
                </h3>

                {/* TOPIC */}
                <div style={styles.aiCard}>
                  <p style={styles.label}>📌 Topic</p>
                  <p style={styles.value}>{result.topic}</p>
                </div>

                {/* RESEARCH */}
                <div style={styles.aiCard}>
                  <p style={styles.label}>📚 Research</p>
                  <p style={styles.value}>{result.research}</p>
                </div>

                {/* SCRIPT */}
                <div style={styles.aiCard}>
                  <p style={styles.label}>📝 Script</p>
                  <p style={styles.value}>{result.script}</p>
                </div>

                {/* AUDIO */}
                <div style={styles.aiCard}>
                  <p style={styles.label}>🎧 Audio</p>

                  <audio controls style={{ width: "100%" }}>
                    <source src={result.audio} type="audio/mpeg" />
                  </audio>
                </div>

              </div>
            )}

          </div>
        )}
      </div>

      {/* CARDS */}
      <div style={styles.cardGrid}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            style={{ ...styles.card, background: theme.card }}
          >
            <h4 style={{ color: theme.sub }}>{s.title}</h4>
            <h2 style={{ color: theme.text }}>{s.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* WORKFLOW */}
      <div style={styles.workflow}>
        {["Research", "Script", "Host", "Edit", "Distribution"].map((step, i) => (
          <div key={i} style={styles.step}>
            <div style={styles.dot} />
            <p style={{ color: theme.text }}>{step}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={{ ...styles.chartBox, background: theme.card }}>
        <h3 style={{ color: theme.text }}>Weekly Performance</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="episodes" stroke="#6C63FF" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  navRight: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  search: {
    padding: 8,
    borderRadius: 8,
    border: "none",
  },

  generateBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  generate: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "none",
  },

  button: {
    padding: "12px 20px",
    background: "#6C63FF",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  resultBox: {
    marginTop: 15,
  },

  aiCard: {
    background: "#1e293b",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #334155",
  },

  label: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
  },

  value: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 1.5,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
  },

  card: {
    padding: 20,
    borderRadius: 12,
  },

  workflow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 30,
  },

  step: {
    textAlign: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#6C63FF",
    margin: "0 auto 5px",
  },

  chartBox: {
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
  },
};
