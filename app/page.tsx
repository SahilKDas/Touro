"use client";

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Cross,
  Map,
  Radio,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TouroMark from "../components/TouroMark";

const features = [
  {
    icon: Radio,
    title: "Live event feed",
    copy: "Score updates, field changes, and weather delays in one scoped feed — no hunting through group texts.",
  },
  {
    icon: CalendarDays,
    title: "Smart Schedule Engine",
    copy: "When a game ends early, downstream games recalculate automatically and only the affected squads get pinged.",
  },
  {
    icon: Map,
    title: "Squad map",
    copy: "Opt-in, squad-scoped location sharing that auto-expires when the tournament weekend ends.",
  },
  {
    icon: Cross,
    title: "Medical quick-access",
    copy: "Allergies, emergency contacts, and insurance — one tap away for a coach in a real emergency.",
  },
];

export default function Landing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"create" | "join">("create");

  const [name, setName] = useState("");
  const [squad, setSquad] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setMode("join");
      setJoinCode(code.toUpperCase());
      document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  function scrollToSignup() {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !squad.trim()) return;
    setSubmitting(true);
    window.localStorage.setItem(
      "touro_profile",
      JSON.stringify({ name: name.trim(), squad: squad.trim(), email: email.trim() }),
    );
    router.push("/role");
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinName.trim() || !joinCode.trim()) return;
    setJoining(true);
    window.localStorage.setItem(
      "touro_profile",
      JSON.stringify({ name: joinName.trim(), squad: "OC Falcons 14U", email: "", joinedViaCode: joinCode.trim().toUpperCase() }),
    );
    router.push("/role");
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-mark"><TouroMark size={20} /></div>
          Touro
        </div>
        <nav className="landing-links">
          <a href="#features">Product</a>
          <a href="#signup" onClick={(e) => { e.preventDefault(); scrollToSignup(); }}>How it works</a>
        </nav>
        <div className="landing-nav-actions">
          <button className="landing-ghost" onClick={() => router.push("/welcome")}>Log in</button>
          <button className="landing-cta" onClick={scrollToSignup}>Get started</button>
        </div>
      </header>

      <section className="landing-hero">
        <p className="landing-eyebrow">YOUTH SPORTS TOURNAMENTS</p>
        <h1>
          Touro turns tournament chaos
          <br />
          into <em>effortless sync</em>
        </h1>
        <blockquote className="landing-quote">
          “Forty families scattered across five group texts, and nobody knows
          the schedule just changed.”
          <span>— every parent, every tournament</span>
        </blockquote>
        <button className="landing-scroll" onClick={scrollToSignup} aria-label="Scroll to sign up">
          <ChevronDown size={22} />
        </button>
      </section>

      <section className="landing-features" id="features">
        {features.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="landing-feature">
            <div className="landing-feature-icon"><Icon size={20} /></div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="landing-signup" id="signup">
        <div className="landing-signup-copy">
          <p className="landing-eyebrow">GET STARTED</p>
          <h2>Bring your squad into sync</h2>
          <p>
            Set up your team parent profile and squad name — GameDay Hub, Touro's
            live tournament dashboard, is ready the moment you sign up.
          </p>
        </div>

        <div className="landing-form-wrap">
          <div className="landing-form-tabs">
            <button type="button" className={mode === "create" ? "active" : ""} onClick={() => setMode("create")}>Create a squad</button>
            <button type="button" className={mode === "join" ? "active" : ""} onClick={() => setMode("join")}>Have an invite code?</button>
          </div>

          {mode === "create" ? (
            <form className="landing-form" onSubmit={handleSubmit}>
              <label>
                Your name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sahil Das" required />
              </label>
              <label>
                Squad / team name
                <input value={squad} onChange={(e) => setSquad(e.target.value)} placeholder="OC Falcons 14U" required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </label>
              <button type="submit" disabled={submitting}>
                Create your squad <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form className="landing-form" onSubmit={handleJoin}>
              <p className="landing-join-hint">
                Invited to a squad? Paste the code your team parent shared and
                you'll be added straight to their personalized squad chat.
              </p>
              <label>
                Your name
                <input value={joinName} onChange={(e) => setJoinName(e.target.value)} placeholder="Alex Kim" required />
              </label>
              <label>
                Invite code
                <input className="landing-code-input" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="FALC-7X2Q" required />
              </label>
              <button type="submit" disabled={joining}>
                Join squad <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Touro</span>
        <span>Built for one wild tournament weekend at a time.</span>
      </footer>
    </div>
  );
}
