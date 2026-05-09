  import { useState, useEffect } from "react";

const GRADE_POINTS = {
  "A+": 4.0, A: 4.0, "A-": 3.7,
  "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7,
  "D+": 1.3, D: 1.0, "D-": 0.7,
  F: 0.0,
};

const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

const getGPAColor = (gpa) => {
  if (gpa >= 3.7) return "#00e5a0";
  if (gpa >= 3.0) return "#4fc3f7";
  if (gpa >= 2.0) return "#ffb74d";
  return "#ef5350";
};

const getGPALabel = (gpa) => {
  if (gpa >= 3.7) return "Distinction";
  if (gpa >= 3.0) return "Merit";
  if (gpa >= 2.0) return "Pass";
  if (gpa > 0) return "At Risk";
  return "—";
};

const emptyRow = () => ({ id: Date.now() + Math.random(), course: "", grade: "A", credits: "" });

export default function GPACalculator() {
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [gpa, setGpa] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let points = 0, credits = 0;
    let valid = false;
    for (const r of rows) {
      const c = parseFloat(r.credits);
      if (!isNaN(c) && c > 0 && r.grade) {
        points += GRADE_POINTS[r.grade] * c;
        credits += c;
        valid = true;
      }
    }
    if (valid && credits > 0) {
      setGpa(parseFloat((points / credits).toFixed(2)));
      setTotalCredits(credits);
    } else {
      setGpa(null);
      setTotalCredits(0);
    }
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(t);
  }, [rows]);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (id) => {
    if (rows.length > 1) setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const gpaColor = gpa !== null ? getGPAColor(gpa) : "#555";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d14",
      fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
      color: "#e0e0e0",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Accent glow */}
      <div style={{
        position: "fixed", top: "-120px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(0,229,160,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "48px 24px 64px" }}>

        {/* Header */}
        <header style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#00e5a0", textTransform: "uppercase", marginBottom: "12px" }}>
            Academic GPA Calculator
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 52px)", fontWeight: "700",
            fontFamily: "'DM Serif Display', 'Georgia', serif",
            lineHeight: 1.1, margin: 0, letterSpacing: "-0.02em",
            color: "#f5f5f5",
          }}>
            Grade Point<br />
            <span style={{ color: "#00e5a0" }}>Average</span>
          </h1>
          <p style={{ marginTop: "16px", color: "#888", fontSize: "14px", maxWidth: "400px" }}>
            Enter your courses, grades, and credit hours. Your GPA updates in real time.
          </p>
        </header>

        {/* GPA Display */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
          transition: "border-color 0.3s",
          borderColor: gpa !== null ? `${gpaColor}33` : "rgba(255,255,255,0.08)",
        }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>
              Cumulative GPA
            </div>
            <div style={{
              fontSize: "72px",
              fontWeight: "700",
              fontFamily: "'DM Serif Display', Georgia, serif",
              lineHeight: 1,
              color: gpaColor,
              transition: "color 0.4s, transform 0.3s",
              transform: animate ? "scale(1.04)" : "scale(1)",
              display: "inline-block",
            }}>
              {gpa !== null ? gpa.toFixed(2) : "—"}
            </div>
            <div style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
              {gpa !== null ? `${totalCredits} credit hours · ${getGPALabel(gpa)}` : "Add grades to calculate"}
            </div>
          </div>

          {/* GPA Bar */}
          {gpa !== null && (
            <div style={{ flex: "1", minWidth: "160px", maxWidth: "220px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555", marginBottom: "8px" }}>
                <span>0.0</span><span>2.0</span><span>3.0</span><span>4.0</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(gpa / 4) * 100}%`,
                  background: `linear-gradient(90deg, #ef5350, #ffb74d, #4fc3f7, ${gpaColor})`,
                  borderRadius: "99px",
                  transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                {[{ label: "A", range: "≥3.7", color: "#00e5a0" }, { label: "B", range: "≥3.0", color: "#4fc3f7" }, { label: "C", range: "≥2.0", color: "#ffb74d" }].map(b => (
                  <div key={b.label} style={{ fontSize: "10px", color: "#666" }}>
                    <span style={{ color: b.color }}>{b.label}</span> {b.range}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 100px 40px",
            gap: "0",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "#555",
            textTransform: "uppercase",
          }}>
            <span>Course Name</span>
            <span style={{ textAlign: "center" }}>Grade</span>
            <span style={{ textAlign: "center" }}>Credits</span>
            <span />
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div key={row.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 100px 40px",
              gap: "0",
              padding: "10px 16px",
              borderBottom: idx < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              alignItems: "center",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <input
                type="text"
                placeholder={`Course ${idx + 1}`}
                value={row.course}
                onChange={e => updateRow(row.id, "course", e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#d0d0d0",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  width: "100%",
                  paddingRight: "12px",
                }}
              />

              <select
                value={row.grade}
                onChange={e => updateRow(row.id, "grade", e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#e0e0e0",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  padding: "6px 10px",
                  outline: "none",
                  cursor: "pointer",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                {GRADE_OPTIONS.map(g => (
                  <option key={g} value={g} style={{ background: "#1a1a24" }}>{g}</option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                placeholder="3"
                value={row.credits}
                onChange={e => updateRow(row.id, "credits", e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#e0e0e0",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  padding: "6px 10px",
                  outline: "none",
                  width: "72px",
                  textAlign: "center",
                  marginLeft: "12px",
                }}
              />

              <button
                onClick={() => removeRow(row.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: rows.length === 1 ? "#333" : "#555",
                  cursor: rows.length === 1 ? "default" : "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "color 0.15s",
                  marginLeft: "4px",
                }}
                onMouseEnter={e => { if (rows.length > 1) e.target.style.color = "#ef5350"; }}
                onMouseLeave={e => e.target.style.color = rows.length === 1 ? "#333" : "#555"}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add row */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={addRow}
              style={{
                background: "none",
                border: "1px dashed rgba(0,229,160,0.3)",
                borderRadius: "8px",
                color: "#00e5a0",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s, border-color 0.15s",
                width: "100%",
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(0,229,160,0.06)"; e.target.style.borderColor = "rgba(0,229,160,0.6)"; }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.borderColor = "rgba(0,229,160,0.3)"; }}
            >
              + Add Course
            </button>
          </div>
        </div>

        {/* Grade scale reference */}
        <div style={{ marginTop: "32px", padding: "20px 24px", background: "rgba(255,255,255,0.015)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: "14px" }}>Grade Scale Reference</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
            {GRADE_OPTIONS.map(g => (
              <div key={g} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                <span style={{ color: "#888", minWidth: "24px" }}>{g}</span>
                <span style={{ color: "#555" }}>{GRADE_POINTS[g].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "#444", letterSpacing: "0.05em" }}>
          GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap');
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.3; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(0,229,160,0.2); }
      `}</style>
    </div>
  );
}
