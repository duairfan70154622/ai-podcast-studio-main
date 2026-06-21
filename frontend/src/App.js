import { useState } from "react";
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
  const [step, setStep] = useState(0);

  const workflowSteps = [
    "Researching AI...",
    "Generating Script...",
    "Creating Voice...",
    "Finalizing Episode...",
  ];

  const theme = darkMode
    ? {
        bg: "#0b1220",
        card: "#111a2e",
        text: "#e5e7eb",
        sub: "#94a3b8",
        accent: "#6C63FF",
        border: "#1f2a44",
      }
    : {
        bg: "#f8fafc",
        card: "#ffffff",
        text: "#0f172a",
        sub: "#475569",
        accent: "#6C63FF",
        border: "#e2e8f0",
      };

  const stats = [
    { title: "Active Pipelines", value: 4 },
    { title: "Episodes Published", value: 12 },
    { title: "Audio Minutes", value: 340 },
    { title: "Success Rate", value: "92%" },
  ];

  const chartData = [
    { name: "Mon", episodes: 2 },
    { name: "Tue", episodes: 4 },
    { name: "Wed", episodes: 3 },
    { name: "Thu", episodes: 6 },
    { name: "Fri", episodes: 5 },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setStep(0);

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= workflowSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    try {
      const res = await fetch("https://duairfan-ai-podcast-backend.hf.space/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.episode || data);

    } catch (error) {
      setResult({ error: `Backend connection failed: ${error.message}` });
    }

    setTimeout(() => setLoading(false), 3500);
  };

  return (
    <div style={{ minHeight: "100vh", padding: 20, background: theme.bg }}>

      {/* NAVBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: theme.text }}>🎧 AI Podcast Studio</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer", fontSize: 18 }}>
            {darkMode ? <FaSun color="gold" /> : <FaMoon color="#333" />}
          </div>

          <FaBell color={theme.text} />
          <FaUserCircle color={theme.text} size={22} />
        </div>
      </div>

      {/* GENERATE BOX */}
      <div style={{
        background: theme.card,
        padding: 20,
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
      }}>
        <h2 style={{ color: theme.text }}>Generate AI Podcast</h2>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <input
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              outline: "none",
            }}
          />

          <button
            onClick={handleGenerate}
            style={{
              padding: "12px 22px",
              background: theme.accent,
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* AI WORKFLOW ANIMATION */}
        {loading && (
          <div style={{ marginTop: 15 }}>
            <p style={{ color: theme.sub }}>⚡ AI Workflow Running...</p>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {workflowSteps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    fontSize: 12,
                    background: i <= step ? theme.accent : theme.card,
                    color: i <= step ? "white" : theme.sub,
                    border: `1px solid ${theme.border}`,
                    transition: "0.3s",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div style={{ marginTop: 20 }}>

            {result.error ? (
              <div style={{ 
                padding: 15, 
                background: '#fee', 
                borderRadius: 8, 
                color: 'red',
                border: '1px solid #fcc'
              }}>
                ❌ {result.error}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                <h3 style={{ color: theme.text }}>🎧 Generated Podcast</h3>

                <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <b style={{ color: theme.sub }}>📌 Topic</b>
                  <p style={{ color: theme.text }}>{result.topic}</p>
                </div>

                <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <b style={{ color: theme.sub }}>📚 Research</b>
                  <p style={{ color: theme.text, whiteSpace: 'pre-wrap' }}>{result.research}</p>
                </div>

                <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <b style={{ color: theme.sub }}>📝 Script</b>
                  <p style={{ color: theme.text, whiteSpace: 'pre-wrap' }}>{result.script}</p>
                </div>

                <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <b style={{ color: theme.sub }}>🎧 Audio</b>
                  {result.audio?.audio_url ? (
                    <audio controls style={{ width: "100%", marginTop: 10 }}>
                      <source src={result.audio.audio_url} type="audio/mpeg" />
                    </audio>
                  ) : (
                    <p style={{ color: theme.sub }}>Audio generation pending...</p>
                  )}
                </div>

                {result.buzz && (
                  <div style={{ 
                    padding: 10, 
                    background: '#064e3b', 
                    borderRadius: 8,
                    color: "#22c55e", 
                    fontWeight: "bold" 
                  }}>
                    📢 {result.buzz.message || 'Published to Buzzsprout'}
                  </div>
                )}

                {result.spotify && (
                  <div style={{ 
                    padding: 10, 
                    background: '#1e3a5f', 
                    borderRadius: 8,
                    color: "#38bdf8", 
                    fontWeight: "bold" 
                  }}>
                    🎵 {result.spotify.message || 'Published to Spotify'}
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 20 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: theme.card,
            padding: 20,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}>
            <h4 style={{ color: theme.sub }}>{s.title}</h4>
            <h2 style={{ color: theme.text }}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={{
        background: theme.card,
        marginTop: 30,
        padding: 20,
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
      }}>
        <h3 style={{ color: theme.text }}>Weekly Performance</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" stroke={theme.sub} />
            <YAxis stroke={theme.sub} />
            <Tooltip />
            <Line type="monotone" dataKey="episodes" stroke={theme.accent} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}