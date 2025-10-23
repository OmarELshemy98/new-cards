"use client";

export default function DashboardPage() {
  return (
    <div className="container">
      <h1 style={{fontSize: 24, fontWeight: 700}}>Dashboard</h1>
      <p style={{opacity: .7, marginTop: 4}}>Overview & insights</p>

      <div style={{
        marginTop: 24, border: "1px solid var(--border)", borderRadius: 12,
        background: "#fff", padding: 24, textAlign: "center"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 8px",
          borderRadius: 999, border: "1px solid var(--border)", background: "#fff",
          fontSize: 12, color: "var(--text-dimmer)"
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
          Coming soon
        </div>
        <h2 style={{marginTop: 12, fontSize: 20, fontWeight: 600}}>We’re crafting your analytics</h2>
        <p style={{marginTop: 8, opacity: .7, maxWidth: 520, marginInline: "auto"}}>
          Stay tuned for a clean dashboard with KPIs, trends, and activity. Meanwhile,
          you can manage your business cards from the sidebar.
        </p>
      </div>
    </div>
  );
}
