"use client";

import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CloudSun,
  Coffee,
  Cross,
  Hotel,
  Map,
  MapPin,
  Menu,
  Navigation,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Home", icon: Activity },
  { label: "Schedule", icon: CalendarDays },
  { label: "Live map", icon: Map },
  { label: "Squad", icon: Users },
];

const feed = [
  { time: "10:42 AM", type: "Schedule", title: "Semifinal moved up", detail: "Field 7 · New start 12:40 PM", tone: "orange" },
  { time: "10:31 AM", type: "Score", title: "Falcons win 8–3", detail: "Final · Pool Game 3", tone: "blue" },
  { time: "10:18 AM", type: "Squad", title: "Maya shared a location", detail: "Near the north entrance", tone: "green" },
  { time: "9:54 AM", type: "Weather", title: "Clear through 3 PM", detail: "72° · Light wind", tone: "purple" },
];

const places = [
  { name: "Taco Mesa", kind: "Lunch · Mexican", distance: "0.4 mi", wait: "8 min", crowd: 42, icon: Utensils, color: "#f97316" },
  { name: "Fieldhouse Café", kind: "Coffee · Sandwiches", distance: "0.7 mi", wait: "4 min", crowd: 18, icon: Coffee, color: "#14b8a6" },
  { name: "Parkside Grill", kind: "American · Patio", distance: "1.1 mi", wait: "25 min", crowd: 86, icon: Utensils, color: "#ef4444" },
];

export default function Home() {
  const [cascade, setCascade] = useState(false);
  const [sharing, setSharing] = useState(true);
  const [medicalOpen, setMedicalOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState(false);

  function runCascade() {
    setCascade(true);
    setToast(true);
    window.setTimeout(() => setToast(false), 4200);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Trophy size={20} strokeWidth={2.5} /></div>
          <span>GameDay<span>Hub</span></span>
        </div>
        <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={20}/></button>
        <nav>
          <p className="nav-label">Tournament</p>
          {nav.map(({ label, icon: Icon }, i) => (
            <button key={label} className={i === 0 ? "active" : ""} onClick={() => setMobileNav(false)}>
              <Icon size={19} /> {label}{label === "Schedule" && <span className="nav-badge">3</span>}
            </button>
          ))}
          <p className="nav-label nav-spaced">Your squad</p>
          <button><Radio size={19} /> Live feed <span className="live-dot" /></button>
          <button onClick={() => setMedicalOpen(true)}><Cross size={19} /> Medical card</button>
        </nav>
        <div className="squad-mini">
          <div className="squad-emblem">OF</div>
          <div><strong>OC Falcons 14U</strong><span>18 members online</span></div>
          <ChevronRight size={17} />
        </div>
        <div className="profile">
          <div className="avatar">SK</div>
          <div><strong>Sahil Das</strong><span>Team parent</span></div>
          <button aria-label="Notifications"><Bell size={18}/><i /></button>
        </div>
      </aside>

      {mobileNav && <button className="nav-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}

      <main>
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={22}/></button>
          <div>
            <p className="eyebrow">WEST COAST CLASSIC · DAY 2 OF 3</p>
            <h1>Good morning, Sahil <span>👋</span></h1>
          </div>
          <div className="topbar-tools">
            <div className="weather"><CloudSun size={22}/><div><strong>72°</strong><span>Clear skies</span></div></div>
            <button className={`sharing ${sharing ? "on" : ""}`} onClick={() => setSharing(!sharing)}>
              <Navigation size={16} fill={sharing ? "currentColor" : "none"}/>
              <span>{sharing ? "Location on" : "Location off"}</span><i />
            </button>
          </div>
        </header>

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
              <button><Navigation size={15}/> Directions</button>
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

        <section className="content-grid">
          <article className="panel schedule-panel">
            <div className="panel-head">
              <div><span className="section-kicker">TODAY AT A GLANCE</span><h2>Your schedule</h2></div>
              <button>Full bracket <ChevronRight size={16}/></button>
            </div>
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
              <div className={`timeline-row upcoming last ${cascade ? "shifted" : ""}`}>
                <div className="time">{cascade ? "3:15" : "3:35"}<span>PM</span>{cascade && <del>3:35</del>}</div><div className="node"><Trophy size={13}/></div>
                <div className="event"><div><span className="tag possible">POSSIBLE</span><strong>Championship</strong><small>Stadium field · If advanced</small></div>{cascade && <span className="change-pill">–20 min</span>}</div>
              </div>
            </div>
          </article>

          <article className="panel feed-panel">
            <div className="panel-head"><div><span className="section-kicker">RIGHT NOW</span><h2>Live event feed</h2></div><span className="live-label"><i/> LIVE</span></div>
            <div className="feed-list">
              {feed.map((item) => <div className="feed-item" key={item.time}>
                <div className={`feed-icon ${item.tone}`}>{item.type === "Score" ? <Trophy size={16}/> : item.type === "Weather" ? <CloudSun size={17}/> : item.type === "Squad" ? <Users size={16}/> : <Clock3 size={16}/>}</div>
                <div><span>{item.type} · {item.time}</span><strong>{item.title}</strong><p>{item.detail}</p></div>
              </div>)}
            </div>
            <button className="feed-more">View all updates <ChevronRight size={16}/></button>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="panel map-panel">
            <div className="panel-head"><div><span className="section-kicker">SQUAD MAP</span><h2>Your people, nearby</h2></div><span className="privacy"><ShieldCheck size={15}/> Expires Sunday</span></div>
            <div className="map-canvas">
              <div className="road road-a"/><div className="road road-b"/><div className="field field-a"><span>FIELD 4</span></div><div className="field field-b"><span>FIELD 7</span></div>
              <div className="map-label hotel-label"><Hotel size={13}/> Hampton Inn</div><div className="map-label food-label"><Utensils size={13}/> Taco Mesa</div>
              <div className="person p1"><span>SK</span><i>Sahil</i></div><div className="person p2"><span>MR</span><i>Maya</i></div><div className="person p3"><span>JL</span><i>Jordan</i></div><div className="person p4"><span>+7</span></div>
              <button className="locate" aria-label="Center map"><Navigation size={17}/></button>
            </div>
            <div className="map-foot"><div className="avatar-stack"><span>SK</span><span>MR</span><span>JL</span><span>+7</span></div><p><strong>10 squad members</strong> are sharing nearby</p><button>Open live map</button></div>
          </article>

          <article className="panel nearby-panel">
            <div className="panel-head"><div><span className="section-kicker">NEARBY</span><h2>Beat the crowd</h2></div><button>See all</button></div>
            <div className="smart-note"><Sparkles size={17}/><span><strong>Smart picks</strong> use live squad traffic to steer you away from tournament rushes.</span></div>
            <div className="places">
              {places.map(({ name, kind, distance, wait, crowd, icon: Icon, color }) => <div className="place" key={name}>
                <div className="place-icon" style={{color, background: `${color}16`}}><Icon size={19}/></div>
                <div className="place-info"><strong>{name}</strong><span>{kind} · {distance}</span></div>
                <div className="crowd"><div><span>Squad traffic</span><b style={{color: crowd > 70 ? "#ef4444" : crowd < 30 ? "#0f9f75" : "#e98320"}}>{crowd > 70 ? "Busy" : crowd < 30 ? "Quiet" : "Moderate"}</b></div><div className="meter"><i style={{width: `${crowd}%`, background: crowd > 70 ? "#ef4444" : crowd < 30 ? "#10b981" : "#f59e0b"}}/></div><small>{wait} wait</small></div>
              </div>)}
            </div>
          </article>
        </section>
      </main>

      {toast && <div className="toast"><div><Bell size={19}/></div><p><strong>3 games updated</strong><span>OC Falcons notified · No alert spam</span></p><button onClick={() => setToast(false)}><X size={17}/></button></div>}

      {medicalOpen && <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Emergency medical card">
        <button className="modal-scrim" onClick={() => setMedicalOpen(false)} aria-label="Close medical card"/>
        <div className="medical-card">
          <button className="modal-close" onClick={() => setMedicalOpen(false)}><X size={20}/></button>
          <div className="medical-title"><div><Cross size={25}/></div><span>Emergency quick-access</span><h2>Alex Das</h2><p>OC Falcons 14U · #12</p></div>
          <div className="medical-grid"><div><span>ALLERGIES</span><strong>Peanuts · Penicillin</strong></div><div><span>EMERGENCY CONTACT</span><strong>Sahil Das · (714) 555-0142</strong></div><div><span>INSURANCE</span><strong>Blue Shield · •••• 2841</strong></div><div><span>NOTES</span><strong>EpiPen in red equipment bag</strong></div></div>
          <div className="secure-note"><ShieldCheck size={17}/><span>Parent-controlled and encrypted. Access is logged.</span></div>
          <button className="call-btn">Call emergency contact</button>
        </div>
      </div>}
    </div>
  );
}
