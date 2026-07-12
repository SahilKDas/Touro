"use client";

import { ArrowRight, Check, ClipboardList, Heart, Megaphone, Shirt, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TouroMark from "../../components/TouroMark";

type RoleKey = "parent" | "player" | "coach" | "organizer" | "fan";

const roles: { key: RoleKey; icon: typeof Users; label: string; desc: string; detailLabel?: string; detailPlaceholder?: string }[] = [
  { key: "parent", icon: Users, label: "Team parent", desc: "Following your kid's games, squad chat, and logistics", detailLabel: "Player's name", detailPlaceholder: "Alex Das" },
  { key: "player", icon: Shirt, label: "Player", desc: "Checking your own schedule, squad chat, and updates", detailLabel: "Jersey number", detailPlaceholder: "#12" },
  { key: "coach", icon: ClipboardList, label: "Coach", desc: "Managing the roster and messaging the whole squad", detailLabel: "Title", detailPlaceholder: "Head coach" },
  { key: "organizer", icon: Megaphone, label: "Organizer", desc: "Running the tournament schedule and logistics", detailLabel: "Organization", detailPlaceholder: "West Coast Classic" },
  { key: "fan", icon: Heart, label: "Fan / family", desc: "Cheering the squad on from near or far" },
];

export default function RoleSelect() {
  const router = useRouter();
  const [selected, setSelected] = useState<RoleKey | null>(null);
  const [detail, setDetail] = useState("");

  const activeRole = roles.find((r) => r.key === selected) ?? null;

  function continueNext() {
    if (!selected) return;
    try {
      const raw = window.localStorage.getItem("touro_profile");
      const profile = raw ? JSON.parse(raw) : {};
      window.localStorage.setItem(
        "touro_profile",
        JSON.stringify({ ...profile, role: selected, roleDetail: detail.trim() }),
      );
    } catch {
      // ignore malformed profile
    }
    router.push("/welcome");
  }

  return (
    <div className="role-page">
      <div className="role-shell">
        <div className="role-copy">
          <div className="role-mark"><TouroMark size={28} /></div>
          <p className="role-eyebrow">ONE LAST THING</p>
          <h1>What brings you to the squad?</h1>
          <p className="role-sub">
            This just tailors what you see first — you can always change it later in settings.
          </p>
        </div>

        <div className="role-options">
          {roles.map(({ key, icon: Icon, label, desc }) => (
            <button
              key={key}
              className={`role-card ${selected === key ? "active" : ""}`}
              onClick={() => setSelected(key)}
              type="button"
            >
              <div className="role-card-icon"><Icon size={19} /></div>
              <div className="role-card-text"><strong>{label}</strong><span>{desc}</span></div>
              <div className={`role-card-check ${selected === key ? "active" : ""}`}>
                {selected === key && <Check size={12} />}
              </div>
            </button>
          ))}

          {activeRole?.detailLabel && (
            <label className="role-detail">
              {activeRole.detailLabel}
              <input
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder={activeRole.detailPlaceholder}
              />
            </label>
          )}

          <button className="role-continue" onClick={continueNext} disabled={!selected}>
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
