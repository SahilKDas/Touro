"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Cross,
  Hotel,
  Info,
  Map,
  MessageCircle,
  Radio,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TouroMark from "../../components/TouroMark";

type Slide = {
  icon: typeof Map;
  accent: "navy" | "gold" | "green" | "orange";
  eyebrow: string;
  title: string;
  copy: string;
  bullets?: { icon: typeof Map; label: string }[];
};

const slides: Slide[] = [
  {
    icon: Radio,
    accent: "gold",
    eyebrow: "NEVER MISS A BEAT",
    title: "One feed, the whole tournament",
    copy: "Score updates, field changes, and weather delays land in a single live feed. When a game runs early, our Smart Schedule Engine recalculates every downstream game automatically.",
    bullets: [
      { icon: Radio, label: "Live event feed" },
      { icon: CalendarDays, label: "Smart Schedule Engine" },
    ],
  },
  {
    icon: Map,
    accent: "green",
    eyebrow: "YOUR SQUAD, CONNECTED",
    title: "Find your people, chat in real time",
    copy: "See exactly where your squad is on a live map, drop messages in your squad chat, and invite teammates with a single link — no more scattered group texts.",
    bullets: [
      { icon: Map, label: "Squad map" },
      { icon: MessageCircle, label: "Squad chat" },
      { icon: UserPlus, label: "One-tap invites" },
    ],
  },
  {
    icon: Cross,
    accent: "orange",
    eyebrow: "READY FOR ANYTHING",
    title: "Every logistics question, answered",
    copy: "Nearby hotels and restaurants, parking and Wi-Fi info, and a parent-controlled medical card a coach can pull up instantly in an emergency.",
    bullets: [
      { icon: Hotel, label: "Nearby hotels" },
      { icon: Cross, label: "Medical quick-access" },
      { icon: Info, label: "Tournament essentials" },
    ],
  },
];

const ACCENT_BG: Record<Slide["accent"], string> = {
  navy: "#0b2545",
  gold: "#b8860b",
  green: "#0f9f75",
  orange: "#f97316",
};

export default function Welcome() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("there");

  useEffect(() => {
    const raw = window.localStorage.getItem("touro_profile");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { name?: string };
      if (parsed.name) setName(parsed.name.split(" ")[0]);
    } catch {
      // ignore malformed profile
    }
  }, []);

  const total = slides.length + 1;
  const isIntro = step === 0;
  const isLast = step === total - 1;
  const slide = !isIntro ? slides[step - 1] : null;

  function next() {
    if (isLast) {
      router.push("/dashboard");
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="onboarding">
      <button className="onboarding-skip" onClick={() => router.push("/dashboard")}>Skip to dashboard</button>

      <div className="onboarding-card">
        {isIntro ? (
          <div className="onboarding-slide onboarding-intro">
            <div className="onboarding-mark"><TouroMark size={40} /></div>
            <p className="onboarding-eyebrow">WELCOME TO TOURO</p>
            <h1>Hey {name}, let's get you in sync</h1>
            <p className="onboarding-copy">
              GameDay Hub is your squad's home base for the whole tournament weekend.
              Here's a 30-second look at what you can do.
            </p>
          </div>
        ) : slide ? (
          <div className="onboarding-slide">
            <div className="onboarding-icon" style={{ background: ACCENT_BG[slide.accent] }}>
              <slide.icon size={26} />
            </div>
            <p className="onboarding-eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p className="onboarding-copy">{slide.copy}</p>
            {slide.bullets && (
              <div className="onboarding-bullets">
                {slide.bullets.map(({ icon: Icon, label }) => (
                  <span className="onboarding-bullet" key={label}><Icon size={14} /> {label}</span>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <div className="onboarding-dots">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              className={i === step ? "active" : ""}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>

        <div className="onboarding-nav">
          <button className="onboarding-back" onClick={back} disabled={isIntro}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="onboarding-next" onClick={next}>
            {isLast ? "Enter GameDay Hub" : "Next"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
