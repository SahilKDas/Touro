"use client";

import {
  Activity,
  ArrowLeft,
  Beef,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CloudSun,
  Coffee,
  Copy,
  Cross,
  Drumstick,
  Dumbbell,
  Fish,
  Hotel,
  Info,
  Link2,
  Loader2,
  Lock,
  LogOut,
  Map,
  MapPin,
  Menu,
  Navigation,
  ParkingSquare,
  Phone,
  Pizza,
  Plus,
  Sandwich,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  Users,
  Utensils,
  Video,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TouroMark from "../../components/TouroMark";

const SquadMap = dynamic(() => import("../../components/SquadMap"), { ssr: false });

type TabKey = "home" | "schedule" | "map" | "squad" | "hotels" | "restaurants";

const nav: { key: TabKey; label: string; icon: typeof Activity }[] = [
  { key: "home", label: "Home", icon: Activity },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "map", label: "Navigation", icon: Map },
  { key: "squad", label: "Squad", icon: Users },
  { key: "hotels", label: "Hotels", icon: Hotel },
  { key: "restaurants", label: "Restaurants", icon: Utensils },
];

const mapLegend = [
  { color: "#0f9f75", label: "Fields" },
  { color: "#334e68", label: "Hotels" },
  { color: "#f97316", label: "Restaurants" },
  { color: "#b8860b", label: "Parking" },
  { color: "#dc2626", label: "First aid / HQ" },
];

const feed = [
  { time: "10:42 AM", type: "Schedule", title: "Semifinal moved up", detail: "Field 7 · New start 12:40 PM", tone: "orange" },
  { time: "10:31 AM", type: "Score", title: "Falcons win 8–3", detail: "Final · Pool Game 3", tone: "gold" },
  { time: "10:18 AM", type: "Squad", title: "Maya shared a location", detail: "Near the north entrance", tone: "green" },
  { time: "9:54 AM", type: "Weather", title: "Clear through 3 PM", detail: "72° · Light wind", tone: "navy" },
  { time: "9:30 AM", type: "Schedule", title: "Warmup starts in 30 min", detail: "Field 4 practice pitch", tone: "orange" },
  { time: "8:35 AM", type: "Score", title: "Pool Game 3 underway", detail: "OC Falcons vs. Riverside FC", tone: "gold" },
  { time: "8:02 AM", type: "Squad", title: "Coach Danny checked in", detail: "Field 4 entrance", tone: "green" },
  { time: "7:45 AM", type: "Weather", title: "Fields open, no delays", detail: "68° · Overcast, clearing by 9 AM", tone: "navy" },
];

const places = [
  { id: "tacomesa", name: "Taco Mesa", kind: "Lunch · Mexican", distance: "0.4 mi", wait: "8 min", crowd: 42, icon: Utensils, squadNote: "Team lunch here today · 12 squad members", phone: "(714) 555-0110", hours: "Open until 9 PM", menuHighlight: "Carne asada tacos" },
  { id: "fieldhouse", name: "Fieldhouse Café", kind: "Coffee · Sandwiches", distance: "0.7 mi", wait: "4 min", crowd: 18, icon: Coffee, squadNote: "Maya + 2 others ate here this morning", phone: "(714) 555-0121", hours: "Open until 4 PM", menuHighlight: "Turkey club + cold brew" },
  { id: "parkside", name: "Parkside Grill", kind: "American · Patio", distance: "1.1 mi", wait: "25 min", crowd: 86, icon: Utensils, squadNote: "Popular after evening games", phone: "(714) 555-0134", hours: "Open until 10 PM", menuHighlight: "Burgers + patio seating for groups" },
  { id: "pizzapress", name: "Pizza Press", kind: "Pizza · Build your own", distance: "0.5 mi", wait: "12 min", crowd: 55, icon: Pizza, squadNote: "Coach Danny's post-game pick", phone: "(714) 555-0145", hours: "Open until 9 PM", menuHighlight: "Build-your-own, ready in 5 min" },
  { id: "innout", name: "In-N-Out Burger", kind: "Burgers · Fast food", distance: "1.3 mi", wait: "30 min", crowd: 92, icon: Beef, squadNote: "Squad favorite, expect a line after evening games", phone: "(714) 555-0156", hours: "Open until 1 AM", menuHighlight: "Animal style fries" },
  { id: "panera", name: "Panera Bread", kind: "Sandwiches · Bakery-café", distance: "0.6 mi", wait: "10 min", crowd: 38, icon: Sandwich, squadNote: "Good for grabbing a quick group order", phone: "(714) 555-0167", hours: "Open until 8 PM", menuHighlight: "Group order pickup available" },
  { id: "sushiboat", name: "Sushi Boat", kind: "Japanese · Sushi", distance: "1.5 mi", wait: "20 min", crowd: 60, icon: Fish, squadNote: "A few squad families ate here last night", phone: "(714) 555-0178", hours: "Open until 9:30 PM", menuHighlight: "All-you-can-eat boats" },
  { id: "chickfila", name: "Chick-fil-A", kind: "Chicken · Fast food", distance: "0.5 mi", wait: "15 min", crowd: 70, icon: Drumstick, squadNote: "Team favorite for post-practice snacks", phone: "(714) 555-0189", hours: "Open until 9 PM", menuHighlight: "Spicy chicken sandwich" },
  { id: "olivegarden", name: "Olive Garden", kind: "Italian · Sit-down", distance: "1.2 mi", wait: "20 min", crowd: 50, icon: Utensils, squadNote: "Good option for a bigger team dinner", phone: "(714) 555-0190", hours: "Open until 10 PM", menuHighlight: "Unlimited soup, salad & breadsticks" },
  { id: "starbucks", name: "Starbucks", kind: "Coffee", distance: "0.3 mi", wait: "6 min", crowd: 45, icon: Coffee, squadNote: "Team parents' go-to before morning games", phone: "(714) 555-0201", hours: "Open until 8 PM", menuHighlight: "Mobile order ahead recommended" },
  { id: "habit", name: "The Habit Burger Grill", kind: "Burgers · Fast casual", distance: "0.9 mi", wait: "14 min", crowd: 58, icon: Beef, squadNote: "Charburgers are a squad post-game tradition", phone: "(714) 555-0212", hours: "Open until 9:30 PM", menuHighlight: "Santa Barbara charburger" },
];

const hotels = [
  { id: "hampton", name: "Hampton Inn & Suites", distance: "0.3 mi", price: "$189/night", rating: 4.5, squadCount: 6, squadNote: "6 squad families staying here", phone: "(714) 555-0201", amenities: ["Free breakfast", "Pool", "Shuttle to venue"] },
  { id: "courtyard", name: "Courtyard by Marriott", distance: "0.6 mi", price: "$215/night", rating: 4.6, squadCount: 3, squadNote: "3 squad families staying here", phone: "(714) 555-0212", amenities: ["Free Wi-Fi", "Gym", "On-site restaurant"] },
  { id: "bestwestern", name: "Best Western Plus", distance: "0.9 mi", price: "$149/night", rating: 4.2, squadCount: 2, squadNote: "2 squad families staying here", phone: "(714) 555-0223", amenities: ["Free breakfast", "Pet friendly", "Parking included"] },
  { id: "residenceinn", name: "Residence Inn by Marriott", distance: "1.0 mi", price: "$199/night", rating: 4.4, squadCount: 4, squadNote: "4 squad families staying here · extended-stay suites", phone: "(714) 555-0234", amenities: ["Full kitchen", "Free breakfast", "Pool"] },
  { id: "holidayinn", name: "Holiday Inn Express", distance: "1.2 mi", price: "$159/night", rating: 4.1, squadCount: 3, squadNote: "3 squad families staying here", phone: "(714) 555-0245", amenities: ["Free breakfast", "Free Wi-Fi", "Fitness center"] },
  { id: "hiltongarden", name: "Hilton Garden Inn", distance: "0.8 mi", price: "$229/night", rating: 4.7, squadCount: 5, squadNote: "5 squad families staying here · closest upscale option", phone: "(714) 555-0256", amenities: ["Restaurant on-site", "Pool", "Business center"] },
  { id: "laquinta", name: "La Quinta Inn & Suites", distance: "1.4 mi", price: "$129/night", rating: 4.0, squadCount: 2, squadNote: "2 squad families staying here · most budget-friendly", phone: "(714) 555-0267", amenities: ["Pet friendly", "Free breakfast", "Parking included"] },
  { id: "springhill", name: "SpringHill Suites by Marriott", distance: "0.7 mi", price: "$209/night", rating: 4.5, squadCount: 3, squadNote: "3 squad families staying here", phone: "(714) 555-0278", amenities: ["Free breakfast", "Pool", "Suites with sofa beds"] },
  { id: "homewood", name: "Homewood Suites by Hilton", distance: "1.1 mi", price: "$219/night", rating: 4.6, squadCount: 2, squadNote: "2 squad families staying here", phone: "(714) 555-0289", amenities: ["Full kitchen", "Free breakfast", "Evening social"] },
  { id: "extendedstay", name: "Extended Stay America", distance: "1.6 mi", price: "$139/night", rating: 3.9, squadCount: 1, squadNote: "1 squad family staying here", phone: "(714) 555-0290", amenities: ["Kitchenette", "Weekly rates", "Free Wi-Fi"] },
  { id: "motel6", name: "Motel 6", distance: "1.8 mi", price: "$89/night", rating: 3.5, squadCount: 1, squadNote: "1 squad family staying here · most affordable", phone: "(714) 555-0301", amenities: ["Pet friendly", "Parking included", "Budget option"] },
];

const essentials = [
  { icon: ParkingSquare, label: "Parking", detail: "Lot C · 5 min walk · $10/day" },
  { icon: Wifi, label: "Venue Wi-Fi", detail: "TourneyGuest · pw: gofalcons25" },
  { icon: Cross, label: "First aid", detail: "Tournament HQ tent, Field 1 entrance" },
  { icon: Info, label: "Lost & found", detail: "Tournament HQ, Field 1 entrance" },
];

const tournamentInfo = {
  name: "West Coast Classic",
  dates: "July 25–27, 2026 · Day 2 of 3",
  division: "Boys 14U",
  format: "Pool play + single-elim bracket",
  field: "24 teams · 6 pools",
  venue: "Anaheim Sports Complex",
  standing: "Pool C · 1st place (4–0)",
};

const bracketStages: { stage: string; result: string; status: "complete" | "current" | "upcoming" }[] = [
  { stage: "Pool Play", result: "4–0 · 1st in Pool C", status: "complete" },
  { stage: "Quarterfinal", result: "W 6–2 vs. Lakewood SC", status: "complete" },
  { stage: "Semifinal", result: "vs. SD Waves · Field 7 · 1:00 PM", status: "current" },
  { stage: "Championship", result: "TBD · Stadium field if advanced", status: "upcoming" },
];

type MandatoryItem = { time: string; period: string; tag: string; tagClass: string; title: string; detail: string; icon: typeof Trophy };

const mandatorySchedule: MandatoryItem[] = [
  { time: "7:30", period: "AM", tag: "GROUP CALL", tagClass: "call", title: "Pre-tournament team huddle", detail: "Zoom sync with Coach Danny · required for all players", icon: Video },
  { time: "8:00", period: "AM", tag: "PRACTICE", tagClass: "practice", title: "Warmup & drills", detail: "Field 4 practice pitch · 30 min", icon: Dumbbell },
  { time: "8:30", period: "AM", tag: "GAME", tagClass: "game", title: "Pool Game 3 vs. Riverside FC", detail: "Field 4 · mandatory arrival 8:00 AM", icon: Trophy },
  { time: "11:00", period: "AM", tag: "TEAM LUNCH", tagClass: "lunch", title: "Team lunch", detail: "Taco Mesa · table for 12 · mandatory attendance", icon: Utensils },
  { time: "1:00", period: "PM", tag: "GAME", tagClass: "game", title: "Semifinal vs. SD Waves", detail: "Field 7 · arrive 30 min early", icon: Trophy },
  { time: "3:35", period: "PM", tag: "POSSIBLE GAME", tagClass: "possible", title: "Championship", detail: "Stadium field · if advanced", icon: Trophy },
  { time: "6:30", period: "PM", tag: "GROUP CALL", tagClass: "call", title: "End-of-day debrief call", detail: "Zoom with Coach Danny · recap + tomorrow's plan", icon: Video },
];

type CustomEvent = { id: number; time: string; period: string; title: string; detail: string };

type MedicalInfo = { allergies: string; emergencyContact: string; insurance: string; notes: string };

const roster: { name: string; role: string; initials: string; online: boolean; medical?: MedicalInfo }[] = [
  { name: "Sahil Das", role: "Team parent", initials: "SK", online: true },
  { name: "Maya Reyes", role: "Player · #7", initials: "MR", online: true, medical: { allergies: "Shellfish", emergencyContact: "Elena Reyes · (714) 555-0198", insurance: "Kaiser Permanente · •••• 4471", notes: "Carries an asthma inhaler in her gear bag" } },
  { name: "Jordan Lee", role: "Player · #12", initials: "JL", online: true, medical: { allergies: "Peanuts · Penicillin", emergencyContact: "Michelle Lee · (714) 555-0142", insurance: "Blue Shield · •••• 2841", notes: "EpiPen in red equipment bag" } },
  { name: "Coach Danny", role: "Head coach", initials: "CD", online: true },
  { name: "Priya Shah", role: "Team parent", initials: "PS", online: false },
  { name: "Alex Kim", role: "Player · #4", initials: "AK", online: true, medical: { allergies: "None reported", emergencyContact: "Grace Kim · (714) 555-0177", insurance: "Anthem · •••• 5522", notes: "Wears contact lenses, keeps a spare pair in bag" } },
  { name: "Ravi Menon", role: "Team parent", initials: "RM", online: false },
  { name: "Tessa Ford", role: "Player · #9", initials: "TF", online: true, medical: { allergies: "Bee stings", emergencyContact: "Daniel Ford · (714) 555-0163", insurance: "UnitedHealthcare · •••• 3390", notes: "Carries an EpiPen — ask coach for location" } },
  { name: "Diego Martinez", role: "Player · #3", initials: "DM", online: true, medical: { allergies: "None reported", emergencyContact: "Ana Martinez · (714) 555-0311", insurance: "Kaiser Permanente · •••• 6602", notes: "No known conditions" } },
  { name: "Emma Chen", role: "Player · #15", initials: "EC", online: true, medical: { allergies: "Tree nuts", emergencyContact: "Wei Chen · (714) 555-0322", insurance: "Cigna · •••• 7713", notes: "Carries an EpiPen in her backpack" } },
  { name: "Liam Foster", role: "Player · #21", initials: "LF", online: false, medical: { allergies: "None reported", emergencyContact: "Karen Foster · (714) 555-0333", insurance: "Aetna · •••• 8824", notes: "Mild asthma, inhaler in gear bag" } },
  { name: "Sofia Ruiz", role: "Player · #6", initials: "SR", online: true, medical: { allergies: "Latex", emergencyContact: "Marco Ruiz · (714) 555-0344", insurance: "Blue Shield · •••• 9935", notes: "No known conditions" } },
  { name: "Coach Marcus", role: "Assistant coach", initials: "CM", online: true },
  { name: "Linda Osei", role: "Team manager", initials: "LO", online: true },
  { name: "Nina Patel", role: "Team parent", initials: "NP", online: false },
  { name: "Carlos Vega", role: "Team parent", initials: "CV", online: true },
  { name: "Tom Bennett", role: "Team parent", initials: "TB", online: false },
  { name: "Aisha Johnson", role: "Team parent", initials: "AJ", online: true },
];

const quickReplies = ["On my way!", "Running 5 min late", "Great game! 🎉", "See you at Field 7"];

const seedMessages: ChatMessage[] = [
  { id: 1, kind: "message", author: "Coach Danny", initials: "CD", text: "Morning squad! Warmup at 8:00 sharp — cleats + mouthguards.", time: "7:58 AM" },
  { id: 2, kind: "message", author: "Maya Reyes", initials: "MR", text: "On it coach! Bringing extra water bottles too 💧", time: "8:01 AM" },
  { id: 3, kind: "message", author: "Jordan Lee", initials: "JL", text: "Anyone know if the semifinal moved up? Heard something about Field 7", time: "10:40 AM" },
  { id: 4, kind: "message", author: "Coach Danny", initials: "CD", text: "Yep — 12:40 PM now, Field 7. Arrive 30 min early!", time: "10:43 AM" },
  { id: 5, kind: "message", author: "Tessa Ford", initials: "TF", text: "Great game this morning everyone! 🏆 8–3!!", time: "10:50 AM" },
];

type ChatMessage = {
  id: number;
  kind: "message" | "system";
  author?: string;
  initials?: string;
  text: string;
  time: string;
  self?: boolean;
};

type Profile = { name: string; squad: string; joinedViaCode?: string; role?: string; roleDetail?: string };

const ROLE_LABELS: Record<string, string> = {
  parent: "Team parent",
  player: "Player",
  coach: "Coach",
  organizer: "Organizer",
  fan: "Fan / family",
};

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function inviteCodeFor(squad: string): string {
  const key = `touro_invite_${squad.toLowerCase().replace(/\s+/g, "-")}`;
  const cached = window.localStorage.getItem(key);
  if (cached) return cached;
  const prefix = squad.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 4) || "TOUR";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const code = `${prefix}-${suffix}`;
  window.localStorage.setItem(key, code);
  return code;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>({ name: "Sahil", squad: "OC Falcons 14U" });
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [cascade, setCascade] = useState(false);
  const [cascadeExplain, setCascadeExplain] = useState<string | null>(null);
  const [cascadeLoading, setCascadeLoading] = useState(false);
  const [sharing, setSharing] = useState(true);
  const [medicalPlayer, setMedicalPlayer] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [highlightPlace, setHighlightPlace] = useState<string | null>(null);
  const [directionsTarget, setDirectionsTarget] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  const [digest, setDigest] = useState<string | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [chatInput, setChatInput] = useState("");
  const chatListRef = useRef<HTMLDivElement>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteNameInput, setInviteNameInput] = useState("");
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);

  const [scheduleView, setScheduleView] = useState<"mine" | "mandatory">("mine");
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventPeriod, setNewEventPeriod] = useState("AM");
  const [newEventDetail, setNewEventDetail] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem("touro_profile");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<Profile>;
      const nextProfile: Profile = {
        name: parsed.name?.trim() || "Sahil",
        squad: parsed.squad?.trim() || "OC Falcons 14U",
        joinedViaCode: parsed.joinedViaCode,
        role: parsed.role,
        roleDetail: parsed.roleDetail,
      };
      setProfile(nextProfile);
      if (nextProfile.joinedViaCode) {
        setMessages((prev) => [
          { id: 0, kind: "system", text: `${nextProfile.name} joined the squad using invite code ${nextProfile.joinedViaCode} 🎉`, time: "Just now" },
          ...prev,
        ]);
      }
    } catch {
      // ignore malformed profile data
    }
  }, []);

  useEffect(() => {
    const code = inviteCodeFor(profile.squad);
    setInviteCode(code);
    setInviteLink(`${window.location.origin}/?code=${code}`);
  }, [profile.squad]);

  useEffect(() => {
    chatListRef.current?.scrollTo({ top: chatListRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const raw = window.localStorage.getItem("touro_custom_schedule");
    if (!raw) return;
    try {
      setCustomEvents(JSON.parse(raw) as CustomEvent[]);
    } catch {
      // ignore malformed schedule data
    }
  }, []);

  function saveCustomEvents(next: CustomEvent[]) {
    setCustomEvents(next);
    window.localStorage.setItem("touro_custom_schedule", JSON.stringify(next));
  }

  function addCustomEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventTime.trim()) return;
    saveCustomEvents([
      ...customEvents,
      { id: Date.now(), title: newEventTitle.trim(), time: newEventTime.trim(), period: newEventPeriod, detail: newEventDetail.trim() },
    ]);
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventDetail("");
    setNewEventPeriod("AM");
    setAddEventOpen(false);
  }

  function removeCustomEvent(id: number) {
    saveCustomEvents(customEvents.filter((ev) => ev.id !== id));
  }

  function openMandatorySchedule() {
    setActiveTab("schedule");
    setScheduleView("mandatory");
    setMobileNav(false);
  }

  function goTab(tab: TabKey) {
    setActiveTab(tab);
    setMobileNav(false);
  }

  function focusPlace(id: string) {
    setActiveTab(hotels.some((h) => h.id === id) ? "hotels" : "restaurants");
    setHighlightPlace(id);
    setMobileNav(false);
  }

  function showDirections(id: string) {
    setActiveTab("map");
    setDirectionsTarget(id);
    setMobileNav(false);
  }

  useEffect(() => {
    if (!highlightPlace || (activeTab !== "hotels" && activeTab !== "restaurants")) return;
    const scrollTimer = window.setTimeout(() => {
      document.querySelector(`[data-place-id="${highlightPlace}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    const clearTimer = window.setTimeout(() => setHighlightPlace(null), 2600);
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [highlightPlace, activeTab]);

  async function runCascade() {
    setCascade(true);
    setToast(true);
    window.setTimeout(() => setToast(false), 4200);

    setCascadeLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "cascade-explain" }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      setCascadeExplain(data.answer ?? data.error ?? null);
    } catch {
      setCascadeExplain(null);
    } finally {
      setCascadeLoading(false);
    }
  }

  async function askAssistant(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || asking) return;
    setAsking(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "assistant", question: q }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      setAnswer(data.answer ?? `Couldn't reach GameDay AI: ${data.error ?? "unknown error"}`);
    } catch {
      setAnswer("Couldn't reach GameDay AI right now — check your connection and try again.");
    } finally {
      setAsking(false);
    }
  }

  async function generateDigest() {
    if (digestLoading) return;
    setDigestLoading(true);
    setDigest(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "digest" }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      setDigest(data.answer ?? `Couldn't generate a digest: ${data.error ?? "unknown error"}`);
    } catch {
      setDigest("Couldn't generate a digest right now — check your connection and try again.");
    } finally {
      setDigestLoading(false);
    }
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        kind: "message",
        author: profile.name,
        initials: initialsOf(profile.name),
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        self: true,
      },
    ]);
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(chatInput);
    setChatInput("");
  }

  async function copyInviteCode() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setInviteCopied(true);
      window.setTimeout(() => setInviteCopied(false), 2000);
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  async function copyInviteLink() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  function addInvite(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inviteNameInput.trim();
    if (!trimmed) return;
    setPendingInvites((prev) => [...prev, trimmed]);
    setInviteNameInput("");
  }

  function logOut() {
    window.localStorage.removeItem("touro_profile");
    window.location.href = "/";
  }

  const firstName = profile.name.split(" ")[0] || profile.name;
  const roleLabel = (profile.role && ROLE_LABELS[profile.role]) || "Team parent";
  const squadEmblem = profile.squad
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><TouroMark size={22} /></div>
          <span>GameDay<span>Hub</span></span>
        </div>
        <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={20}/></button>
        <nav>
          <p className="nav-label">Tournament</p>
          {nav.map(({ key, label, icon: Icon }) => (
            <button key={key} className={activeTab === key ? "active" : ""} onClick={() => goTab(key)}>
              <Icon size={19} /> {label}{label === "Schedule" && <span className="nav-badge">3</span>}
            </button>
          ))}
        </nav>
        <button className="squad-mini" onClick={() => goTab("squad")}>
          <div className="squad-emblem">{squadEmblem || "OF"}</div>
          <div><strong>{profile.squad}</strong><span>18 members online</span></div>
          <ChevronRight size={17} />
        </button>
        <div className="profile">
          <div className="avatar">{firstName.slice(0, 2).toUpperCase()}</div>
          <div><strong>{profile.name}</strong><span>{roleLabel}</span></div>
          <button aria-label="Notifications"><Bell size={18}/><i /></button>
        </div>
        <button className="logout-btn" onClick={logOut}><LogOut size={14}/> Log out</button>
      </aside>

      {mobileNav && <button className="nav-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}

      <main>
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={22}/></button>
          <div>
            <p className="eyebrow">WEST COAST CLASSIC · DAY 2 OF 3</p>
            <h1>Good morning, {firstName} <span>👋</span></h1>
          </div>
          <div className="topbar-tools">
            <div className="weather"><CloudSun size={22}/><div><strong>72°</strong><span>Clear skies</span></div></div>
            <button className={`sharing ${sharing ? "on" : ""}`} onClick={() => setSharing(!sharing)}>
              <Navigation size={16} fill={sharing ? "currentColor" : "none"}/>
              <span>{sharing ? "Location on" : "Location off"}</span><i />
            </button>
          </div>
        </header>

        {activeTab === "home" && (
          <>
            <h2 className="zone-title">Right now</h2>
            <section className="hero-grid">
              <article className="next-game-card">
                <div className="next-top">
                  <div><span className="pulse" />UP NEXT</div>
                  <span className="field-pill"><MapPin size={14}/> Field 7</span>
                </div>
                <div className="matchup">
                  <div className="team"><div className="team-logo falcons">F</div><strong>OC Falcons</strong><span>4–0</span></div>
                  <div className="versus"><strong>{cascade ? "12:40" : "1:00"}</strong><span>PM</span><small>{cascade ? "Moved up 20 min" : "Semifinal"}</small></div>
                  <div className="team"><div className="team-logo waves">W</div><strong>SD Waves</strong><span>3–1</span></div>
                </div>
                <div className="game-footer">
                  <div><Clock3 size={16}/><span>{cascade ? "Starts in 1 hr 58 min" : "Starts in 2 hr 18 min"}</span></div>
                  <button onClick={() => showDirections("f7")}><Navigation size={15}/> Directions</button>
                </div>
              </article>

              <article className="impact-card">
                <div className="impact-icon"><Zap size={22} fill="currentColor" /></div>
                <div>
                  <span>SMART SCHEDULE ENGINE</span>
                  <h2>{cascade ? "Schedule recalculated" : "A game is running early"}</h2>
                  <p>{cascade ? "3 downstream games updated. Only the affected squads were notified." : "Pool Game 6 is projected to finish 20 minutes ahead. Preview the downstream impact."}</p>
                </div>
                <button className={cascade ? "done" : ""} onClick={runCascade} disabled={cascade}>
                  {cascade ? <><Check size={17}/> Updated</> : <>Run live demo <ChevronRight size={17}/></>}
                </button>
              </article>
            </section>

            <section className="ai-panel">
              <div className="ai-panel-head">
                <div className="ai-panel-icon"><Bot size={19}/></div>
                <div><span className="section-kicker">GAMEDAY AI</span><h2>Ask about your tournament</h2></div>
              </div>
              <form onSubmit={askAssistant} className="ai-form">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Do I have time to grab lunch before the semifinal?"
                  aria-label="Ask GameDay AI"
                />
                <button type="submit" disabled={asking || !question.trim()}>
                  {asking ? <Loader2 size={16} className="spin"/> : <Sparkles size={16}/>}
                  {asking ? "Thinking…" : "Ask"}
                </button>
              </form>
              {answer && <p className="ai-answer">{answer}</p>}
            </section>

            <h2 className="zone-title">Tournament</h2>
            <section className="content-grid">
              <article className="panel bracket-panel">
                <div className="panel-head"><div><span className="section-kicker">YOUR PROGRESS</span><h2>Bracket path</h2></div></div>
                <div className="bracket-stepper">
                  {bracketStages.map((s, i) => (
                    <div className={`bracket-row ${s.status} ${i === bracketStages.length - 1 ? "last" : ""}`} key={s.stage}>
                      <div className="bracket-node">
                        {s.status === "complete" ? <Check size={13}/> : s.status === "current" ? <span className="bracket-pulse"/> : <Lock size={11}/>}
                      </div>
                      <div className="bracket-info"><strong>{s.stage}</strong><span>{s.result}</span></div>
                      {s.status === "current" && <span className="bracket-live">LIVE</span>}
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel tourney-info-panel">
                <div className="panel-head"><div><span className="section-kicker">TOURNAMENT INFO</span><h2>{tournamentInfo.name}</h2></div></div>
                <div className="tourney-info-grid">
                  <div><span>Dates</span><strong>{tournamentInfo.dates}</strong></div>
                  <div><span>Division</span><strong>{tournamentInfo.division}</strong></div>
                  <div><span>Format</span><strong>{tournamentInfo.format}</strong></div>
                  <div><span>Field</span><strong>{tournamentInfo.field}</strong></div>
                  <div><span>Venue</span><strong>{tournamentInfo.venue}</strong></div>
                  <div><span>Your standing</span><strong>{tournamentInfo.standing}</strong></div>
                </div>
              </article>
            </section>

            <h2 className="zone-title">Happening now</h2>
            <section className="content-grid full">
              <article className="panel feed-panel feed-panel-big">
                <div className="panel-head"><div><span className="section-kicker">LIVE FEED</span><h2>What's happening</h2></div><span className="live-label"><i/> LIVE</span></div>
                <FeedList />
                <button className="feed-more" onClick={() => goTab("squad")}>Open squad chat & digest <ChevronRight size={16}/></button>
              </article>
            </section>

            <section className="content-grid full">
              <article className="panel essentials-panel">
                <div className="panel-head"><div><span className="section-kicker">GOOD TO KNOW</span><h2>Tournament essentials</h2></div></div>
                <div className="essentials-list">
                  {essentials.map(({ icon: Icon, label, detail }) => (
                    <div className="essential-item" key={label}>
                      <div className="essential-icon"><Icon size={17}/></div>
                      <div><strong>{label}</strong><span>{detail}</span></div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        {activeTab === "schedule" && scheduleView === "mine" && (
          <>
            <section className="content-grid full">
              <article className="impact-card standalone">
                <div className="impact-icon"><Zap size={22} fill="currentColor" /></div>
                <div>
                  <span>SMART SCHEDULE ENGINE</span>
                  <h2>{cascade ? "Schedule recalculated" : "A game is running early"}</h2>
                  <p>{cascade ? "3 downstream games updated. Only the affected squads were notified." : "Pool Game 6 is projected to finish 20 minutes ahead. Preview the downstream impact."}</p>
                  {cascadeLoading && <p className="ai-inline"><Loader2 size={13} className="spin"/> GameDay AI is explaining the change…</p>}
                  {!cascadeLoading && cascadeExplain && <p className="ai-inline solid"><Bot size={13}/> {cascadeExplain}</p>}
                </div>
                <button className={cascade ? "done" : ""} onClick={runCascade} disabled={cascade}>
                  {cascade ? <><Check size={17}/> Updated</> : <>Run live demo <ChevronRight size={17}/></>}
                </button>
              </article>
            </section>
            <section className="content-grid full">
              <article className="panel schedule-panel">
                <div className="panel-head">
                  <div><span className="section-kicker">TODAY AT A GLANCE</span><h2>Your schedule</h2></div>
                  <div className="schedule-toolbar">
                    <button className="add-event-trigger" onClick={() => setAddEventOpen(true)}><Plus size={14}/> Add</button>
                    <button onClick={() => setScheduleView("mandatory")}>Full bracket <ChevronRight size={16}/></button>
                  </div>
                </div>
                <ScheduleTimeline cascade={cascade} customEvents={customEvents} onDelete={removeCustomEvent} />
              </article>
            </section>
          </>
        )}

        {activeTab === "schedule" && scheduleView === "mandatory" && (
          <section className="content-grid full">
            <article className="panel schedule-panel mandatory-panel">
              <div className="panel-head">
                <div><span className="section-kicker">SET BY COACH DANNY · CLUB CAPTAIN</span><h2>Full team schedule</h2></div>
                <button onClick={() => setScheduleView("mine")}><ArrowLeft size={16}/> My schedule</button>
              </div>
              <div className="mandatory-note"><Lock size={13}/> These are mandatory squad events set by your organizer — game times, team lunches, practice, and group calls. They can't be edited here.</div>
              <div className="timeline">
                {mandatorySchedule.map((item, i) => (
                  <div className={`timeline-row upcoming ${i === mandatorySchedule.length - 1 ? "last" : ""}`} key={item.title}>
                    <div className="time">{item.time}<span>{item.period}</span></div>
                    <div className="node"><item.icon size={13}/></div>
                    <div className="event">
                      <div><span className={`tag ${item.tagClass}`}>{item.tag}</span><strong>{item.title}</strong><small>{item.detail}</small></div>
                      <Lock size={13} className="mandatory-lock"/>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "map" && (
          <section className="content-grid full">
            <article className="panel map-panel">
              <div className="panel-head"><div><span className="section-kicker">NAVIGATION</span><h2>Find your way around</h2></div><span className="privacy"><ShieldCheck size={15}/> Expires Sunday</span></div>
              <SquadMap
                expanded
                onVenueSelect={focusPlace}
                directionsTo={directionsTarget}
                onDirections={setDirectionsTarget}
                onClearDirections={() => setDirectionsTarget(null)}
              />
              <div className="map-legend">
                {mapLegend.map((l) => (
                  <span className="map-legend-item" key={l.label}><i style={{ background: l.color }} />{l.label}</span>
                ))}
              </div>
              <div className="map-foot"><div className="avatar-stack"><span>SK</span><span>MR</span><span>JL</span><span>+7</span></div><p><strong>10 squad members</strong> are sharing nearby · tap the compass on the map to center on you, or tap a hotel/restaurant pin to see full details</p></div>
            </article>
          </section>
        )}

        {activeTab === "squad" && (
          <section className="content-grid">
            <div className="side-stack">
              <article className="panel chat-panel">
                <div className="panel-head">
                  <div><span className="section-kicker">{profile.squad.toUpperCase()}</span><h2>Squad chat</h2></div>
                  <button className="invite-trigger" onClick={() => setInviteOpen(true)}><UserPlus size={15}/> Invite</button>
                </div>
                <div className="chat-list" ref={chatListRef}>
                  {messages.map((m) => m.kind === "system" ? (
                    <div className="chat-system" key={m.id}>{m.text}</div>
                  ) : (
                    <div className={`chat-msg ${m.self ? "self" : ""}`} key={m.id}>
                      {!m.self && <div className="chat-avatar">{m.initials}</div>}
                      <div className="chat-bubble-wrap">
                        {!m.self && <span className="chat-author">{m.author}</span>}
                        <div className="chat-bubble">{m.text}</div>
                        <span className="chat-time">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chat-quick">
                  {quickReplies.map((q) => (
                    <button key={q} onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
                <form className="chat-form" onSubmit={handleChatSubmit}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message your squad…"
                    aria-label="Message your squad"
                  />
                  <button type="submit" disabled={!chatInput.trim()} aria-label="Send message"><Send size={16}/></button>
                </form>
              </article>

              <article className="panel feed-panel feed-panel-big">
                <div className="panel-head"><div><span className="section-kicker">HAPPENING NOW</span><h2>Live feed</h2></div><span className="live-label"><i/> LIVE</span></div>
                <FeedList />
              </article>

              <article className="panel digest-card">
                <div className="panel-head"><div><span className="section-kicker">END OF DAY</span><h2>AI digest</h2></div></div>
                <p className="digest-copy">Let GameDay AI summarize the day for your squad — final scores, tomorrow's first game, and any logistics reminders.</p>
                <button className="digest-btn" onClick={generateDigest} disabled={digestLoading}>
                  {digestLoading ? <Loader2 size={16} className="spin"/> : <Sparkles size={16}/>}
                  {digestLoading ? "Writing…" : "Generate today's digest"}
                </button>
                {digest && <p className="digest-text">{digest}</p>}
              </article>
            </div>

            <div className="side-stack">
              <article className="panel roster-panel">
                <div className="panel-head"><div><span className="section-kicker">ROSTER</span><h2>Squad members</h2></div><span className="live-label"><i/> {roster.filter(r => r.online).length} online</span></div>
                <div className="roster-list">
                  {roster.map((m) => (
                    <div className="roster-item" key={m.name}>
                      <div className="roster-avatar">{m.initials}<i className={m.online ? "on" : "off"} /></div>
                      <div className="roster-info"><strong>{m.name}</strong><span>{m.role}</span></div>
                      {m.medical && (
                        <button className="roster-medical-btn" onClick={() => setMedicalPlayer(m.name)} aria-label={`Medical info for ${m.name}`}>
                          <Cross size={14}/>
                        </button>
                      )}
                      <span className={`roster-status ${m.online ? "on" : "off"}`}>{m.online ? "Online" : "Offline"}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        )}

        {activeTab === "hotels" && (
          <section className="content-grid full">
            <article className="panel stay-eat-page">
              <div className="panel-head"><div><span className="section-kicker">STAY NEARBY</span><h2>Squad hotels</h2></div></div>
              <div className="stay-eat-cards">
                {hotels.map((h) => (
                  <div className={`stay-eat-card ${highlightPlace === h.id ? "highlight" : ""}`} key={h.id} data-place-id={h.id}>
                    <div className="stay-eat-card-head">
                      <div className="stay-eat-icon"><Hotel size={18}/></div>
                      <div><strong>{h.name}</strong><span>{h.distance} · {h.price}</span></div>
                      <span className="stay-eat-rating"><Star size={12} fill="currentColor"/> {h.rating}</span>
                    </div>
                    <p className="stay-eat-note">{h.squadNote}</p>
                    <div className="stay-eat-chips">
                      {h.amenities.map((a) => <span key={a}>{a}</span>)}
                    </div>
                    <div className="stay-eat-card-foot">
                      <span><Phone size={13}/> {h.phone}</span>
                      <button onClick={() => showDirections(h.id)}><Navigation size={13}/> Directions</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "restaurants" && (
          <section className="content-grid full">
            <article className="panel stay-eat-page">
              <div className="panel-head"><div><span className="section-kicker">EAT NEARBY</span><h2>Squad restaurants</h2></div></div>
              <div className="stay-eat-cards">
                {places.map((p) => (
                  <div className={`stay-eat-card ${highlightPlace === p.id ? "highlight" : ""}`} key={p.id} data-place-id={p.id}>
                    <div className="stay-eat-card-head">
                      <div className="stay-eat-icon"><p.icon size={18}/></div>
                      <div><strong>{p.name}</strong><span>{p.kind} · {p.distance}</span></div>
                      <span className="stay-eat-wait">{p.wait} wait</span>
                    </div>
                    <p className="stay-eat-note">{p.squadNote}</p>
                    <div className="stay-eat-chips">
                      <span>{p.hours}</span>
                      <span>{p.menuHighlight}</span>
                    </div>
                    <div className="stay-eat-card-foot">
                      <span><Phone size={13}/> {p.phone}</span>
                      <button onClick={() => showDirections(p.id)}><Navigation size={13}/> Directions</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </main>

      {toast && <div className="toast"><div><Bell size={19}/></div><p><strong>3 games updated</strong><span>OC Falcons notified · No alert spam</span></p><button onClick={() => setToast(false)}><X size={17}/></button></div>}

      {medicalPlayer && (() => {
        const m = roster.find((r) => r.name === medicalPlayer);
        if (!m?.medical) return null;
        return (
          <div className="modal-wrap" role="dialog" aria-modal="true" aria-label={`Emergency medical card for ${m.name}`}>
            <button className="modal-scrim" onClick={() => setMedicalPlayer(null)} aria-label="Close medical card"/>
            <div className="medical-card">
              <button className="modal-close" onClick={() => setMedicalPlayer(null)}><X size={20}/></button>
              <div className="medical-title"><div><Cross size={25}/></div><span>Emergency quick-access</span><h2>{m.name}</h2><p>{profile.squad} · {m.role}</p></div>
              <div className="medical-grid"><div><span>ALLERGIES</span><strong>{m.medical.allergies}</strong></div><div><span>EMERGENCY CONTACT</span><strong>{m.medical.emergencyContact}</strong></div><div><span>INSURANCE</span><strong>{m.medical.insurance}</strong></div><div><span>NOTES</span><strong>{m.medical.notes}</strong></div></div>
              <div className="secure-note"><ShieldCheck size={17}/><span>Parent-controlled and encrypted. Access is logged.</span></div>
              <button className="call-btn">Call emergency contact</button>
            </div>
          </div>
        );
      })()}

      {inviteOpen && <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Invite to squad">
        <button className="modal-scrim" onClick={() => setInviteOpen(false)} aria-label="Close invite panel"/>
        <div className="invite-card">
          <button className="modal-close" onClick={() => setInviteOpen(false)}><X size={20}/></button>
          <div className="invite-title"><div><UserPlus size={22}/></div><span>Grow your squad</span><h2>Invite to {profile.squad}</h2></div>
          <p className="invite-copy">Send teammates this link — opening it drops them straight into the join form with your code filled in.</p>
          <button className="invite-link-btn" onClick={copyInviteLink}>
            <Link2 size={16}/>
            <span className="invite-link-text">{inviteLink ?? "…"}</span>
            <span className="invite-link-action">{linkCopied ? "Copied!" : "Copy link"}</span>
          </button>
          <div className="invite-code-row">
            <span className="invite-code-label">Or share the code directly</span>
            <span className="invite-code-pill">{inviteCode ?? "…"}</span>
            <button className="invite-copy-btn" onClick={copyInviteCode}>
              <Copy size={15}/> {inviteCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <form className="invite-form" onSubmit={addInvite}>
            <input
              value={inviteNameInput}
              onChange={(e) => setInviteNameInput(e.target.value)}
              placeholder="Name or email to invite"
              aria-label="Name or email to invite"
            />
            <button type="submit" disabled={!inviteNameInput.trim()}>Send</button>
          </form>
          {pendingInvites.length > 0 && (
            <div className="invite-list">
              {pendingInvites.map((name, i) => (
                <div className="invite-list-item" key={`${name}-${i}`}>
                  <span>{name}</span>
                  <span className="invite-sent"><Check size={13}/> Invited</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>}

      {addEventOpen && <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Add to your schedule">
        <button className="modal-scrim" onClick={() => setAddEventOpen(false)} aria-label="Close"/>
        <div className="add-event-card">
          <button className="modal-close" onClick={() => setAddEventOpen(false)}><X size={20}/></button>
          <div className="add-event-title"><div><Plus size={20}/></div><span>Personal schedule</span><h2>Add to your schedule</h2></div>
          <form className="add-event-form" onSubmit={addCustomEvent}>
            <label>
              Title
              <input value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="Leave for airport" required/>
            </label>
            <div className="add-event-time-row">
              <label>
                Time
                <input value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} placeholder="4:15" required/>
              </label>
              <label>
                Period
                <select value={newEventPeriod} onChange={(e) => setNewEventPeriod(e.target.value)}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </label>
            </div>
            <label>
              Note (optional)
              <input value={newEventDetail} onChange={(e) => setNewEventDetail(e.target.value)} placeholder="Terminal 2 · Uber booked"/>
            </label>
            <button type="submit">Add to schedule</button>
          </form>
        </div>
      </div>}
    </div>
  );
}

function ScheduleTimeline({ cascade, customEvents, onDelete }: { cascade: boolean; customEvents: CustomEvent[]; onDelete: (id: number) => void }) {
  return (
    <div className="timeline">
      <div className="timeline-row complete">
        <div className="time">8:30<span>AM</span></div><div className="node"><Check size={13}/></div>
        <div className="event"><div><span className="tag game">GAME</span><strong>Pool Game 3</strong><small>Field 4 · Final</small></div><b className="score">8 <em>–</em> 3</b></div>
      </div>
      <div className="timeline-row current">
        <div className="time">11:00<span>AM</span></div><div className="node"><Utensils size={13}/></div>
        <div className="event"><div><span className="tag break">BREAK</span><strong>Team lunch</strong><small>Taco Mesa · Table for 12</small></div><button className="tiny-btn">View</button></div>
      </div>
      <div className={`timeline-row upcoming ${cascade ? "shifted" : ""}`}>
        <div className="time">{cascade ? "12:40" : "1:00"}<span>PM</span>{cascade && <del>1:00</del>}</div><div className="node"><Trophy size={13}/></div>
        <div className="event"><div><span className="tag game">GAME</span><strong>Semifinal vs. SD Waves</strong><small>Field 7 · Arrive 30 min early</small></div>{cascade && <span className="change-pill">–20 min</span>}</div>
      </div>
      <div className={`timeline-row upcoming ${cascade ? "shifted" : ""} ${customEvents.length === 0 ? "last" : ""}`}>
        <div className="time">{cascade ? "3:15" : "3:35"}<span>PM</span>{cascade && <del>3:35</del>}</div><div className="node"><Trophy size={13}/></div>
        <div className="event"><div><span className="tag possible">POSSIBLE</span><strong>Championship</strong><small>Stadium field · If advanced</small></div>{cascade && <span className="change-pill">–20 min</span>}</div>
      </div>
      {customEvents.map((ev, i) => (
        <div className={`timeline-row upcoming personal ${i === customEvents.length - 1 ? "last" : ""}`} key={ev.id}>
          <div className="time">{ev.time}<span>{ev.period}</span></div>
          <div className="node"><Sparkles size={13}/></div>
          <div className="event">
            <div><span className="tag personal">PERSONAL</span><strong>{ev.title}</strong>{ev.detail && <small>{ev.detail}</small>}</div>
            <button className="tiny-btn danger" onClick={() => onDelete(ev.id)} aria-label={`Remove ${ev.title}`}><X size={12}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedList() {
  return (
    <div className="feed-list">
      {feed.map((item) => <div className="feed-item" key={item.time}>
        <div className={`feed-icon ${item.tone}`}>{item.type === "Score" ? <Trophy size={16}/> : item.type === "Weather" ? <CloudSun size={17}/> : item.type === "Squad" ? <Users size={16}/> : <Clock3 size={16}/>}</div>
        <div><span>{item.type} · {item.time}</span><strong>{item.title}</strong><p>{item.detail}</p></div>
      </div>)}
    </div>
  );
}
