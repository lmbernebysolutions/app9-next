"use client";

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  User, Shield, Heart, Brain, 
  Activity, BookOpen, ChevronRight, ChevronLeft, 
  Anchor, Zap, Users, AlertTriangle, 
  Search, Menu, X, Eye, 
  MessageCircle, Hand, BatteryCharging,
  Glasses, ArrowRightLeft, Volume2, Scale,
  Lock, Unlock, Thermometer, Layers,
  CheckCircle, FileDown
} from 'lucide-react';

const ACCESS_PASSWORD = 'Vortrag2025!';
const TALK_TOPIC = "Professsionelle Haltung im Umgang mit aggresivem oder grenzverletzendem Verhalten";

// --- STYLES & ANIMATIONS (10s Loops - Logisch & Ruhig) ---
const styles = `
  /* Schweben (für Elemente, die 'da sind', z.B. Gedanken) */
  @keyframes float-10s {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  /* Pulsieren (für organische Prozesse: Herzschlag, Leben, Aufmerksamkeit) */
  @keyframes pulse-10s {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }

  /* Wippen (für die Waage - realistisches Pendeln) */
  @keyframes swing-10s {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    75% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
  }

  /* Sanftes Gleiten (für Prozesse / Zeitachsen) */
  @keyframes slide-10s {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(15px); }
  }

  /* Füllen (für Batterien / Brückenaufbau) */
  @keyframes fill-10s {
    0% { width: 0%; opacity: 0.5; }
    50% { width: 100%; opacity: 1; }
    100% { width: 100%; opacity: 1; }
  }
  /* Batterie-Füllung (vertikal von unten) */
  @keyframes battery-fill-10s {
    0% { height: 0%; opacity: 0.4; }
    40% { height: 100%; opacity: 1; }
    100% { height: 100%; opacity: 1; }
  }
  
  /* Scannen (für die Brille / Analyse) */
  @keyframes scan-10s {
    0%, 100% { top: 0%; opacity: 0; }
    10% { opacity: 1; }
    50% { top: 100%; opacity: 1; }
    90% { opacity: 1; }
  }

  /* Leuchten (für Erkenntnis / Highlights) */
  @keyframes glow-10s {
    0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
    50% { filter: drop-shadow(0 0 25px rgba(255,255,255,0.8)); }
  }

  /* Umlauf (für Intro-Highlights) */
  @keyframes orbit-10s {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Sanftes Schimmern */
  @keyframes shimmer-10s {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 0.75; }
  }

  /* Utility Classes */
  .animate-float-10s { animation: float-10s 10s ease-in-out infinite; }
  .animate-pulse-10s { animation: pulse-10s 10s ease-in-out infinite; }
  .animate-swing-10s { animation: swing-10s 10s ease-in-out infinite; transform-origin: center; }
  .animate-slide-10s { animation: slide-10s 10s ease-in-out infinite; }
  .animate-fill-10s { animation: fill-10s 10s ease-in-out infinite; }
  .animate-battery-fill-10s { animation: battery-fill-10s 10s ease-in-out infinite; }
  .animate-scan-10s { animation: scan-10s 10s linear infinite; }
  .animate-glow-10s { animation: glow-10s 10s ease-in-out infinite; }
  .animate-orbit-10s { animation: orbit-10s 10s linear infinite; }
  .animate-shimmer-10s { animation: shimmer-10s 10s ease-in-out infinite; }
`;

const TEAM_MEMBERS = ["Laura", "Liliane", "Gregor", "Lennard"];

// --- DATENBASIS ---

const presentationData = [
  {
    id: "intro",
    speaker: "Alle",
    color: "bg-slate-900",
    text: "text-white",
    icon: <Users size={40} />,
    title: TALK_TOPIC,
    subtitle: "",
    slides: [
      {
        headline: TALK_TOPIC,
        sub: TALK_TOPIC,
        bullets: [
          "Nicht nur Technik, sondern Haltung.",
          "Sicherheit für Fachkräfte & Jugendliche.",
          "Vom 'Reagieren' zum 'Agieren'."
        ],
        interactive: "intro-cover"
      }
    ]
  },
  {
    id: "part-a",
    speaker: "Laura",
    topic: "Theorie & Rahmen",
    color: "bg-blue-600",
    text: "text-blue-50",
    icon: <BookOpen size={32} />,
    slides: [
      {
        headline: "Was ist Haltung?",
        sub: "Abgrenzung zur Methode",
        bullets: [
          "Innere Grundorientierung (Werte + Wissen).",
          "Zeigt sich besonders unter Stress.",
          "Kern: Trennung von Person & Verhalten."
        ],
        interactive: "iceberg", 
        quote: "„Ich sehe dich als Mensch (Person), aber ich stoppe dein Handeln (Verhalten).“"
      },
      {
        headline: "Formen der Aggression",
        sub: "Ein Hilfeschrei in vielen Formen",
        bullets: [
          "Verbal: Beleidigungen, Drohungen.",
          "Nonverbal: Körpersprache, Sachbeschädigung.",
          "Selbstverletzung: Spannungsregulation (kein 'Angeben')."
        ],
        interactive: "aggression-types"
      },
      {
        headline: "Warum tun sie das?",
        sub: "Theoretische Erklärungsansätze",
        bullets: [
          "Bindungstheorie: Aggression als Kontaktversuch.",
          "Systemisch: Symptomträger für das Familiensystem.",
          "Arousal: Das Gehirn im Alarmzustand (Kontrollverlust)."
        ],
        interactive: "theory-grid"
      }
    ],
    wiki: `
      1. Begriffsklärung: Professionelle Haltung beschreibt eine relativ stabile innere Orientierung, die Denken, Fühlen und Handeln im beruflichen Kontext prägt. Sie verbindet Werte, Ethik, Menschenbild und fachliche Annahmen als Leitlinie in unsicheren Konfliktsituationen.
      2. Formen: Aggression zeigt sich verbal (Beschimpfung, Drohung), nonverbal (bedrohliche Körpersprache, Distanzverletzung, Sachbeschädigung) und selbstverletzend. Selbstverletzung dient häufig Spannungsregulation, Emotionskontrolle und dem Versuch, Kontrolle zurückzugewinnen.
      3. Theorie:
         - Bindungstheorie: Unsichere oder desorganisierte Bindung erschwert Emotionsregulation; Aggression kann als Bindungssignal verstanden werden.
         - Systemisch: Verhalten ist ein sinnvoller Ausdruck im sozialen System und oft ein Lösungsversuch bei Loyalitätskonflikten.
         - Stress/Arousal: Hohe innere Erregung führt zu Alarmmodus und Kontrollverlust; Sprache und Einsicht sind dann kaum möglich.
    `
  },
  {
    id: "part-b",
    speaker: "Liliane",
    topic: "Sicherheit & Deeskalation",
    color: "bg-amber-600",
    text: "text-amber-50",
    icon: <Shield size={32} />,
    slides: [
      {
        headline: "Sicherheit & Körpersprache",
        sub: "Ruhe wirkt ansteckend",
        bullets: [
          "Eigenschutz ermöglicht erst Hilfe (keine 'Helden').",
          "Körpersprache: Offene Haltung, langsame Bewegungen.",
          "Abstand halten: Bedrängung vermeiden."
        ],
        interactive: "stop-sign"
      },
      {
        headline: "Deeskalation & Modelle",
        sub: "Stress reduzieren statt Kontrolle erzwingen",
        bullets: [
          "Low Arousal: Reize minimieren, leise sprechen.",
          "Thomas Gordon: Aktives Zuhören & Ich-Botschaften.",
          "Ziel: Kind gewinnt Selbstkontrolle zurück."
        ],
        interactive: "volume-control"
      },
      {
        headline: "Grenzen vs. Bestrafung",
        sub: "Schutz statt Machtkampf",
        bullets: [
          "Grenzen geben Orientierung und Schutz.",
          "Bestrafung ist Demütigung (Beziehungsabbruch).",
          "Konsequenz: Logisch, erklärt & gemeinsam (Lernchance)."
        ],
        interactive: "intervention-scale"
      }
    ],
    wiki: `
      1. Sicherheit & Präsenz: Deeskalation beginnt bei der Haltung. Eigenschutz ist Voraussetzung. Ruhige, verlangsamte Bewegungen und dosierter Blickkontakt signalisieren Sicherheit, nicht Bedrohung.
      2. Modelle:
         - Low Arousal (McDonnell): Stress reduzieren, Reize minimieren.
         - Thomas Gordon: Ich-Botschaften senden ("Ich merke..."), aktives Zuhören.
      3. Grenzsetzung:
         - Grenzen = Schutz & Orientierung (wertschätzend).
         - Strafe = Machtinstrument & Demütigung.
         - Konsequenzen müssen logisch sein (z.B. Aufräumen nach Werfen) und die Beziehung erhalten.
    `
  },
  {
    id: "part-c",
    speaker: "Gregor",
    topic: "Beziehung & Wertschätzung",
    color: "bg-emerald-600",
    text: "text-emerald-50",
    icon: <Heart size={32} />,
    slides: [
      {
        headline: "Die Haltung nach Rogers",
        sub: "Das Fundament der Beziehung",
        bullets: [
          "Empathie: Fühlen, was du fühlst.",
          "Akzeptanz: Dich annehmen (trotz Verhalten).",
          "Kongruenz: Echt sein (nichts vorspielen)."
        ],
        interactive: "rogers-triangle"
      },
      {
        headline: "Trauma & Scham",
        sub: "Würde bewahren",
        bullets: [
          "Trauma-Brille: Aggression = Angst/Ohnmacht.",
          "Schamsensibel: Kritik ohne Bloßstellung.",
          "Botschaft: „Du bist wertvoll, auch wenn es knallt.“"
        ],
        interactive: "trauma-glasses"
      },
      {
        headline: "Die Brücke zurück",
        sub: "Nachbereitung & Wiederannäherung",
        bullets: [
          "Wichtigste Phase: Die Rückkehr in die Beziehung.",
          "Keine Rache, keine Nachtragendheit.",
          "Konflikt als Chance für Entwicklung nutzen."
        ],
        interactive: "bridge-repair"
      }
    ],
    wiki: `
      1. Carl Rogers: Die drei Basisvariablen (Empathie, Akzeptanz, Kongruenz) sind in Krisen am schwersten, aber am wichtigsten.
      2. Schamsensibilität: Viele aggressive Jugendliche schämen sich schnell. Beschämung (z.B. öffentliches Zurechtweisen) führt zu neuer Aggression.
      3. Wiederannäherung: Nach dem Konflikt muss die Fachkraft aktiv das Angebot zur Beziehung machen. Das zeigt: "Die Beziehung hält das aus."
    `
  },
  {
    id: "part-d",
    speaker: "Lennard",
    topic: "Selbstreflexion",
    color: "bg-indigo-600",
    text: "text-indigo-50",
    icon: <Brain size={32} />,
    slides: [
      {
        headline: "Das Werkzeug Mensch",
        sub: "Selbst vs. Rolle",
        bullets: [
          "Wir sind subjektiv (Biografie, Werte).",
          "Gefahr: Persönliche Kränkung (Das 'Selbst').",
          "Ziel: Zurück in die professionelle 'Rolle'.",
          "In der Reflexion Selbst und Rolle bewusst auseinanderhalten (Ansatz u. a. bei Dahrendorf)."
        ],
        interactive: "role-switch"
      },
      {
        headline: "Trigger & Macht",
        sub: "Vom Ohnmachtsgefühl zum Machtmissbrauch",
        bullets: [
          "Trigger: Der 'rote Knopf' (Grinsen, Tonfall).",
          "Körper reagiert vor dem Kopf (Reptiliengehirn).",
          "Gefahr: Aus Ohnmacht wird autoritäre Gewalt."
        ],
        interactive: "trigger-pulse"
      },
      {
        headline: "Die Fallen der Psyche",
        sub: "Handlungsmodelle n. Maja Heiner",
        bullets: [
          "Dominanz: Härte, Rationalisierung ('Der braucht das').",
          "Aufopferung: Keine Grenzen, Selbstaufgabe.",
          "Ziel: Passung & Stopp der Re-Inszenierung!"
        ],
        interactive: "heiner-slider"
      },
      {
        headline: "Psychohygiene",
        sub: "Grenzen als Qualität",
        bullets: [
          "Dreifacher Klärungsprozess: 'Bin ich fähig?'",
          "Reflecting Team & Supervision nutzen.",
          "Nur wer stabil ist, kann Halt geben."
        ],
        interactive: "hygiene-battery"
      }
    ],
    wiki: `
      Person D (Blick nach Innen):
      1. Selbst vs. Rolle: Konflikte entstehen oft, wenn wir uns privat angegriffen fühlen. Reflexion trennt das wieder.
      2. Trigger: Individuelle Auslöser für Stress. Führen oft zu "Dominanzverhalten" (Maja Heiner) oder Machtmissbrauch, um eigene Ohnmacht nicht zu spüren.
      3. Re-Inszenierung: Wir dürfen nicht in die Rolle fallen, die der Jugendliche erwartet (der strafende Erwachsene), sondern müssen eine korrigierende Erfahrung bieten (Passungsmodell).
      4. Hygiene: Selbstschutz ist ethische Pflicht (Nicht schaden).
    `
  },
  {
    id: "outro",
    speaker: "Alle",
    topic: "Abschluss",
    color: "bg-slate-900",
    text: "text-white",
    icon: <CheckCircle size={32} />,
    slides: [
      {
        headline: "Fazit: Haltung trägt.",
        sub: "Die Symbiose der Professionalität",
        bullets: [
          "Sicherheit gibt den Rahmen.",
          "Beziehung gibt den Halt.",
          "Reflexion sichert die Qualität."
        ],
        interactive: "outro-summary",
        quote: "„Professionelle Haltung ist kein Zustand, sondern ein Prozess.“"
      },
      {
        headline: "Danke für eure Aufmerksamkeit",
        sub: "Alle Inhalte und Quellen findet ihr in der Wiki- & Quellen-Ansicht",
        bullets: [],
        interactive: "thanks-cover"
      }
    ],
    wiki: `
      Zusammenfassung:
      Professionelle Haltung im Umgang mit Aggression erfordert das Zusammenspiel aller drei Ebenen:
      1. Handlungssicherheit (Deeskalation/Schutz)
      2. Emotionale Zuwendung (Wertschätzung/Beziehung)
      3. Innere Klarheit (Selbstreflexion/Psychohygiene)
      Nur gemeinsam ermöglichen sie eine Pädagogik, die auch in Krisen trägt.
    `
  }
];

const apaReferences = [
  "American Psychological Association. (2020). Publication manual of the American Psychological Association (7th ed.). Author.",
  "Bierhoff, H.-W., & Wagner, U. (1998). Aggression und Gewalt in der Gesellschaft. Westdeutscher Verlag.",
  "Bock, T., & Roh, D. (2017). Professionelle Beziehungsgestaltung in der Sozialen Arbeit. Beltz Juventa.",
  "Bock, T., & Seithe, M. (2017). Traumapadagogik in der Praxis: Grundlagen und Methoden fur die Arbeit mit Kindern und Jugendlichen. Beltz Juventa.",
  "Bohnisch, L. (2010). Lebensbewaltigung: Ein sozialpadagogisches Konzept. Beltz Juventa.",
  "Bowlby, J. (1988). A secure base: Parent-child attachment and healthy human development. Basic Books.",
  "Brisch, K. H. (2011). Bindungsstorungen: Von der Bindungstheorie zur Therapie (4. Aufl.). Klett-Cotta.",
  "Dupuis, M., Hahn, K., & Wigger, L. (2017). Ethos in der Padagogik: Eine professionelle Haltung reflektieren und ausbilden. Verlag Barbara Budrich.",
  "Goldbeck, L., & Ellerkamp, T. (2012). Psychotraumatologie des Kindes- und Jugendalters. In L. Goldbeck (Hrsg.), Psychische Storungen im Kindes- und Jugendalter (S. 205-232). Kohlhammer.",
  "Gordon, T. (1970). Parent effectiveness training: The no-lose program for raising responsible children. Wyden.",
  "Gordon, T. (2004). Familienkonferenz: Die Losung von Konflikten zwischen Eltern und Kind (uberarb. Neuausg.). Heyne.",
  "Heiner, M. (2004). Soziale Arbeit als Beruf. Juventa.",
  "Heiner, M. (2006). Methodisches Handeln in der Sozialen Arbeit. In H.-U. Otto & H. Thiersch (Hrsg.), Handbuch Soziale Arbeit (3. Aufl., S. 896-907). Luchterhand.",
  "Hilgers, M. (2010). Scham: Gesichter eines Affekts. Vandenhoeck & Ruprecht.",
  "Ich-Botschaft. (2025, January 20). In Wikipedia. https://de.wikipedia.org/wiki/Ich-Botschaft",
  "Kecojevic, K. (2023). Unsichere Bindung in der Adoleszenz (Dissertation). Ludwig-Maximilians-Universitat Munchen. https://edoc.ub.uni-muenchen.de/34494/1/Kecojevic_Katarina.pdf",
  "Klonsky, E. D. (2007). The functions of deliberate self-injury: A review of the evidence. Clinical Psychology Review, 27(2), 226-239.",
  "Kuhne, A. (2017). Theoretische Reflexionen zur professionellen Haltung in der Sozialen Arbeit mit Gefluchteten. Springer VS.",
  "LWL-Klinik Paderborn. (n.d.). Borderline, selbstverletzendes Verhalten (SVV) & Impulsstorungen. https://www.lwl-klinik-paderborn.de/de/fuer-patienten-angehoerige/informationen-zu-erkrankungen-erwachsenenpsychiatrie/borderline-selbstverletzendes-verhalten-svv-impulsstoerungen/",
  "McDonnell, A. A. (2010). Managing aggressive behaviour in care settings: Understanding the Low Arousal Approach. Wiley-Blackwell.",
  "McDonnell, A. A. (2019). The Low Arousal Approach: Restrictive practices, behaviour and wellbeing. Learning Disability Practice, 22(2), 26-31.",
  "Muller, W. (2012). Burnout-Pravention in der Sozialen Arbeit. Kohlhammer.",
  "Reimann, G. (2013). Professionelles Handeln und Selbstreflexion in der Sozialen Arbeit. In G. Reimann-Bernhardt (Hrsg.), Reflexive Soziale Arbeit (S. 15-32). VS Verlag.",
  "Ritscher, W. (2008). Rezension zu \"Soziale Arbeit als Beruf\" von Maja Heiner. socialnet Rezensionen. https://www.socialnet.de/rezensionen/6613.php",
  "Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2), 95-103.",
  "Rogers, C. R. (1961). On becoming a person: A therapist's view of psychotherapy. Houghton Mifflin.",
  "Sarafoff, A., & Wesche, R. (2011). Selbstverletzendes Verhalten: Grundlagen, Diagnostik und Therapie (2. Aufl.). Beltz.",
  "Scheff, T. J. (2003). Shame in self and society. Symbolic Interaction, 26(2), 239-262.",
  "Silkenbeumer, M. (2000). Aggression und Gewalt im Kindes- und Jugendalter. Juventa.",
  "Studio 3 Training Systems. (2016). What is the Low Arousal Approach? https://www.studio3.org/training-and-coaching/low-arousal-training",
  "Tausch, R., & Tausch, A.-M. (2017). Erziehungspsychologie: Begegnung von Person zu Person (14. Aufl.). Beltz.",
  "Walsh, F. (2015). Strengthening family resilience (3rd ed.). Guilford Press.",
  "Yerkes, R. M., & Dodson, J. D. (1908). The relation of strength of stimulus to rapidity of habit-formation. Journal of Comparative Neurology and Psychology, 18, 459-482.",
  "Gordon-Modell. (2025, January 15). In Wikipedia. https://de.wikipedia.org/wiki/Gordon-Modell"
];

const sectionReferences = {
  "part-a": [
    "Dupuis, M., Hahn, K., & Wigger, L. (2017). Ethos in der Padagogik: Eine professionelle Haltung reflektieren und ausbilden. Verlag Barbara Budrich.",
    "Kuhne, A. (2017). Theoretische Reflexionen zur professionellen Haltung in der Sozialen Arbeit mit Gefluchteten. Springer VS.",
    "Bowlby, J. (1988). A secure base: Parent-child attachment and healthy human development. Basic Books.",
    "Brisch, K. H. (2011). Bindungsstorungen: Von der Bindungstheorie zur Therapie (4. Aufl.). Klett-Cotta.",
    "Kecojevic, K. (2023). Unsichere Bindung in der Adoleszenz (Dissertation). Ludwig-Maximilians-Universitat Munchen. https://edoc.ub.uni-muenchen.de/34494/1/Kecojevic_Katarina.pdf",
    "Yerkes, R. M., & Dodson, J. D. (1908). The relation of strength of stimulus to rapidity of habit-formation. Journal of Comparative Neurology and Psychology, 18, 459-482."
  ],
  "part-b": [
    "McDonnell, A. A. (2010). Managing aggressive behaviour in care settings: Understanding the Low Arousal Approach. Wiley-Blackwell.",
    "McDonnell, A. A. (2019). The Low Arousal Approach: Restrictive practices, behaviour and wellbeing. Learning Disability Practice, 22(2), 26-31.",
    "Gordon, T. (1970). Parent effectiveness training: The no-lose program for raising responsible children. Wyden.",
    "Gordon, T. (2004). Familienkonferenz: Die Losung von Konflikten zwischen Eltern und Kind (uberarb. Neuausg.). Heyne.",
    "Bohnisch, L. (2010). Lebensbewaltigung: Ein sozialpadagogisches Konzept. Beltz Juventa."
  ],
  "part-c": [
    "Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2), 95-103.",
    "Rogers, C. R. (1961). On becoming a person: A therapist's view of psychotherapy. Houghton Mifflin.",
    "Scheff, T. J. (2003). Shame in self and society. Symbolic Interaction, 26(2), 239-262.",
    "Hilgers, M. (2010). Scham: Gesichter eines Affekts. Vandenhoeck & Ruprecht.",
    "Bock, T., & Seithe, M. (2017). Traumapadagogik in der Praxis: Grundlagen und Methoden fur die Arbeit mit Kindern und Jugendlichen. Beltz Juventa."
  ],
  "part-d": [
    "Heiner, M. (2004). Soziale Arbeit als Beruf. Juventa.",
    "Heiner, M. (2006). Methodisches Handeln in der Sozialen Arbeit. In H.-U. Otto & H. Thiersch (Hrsg.), Handbuch Soziale Arbeit (3. Aufl., S. 896-907). Luchterhand.",
    "Reimann, G. (2013). Professionelles Handeln und Selbstreflexion in der Sozialen Arbeit. In G. Reimann-Bernhardt (Hrsg.), Reflexive Soziale Arbeit (S. 15-32). VS Verlag.",
    "Muller, W. (2012). Burnout-Pravention in der Sozialen Arbeit. Kohlhammer."
  ],
  outro: [
    "Dupuis, M., Hahn, K., & Wigger, L. (2017). Ethos in der Padagogik: Eine professionelle Haltung reflektieren und ausbilden. Verlag Barbara Budrich.",
    "Bock, T., & Roh, D. (2017). Professionelle Beziehungsgestaltung in der Sozialen Arbeit. Beltz Juventa."
  ]
};

// --- INTERAKTIVE KOMPONENTEN (Optimierte Animationen) ---

const IntroCover = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="relative w-80 h-80 mb-8 animate-float-10s">
      <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse-10s"></div>
      <div className="absolute inset-8 bg-emerald-500 rounded-full opacity-20 animate-pulse-10s" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-16 bg-indigo-500 rounded-full opacity-20 animate-pulse-10s" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-0 rounded-full border border-white/20 animate-shimmer-10s motion-reduce:animate-none"></div>
      <div className="absolute inset-0 animate-orbit-10s motion-reduce:animate-none">
        <span className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.8)]"></span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-blue-200/90 shadow-[0_0_12px_rgba(147,197,253,0.8)]"></span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Anchor size={120} className="text-white drop-shadow-2xl animate-glow-10s" />
      </div>
    </div>
    <div className="text-xl font-light text-slate-300 bg-black/20 px-6 py-3 rounded-full border border-white/10">
      Start mit [Pfeiltasten] oder [Leertaste]
    </div>
  </div>
);

const ThanksCover = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="relative w-80 h-80 mb-8 animate-float-10s">
      <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-pulse-10s"></div>
      <div className="absolute inset-8 bg-emerald-500 rounded-full opacity-20 animate-pulse-10s" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-16 bg-sky-500 rounded-full opacity-20 animate-pulse-10s" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-0 rounded-full border border-white/20 animate-shimmer-10s"></div>
      <div className="absolute inset-0 animate-orbit-10s">
        <span className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.8)]"></span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-emerald-200/90 shadow-[0_0_12px_rgba(110,231,183,0.8)]"></span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <BookOpen size={112} className="text-white drop-shadow-2xl animate-glow-10s" />
      </div>
    </div>
    <div className="text-lg md:text-xl font-light text-slate-200 bg-black/25 px-6 py-3 rounded-full border border-white/10">
      Weitere Infos: Wiki & Quellen
    </div>
  </div>
);

// A1: Eisberg (Logisch: Unten größer als oben)
const IcebergModel = () => (
  <div className="relative w-full h-80 bg-sky-900/30 rounded-3xl overflow-hidden border border-sky-500/30 flex flex-col items-center justify-center animate-glow-10s">
    <div className="absolute top-1/3 w-full h-1 bg-sky-400/50 dashed animate-pulse-10s"></div>
    <div className="absolute top-1/3 w-full h-full bg-sky-600/10 backdrop-blur-sm"></div>
    
    <div className="z-10 mb-12 animate-float-10s">
       <div className="text-white font-black text-4xl drop-shadow-lg tracking-wider">VERHALTEN</div>
       <div className="text-sky-200 text-sm text-center font-bold opacity-80">(Sichtbar)</div>
    </div>
    
    <div className="z-10 mt-8 animate-float-10s" style={{animationDelay: '1s'}}>
       <div className="text-sky-100 font-bold text-2xl drop-shadow-md opacity-70">BEDÜRFNIS</div>
       <div className="text-sky-100 font-bold text-2xl drop-shadow-md opacity-50">GEFÜHL</div>
       <div className="text-sky-100 font-bold text-2xl drop-shadow-md opacity-30">BIOGRAFIE</div>
    </div>
  </div>
);

// A2: Aggressionsformen (Klarere Icons)
const AggressionTypes = () => (
  <div className="flex justify-around items-center w-full h-80">
    <div className="flex flex-col items-center gap-6 animate-float-10s">
      <div className="p-6 bg-red-500/20 rounded-2xl border-2 border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.3)]">
        <MessageCircle size={56} className="text-red-100" />
      </div>
      <span className="text-white font-bold text-2xl">Verbal</span>
    </div>
    <div className="flex flex-col items-center gap-6 animate-float-10s" style={{animationDelay: '1.5s'}}>
      <div className="p-6 bg-orange-500/20 rounded-2xl border-2 border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3)]">
        <Hand size={56} className="text-orange-100" />
      </div>
      <span className="text-white font-bold text-2xl">Nonverbal</span>
    </div>
    <div className="flex flex-col items-center gap-6 animate-float-10s" style={{animationDelay: '3s'}}>
      <div className="p-6 bg-purple-500/20 rounded-2xl border-2 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)]">
        <AlertTriangle size={56} className="text-purple-100" />
      </div>
      <span className="text-white font-bold text-2xl">Autoaggressiv</span>
    </div>
  </div>
);

// A3: Theorien (Statischer, seriöser)
const TheoryGrid = () => (
  <div className="flex flex-col gap-6 w-full max-w-lg">
    <div className="flex items-center gap-6 bg-white/10 p-6 rounded-2xl border-l-8 border-blue-400 animate-slide-10s">
      <Anchor className="text-blue-200" size={40} />
      <div>
        <div className="font-bold text-white text-2xl">Bindung</div>
        <div className="text-white/70 text-lg">Sicherheit vs. Unsicherheit</div>
      </div>
    </div>
    <div className="flex items-center gap-6 bg-white/10 p-6 rounded-2xl border-l-8 border-emerald-400 animate-slide-10s" style={{animationDelay: '2s'}}>
      <Users className="text-emerald-200" size={40} />
      <div>
        <div className="font-bold text-white text-2xl">System</div>
        <div className="text-white/70 text-lg">Symptomträger im Kontext</div>
      </div>
    </div>
    <div className="flex items-center gap-6 bg-white/10 p-6 rounded-2xl border-l-8 border-amber-400 animate-slide-10s" style={{animationDelay: '4s'}}>
      <Zap className="text-amber-200" size={40} />
      <div>
        <div className="font-bold text-white text-2xl">Arousal</div>
        <div className="text-white/70 text-lg">Biologischer Notfallmodus</div>
      </div>
    </div>
  </div>
);

// B1: Stoppschild (Pulsierend für Aufmerksamkeit)
const StopSign = () => (
  <div className="flex items-center justify-center gap-12">
    <div className="w-64 h-64 bg-red-600 outline outline-8 outline-white flex items-center justify-center text-white font-black text-5xl shadow-2xl rounded-full animate-pulse-10s">
      STOPP
    </div>
    <div className="text-left space-y-4">
      <div className="bg-amber-900/40 p-5 rounded-r-xl text-amber-50 text-xl font-bold border-l-8 border-amber-500 animate-slide-10s">1. Wahrnehmen</div>
      <div className="bg-amber-800/40 p-5 rounded-r-xl text-amber-50 text-xl font-bold border-l-8 border-amber-500 animate-slide-10s" style={{animationDelay: '2s'}}>2. Absichern</div>
      <div className="bg-amber-700/40 p-5 rounded-r-xl text-amber-50 text-xl font-bold border-l-8 border-amber-500 animate-slide-10s" style={{animationDelay: '4s'}}>3. Handeln</div>
    </div>
  </div>
);

// B2: Lautstärke (Beruhigender Balken)
const VolumeControl = () => (
  <div className="flex flex-col items-center gap-8 w-full max-w-md">
    <div className="flex gap-4 items-end h-48 w-full justify-center">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-10 bg-amber-200 rounded-t-lg opacity-90 shadow-lg" 
             style={{ 
               height: `${100 - (i * 15)}%`, 
               animation: `pulse-10s 10s ease-in-out infinite`,
               animationDelay: `${i * 0.5}s` 
             }}></div>
      ))}
    </div>
    <div className="flex items-center gap-4 text-amber-100 border-2 border-amber-200/50 px-10 py-5 rounded-full bg-black/30 backdrop-blur animate-glow-10s">
      <Volume2 size={36} />
      <span className="font-bold text-2xl tracking-wide">Low Arousal</span>
    </div>
  </div>
);

// B3: Waage (Logisch: Wippen/Schaukeln statt Drehen)
const InterventionScale = () => (
  <div className="relative w-full h-80 flex items-center justify-center">
    {/* Waage Balken (Wippt) */}
    <div className="w-[500px] h-4 bg-white/80 rounded animate-swing-10s">
      
      {/* Linke Waagschale (Grenze) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
         <div className="h-16 w-1 bg-white/50"></div>
         <div className="w-32 h-32 bg-red-500/80 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow-xl">
           Grenze
         </div>
      </div>
      
      {/* Rechte Waagschale (Beziehung) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
         <div className="h-16 w-1 bg-white/50"></div>
         <div className="w-32 h-32 bg-emerald-500/80 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow-xl">
           Beziehung
         </div>
      </div>
    </div>
    
    {/* Dreieck Basis (Statisch) */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8">
      <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-amber-400"></div>
    </div>
  </div>
);

// C1: Rogers Dreieck (Stabil)
const RogersTriangle = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="relative w-96 h-80">
      <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full animate-pulse-10s"></div>
      
      {/* Ecken */}
      <div className="absolute bottom-0 left-0 animate-float-10s">
         <div className="bg-emerald-900/90 px-6 py-3 rounded-xl border-2 border-emerald-400 text-2xl font-bold text-emerald-50 shadow-lg">Empathie</div>
      </div>
      <div className="absolute bottom-0 right-0 animate-float-10s" style={{animationDelay: '1s'}}>
         <div className="bg-emerald-900/90 px-6 py-3 rounded-xl border-2 border-emerald-400 text-2xl font-bold text-emerald-50 shadow-lg">Akzeptanz</div>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
         <div className="animate-float-10s" style={{animationDelay: '2s'}}>
           <div className="bg-emerald-900/90 px-6 py-3 rounded-xl border-2 border-emerald-400 text-2xl font-bold text-emerald-50 shadow-lg">Kongruenz</div>
         </div>
      </div>
      
      {/* Verbindungslinien */}
      <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 87">
        <polygon points="50,10 95,85 5,85" fill="none" stroke="rgba(167, 243, 208, 0.6)" strokeWidth="1.5" className="animate-pulse-10s" />
      </svg>
    </div>
  </div>
);

// C2: Trauma Brille (Logisch: Scan-Effekt)
const TraumaGlasses = () => (
  <div className="flex flex-col items-center justify-center w-full">
    <div className="relative mb-10">
      <Glasses size={200} className="text-emerald-200 relative z-10 drop-shadow-2xl" />
      {/* Scan Balken Animation */}
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-400/80 shadow-[0_0_15px_rgba(96,165,250,1)] animate-scan-10s z-20 rounded-full"></div>
    </div>

    <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
       <div className="bg-emerald-900/60 backdrop-blur p-6 rounded-2xl border border-emerald-500/30 text-center animate-slide-10s">
          <div className="text-white font-black text-2xl mb-2">VERHALTEN</div>
          <div className="text-lg text-emerald-200 font-medium">Laut / Aggressiv</div>
       </div>
       
       <div className="bg-blue-900/60 backdrop-blur p-6 rounded-2xl border-2 border-blue-400 text-center shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-slide-10s" style={{animationDelay: '0.5s'}}>
          <div className="text-white font-black text-2xl mb-2">WAHRHEIT</div>
          <div className="text-lg text-blue-200 font-medium">Angst / Ohnmacht</div>
       </div>
    </div>
  </div>
);

// C3: Brücke (Logisch: Brücke baut sich auf)
const BridgeRepair = () => (
  <div className="w-full h-64 flex flex-col items-center justify-center">
    <div className="relative w-full max-w-2xl h-8 bg-emerald-900/30 rounded-full overflow-hidden mb-8 border border-emerald-500/30">
       {/* Fortschrittsbalken von links und rechts */}
       <div className="absolute left-0 top-0 h-full bg-emerald-400/80 animate-fill-10s" style={{width: '50%', animationDirection: 'normal'}}></div>
       <div className="absolute right-0 top-0 h-full bg-emerald-400/80 animate-fill-10s" style={{width: '50%', animationDirection: 'normal'}}></div>
       
       {/* Funke in der Mitte */}
       <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_white] animate-pulse-10s">
            <ArrowRightLeft className="text-emerald-600" size={24} />
          </div>
       </div>
    </div>
    
    <div className="text-white font-bold text-3xl bg-emerald-800/80 px-8 py-3 rounded-xl backdrop-blur shadow-lg animate-float-10s">
      Beziehungsangebot
    </div>
  </div>
);

// D1: Werkzeug Mensch (Logisch: Verschmelzung/Trennung)
const RoleSwitch = () => (
  <div className="flex items-center justify-center gap-8 w-full">
     {/* Linke Seite: Selbst */}
     <div className="flex flex-col items-center animate-float-10s">
        <div className="w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center border-4 border-rose-300 shadow-xl">
           <User size={64} className="text-white" />
        </div>
        <div className="mt-4 text-white font-bold text-xl bg-rose-900/50 px-4 py-1 rounded">SELBST</div>
     </div>

     {/* Mitte: Transformations-Pfeile */}
     <div className="text-white/50 animate-pulse-10s">
        <ArrowRightLeft size={48} />
     </div>

     {/* Rechte Seite: Rolle */}
     <div className="flex flex-col items-center animate-float-10s" style={{animationDelay: '1s'}}>
        <div className="w-40 h-40 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-indigo-300 shadow-2xl relative">
           <Shield size={80} className="text-white relative z-10" />
           {/* Glow hinter dem Schild */}
           <div className="absolute inset-0 bg-indigo-400/50 blur-xl rounded-full animate-pulse-10s"></div>
        </div>
        <div className="mt-4 text-white font-bold text-2xl bg-indigo-900/50 px-6 py-2 rounded border border-indigo-400">ROLLE</div>
     </div>
  </div>
);

// D2: Trigger (Herzschlag Animation)
const TriggerPulse = () => (
  <div className="flex flex-col items-center justify-center gap-8">
    <div className="relative">
      <Activity size={160} className="text-rose-400 relative z-10 drop-shadow-lg" />
      {/* Herzschlag Ringe */}
      <div className="absolute inset-0 border-4 border-rose-500/50 rounded-full animate-pulse-10s scale-150"></div>
    </div>
    
    <div className="flex items-center gap-4 bg-black/40 px-8 py-4 rounded-2xl border border-rose-500/30">
       <span className="h-4 w-4 bg-rose-500 rounded-full animate-pulse"></span>
       <div className="text-6xl font-mono text-rose-200 font-bold tracking-widest animate-pulse-10s">180 BPM</div>
    </div>
    
    <div className="text-rose-200 font-bold uppercase tracking-[0.2em] text-lg bg-rose-900/40 px-4 py-1 rounded">Amygdala Hijack</div>
  </div>
);

// D3: Heiner Schieberegler (Logisch: Cursor bewegt sich)
const HeinerSlider = () => (
  <div className="w-full max-w-2xl mx-auto bg-indigo-900/40 p-10 rounded-3xl backdrop-blur-md border border-indigo-500/30 flex flex-col gap-10">
     {/* Schiene */}
     <div className="relative w-full h-6 bg-indigo-950 rounded-full shadow-inner overflow-hidden">
        {/* Beweglicher Indikator */}
        <div className="absolute top-0 bottom-0 w-8 bg-white rounded-full shadow-[0_0_20px_white] animate-slide-10s" 
             style={{ 
               animationName: 'slide-cursor', 
               animationDuration: '10s', 
               animationIterationCount: 'infinite',
               animationTimingFunction: 'ease-in-out'
             }}>
          <style>{`
            @keyframes slide-cursor {
              0%, 100% { left: 50%; transform: translateX(-50%); background: #34d399; } /* Passung */
              33% { left: 10%; transform: translateX(0); background: #f43f5e; } /* Dominanz */
              66% { left: 90%; transform: translateX(-100%); background: #fbbf24; } /* Aufopferung */
            }
          `}</style>
        </div>
     </div>
     
     <div className="flex justify-between items-start text-center mt-6 gap-6">
        <div className="flex flex-col items-center w-1/3 opacity-90 leading-tight">
           <div className="text-rose-400 font-black text-2xl mb-1 whitespace-nowrap">Dominanz</div>
           <div className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Härte</div>
        </div>
        <div className="flex flex-col items-center w-1/3 gap-1 leading-tight">
           <div className="text-emerald-400 font-black text-3xl mb-1 drop-shadow-md whitespace-nowrap">Passung</div>
           <div className="text-emerald-100 text-sm font-bold uppercase tracking-wider bg-emerald-900/50 px-3 py-1 rounded-full">Ziel</div>
        </div>
        <div className="flex flex-col items-center w-1/3 opacity-90 leading-tight">
           <div className="text-amber-400 font-black text-2xl mb-1 whitespace-nowrap">Aufopferung</div>
           <div className="text-indigo-200 text-sm font-bold uppercase tracking-wider whitespace-nowrap">Grenzenlos</div>
        </div>
     </div>
  </div>
);

// D4: Hygiene Batterie (Logisch: Füllen)
const HygieneBattery = () => (
  <div className="flex flex-col items-center gap-8">
     <div className="relative w-48 h-80 border-[10px] border-indigo-300/40 rounded-[2rem] p-4 flex flex-col justify-end backdrop-blur-sm bg-indigo-900/20 overflow-hidden">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-indigo-300/40 rounded-t-xl"></div>
        
        {/* Füllung (vertikal animiert) */}
        <div
          className="absolute bottom-4 left-4 right-4 rounded-xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] animate-battery-fill-10s"
          style={{ height: '0%' }}
        ></div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
           <Zap className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-pulse-10s" size={80} />
        </div>
     </div>
     <div className="flex gap-6">
        <span className="bg-indigo-600 px-6 py-3 rounded-xl text-white text-lg font-bold shadow-lg animate-float-10s">Supervision</span>
        <span className="bg-indigo-600 px-6 py-3 rounded-xl text-white text-lg font-bold shadow-lg animate-float-10s" style={{animationDelay: '1s'}}>Team</span>
     </div>
  </div>
);

// OUTRO: Zusammenfassung (Stabil & Stark)
const OutroSummary = () => (
  <div className="flex flex-col items-center gap-10">
     <div className="relative w-80 h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse-10s"></div>
        {/* 3 Kreise gleichmäßig um das Zentrum angeordnet */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ marginTop: '-96px' }}>
          <div className="bg-amber-500/20 w-40 h-40 rounded-full border-4 border-amber-500 flex items-center justify-center animate-float-10s">
            <Shield size={40} className="text-amber-200" />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ marginLeft: '-84px', marginTop: '56px' }}>
          <div className="bg-emerald-500/20 w-40 h-40 rounded-full border-4 border-emerald-500 flex items-center justify-center animate-float-10s" style={{animationDelay: '1s'}}>
            <Heart size={40} className="text-emerald-200" />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ marginLeft: '84px', marginTop: '56px' }}>
          <div className="bg-indigo-500/20 w-40 h-40 rounded-full border-4 border-indigo-500 flex items-center justify-center animate-float-10s" style={{animationDelay: '2s'}}>
            <Brain size={40} className="text-indigo-200" />
          </div>
        </div>
        
        {/* Zentrum */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10 bg-white text-slate-900 w-28 h-28 rounded-full flex items-center justify-center font-black text-lg shadow-[0_0_40px_white] animate-glow-10s">
           HALTUNG
        </div>
     </div>
  </div>
);

// --- HAUPT-APP ---

export default function PresentationApp() {
  const [mode, setMode] = useState('present'); 
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('app9-auth');
      if (stored === 'ok') setAuthorized(true);
    }
    const handleKey = (e) => {
      if(mode !== 'present') return;
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSection, currentSlide, mode]);

  const activeData = presentationData[currentSection];
  const activeSlideContent = activeData.slides[currentSlide];

  const next = () => {
    if (currentSlide < activeData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentSection < presentationData.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentSlide(0);
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentSlide(presentationData[currentSection - 1].slides.length - 1);
    }
  };

  const goToSection = (idx) => {
    setCurrentSection(idx);
    setCurrentSlide(0);
    setMenuOpen(false);
    setMode('present');
  };

  const tryUnlock = (e) => {
    e.preventDefault();
    if (pwInput.trim() === ACCESS_PASSWORD) {
      setAuthorized(true);
      setPwError('');
      if (typeof window !== 'undefined') window.localStorage.setItem('app9-auth', 'ok');
    } else {
      setPwError('Falsches Passwort');
    }
  };

  const downloadHandoutPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 44;
    const contentWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - margin;
    let y = margin;

    const ensureSpace = (neededHeight = 16) => {
      if (y + neededHeight > bottomLimit) {
        doc.addPage();
        y = margin;
      }
    };

    const drawWrappedText = (text, options = {}) => {
      const {
        fontSize = 11,
        lineHeight = 15,
        indent = 0,
        extraSpacing = 6,
        style = 'normal'
      } = options;
      doc.setFont('helvetica', style);
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      lines.forEach((line) => {
        ensureSpace(lineHeight);
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
      y += extraSpacing;
    };

    const drawHeading = (text, level = 1) => {
      const config = level === 1
        ? { fontSize: 16, lineHeight: 20, extraSpacing: 10 }
        : { fontSize: 13, lineHeight: 17, extraSpacing: 8 };
      drawWrappedText(text, { ...config, style: 'bold' });
    };

    drawHeading(`Handout: ${TALK_TOPIC}`, 1);
    drawWrappedText("Wiki, theoretische Hintergrunde und Quellen (APA 7).");

    const wikiSections = presentationData.slice(1);
    wikiSections.forEach((section, sectionIndex) => {
      drawHeading(`${section.speaker}: ${section.topic}`, 2);

      section.wiki
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
          drawWrappedText(line, { fontSize: 10.5, lineHeight: 14, extraSpacing: 2 });
        });

      drawWrappedText("Kernpunkte:", { fontSize: 11.5, lineHeight: 15, style: 'bold', extraSpacing: 4 });
      section.slides.forEach((slide) => {
        drawWrappedText(`- ${slide.headline}: ${slide.sub}`, { fontSize: 10.5, lineHeight: 14, indent: 10, extraSpacing: 2 });
      });

      const references = sectionReferences[section.id] || [];
      if (references.length > 0) {
        drawWrappedText("Quellen zu diesem Teil (APA 7):", { fontSize: 11.5, lineHeight: 15, style: 'bold', extraSpacing: 4 });
        references.forEach((reference) => {
          drawWrappedText(`- ${reference}`, { fontSize: 9.8, lineHeight: 13, indent: 10, extraSpacing: 1 });
        });
      }

      if (sectionIndex < wikiSections.length - 1) {
        y += 6;
        ensureSpace(18);
      }
    });

    doc.addPage();
    y = margin;
    drawHeading("Gesamtliteratur (APA 7)", 1);
    apaReferences.forEach((reference) => {
      drawWrappedText(`- ${reference}`, { fontSize: 10, lineHeight: 13, indent: 10, extraSpacing: 1 });
    });

    doc.save("handout-grundlagen-professionalisierung-berufsethik.pdf");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-indigo-300" size={28} />
            <div>
              <h1 className="text-xl font-bold">Zugang geschützt</h1>
              <p className="text-sm text-slate-400">Bitte Passwort eingeben</p>
            </div>
          </div>
          <form onSubmit={tryUnlock} className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-400 focus:outline-none"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Passwort"
            />
            {pwError && <div className="text-rose-400 text-sm">{pwError}</div>}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 shadow-lg shadow-indigo-500/30 transition"
            >
              <Unlock size={18} /> Entsperren
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER PRÄSENTATION ---
  if (mode === 'present') {
    return (
      <div className={`h-screen w-screen overflow-hidden flex flex-col ${activeData.color} transition-colors duration-1000 ease-in-out font-sans`}>
        <style>{styles}</style>
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center p-6 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className={`p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur`}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-white/90 font-bold tracking-widest uppercase text-sm md:text-base hidden sm:block bg-black/20 px-4 py-2 rounded-lg">
              {activeData.speaker} <span className="opacity-40 mx-2">|</span> {activeData.topic}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => setMode('wiki')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold transition backdrop-blur border border-white/10">
              <BookOpen size={20} /> <span className="hidden sm:inline">Wiki & Quellen</span>
            </button>
          </div>
        </div>

        {/* SIDE MENU */}
        {menuOpen && (
          <div className="absolute top-24 left-6 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-80 text-slate-800 animate-[fadeIn_0.3s]">
            <div className="text-xs font-bold text-slate-400 uppercase mb-4 ml-2 tracking-widest">Navigation</div>
            {presentationData.map((section, idx) => (
              <button 
                key={section.id} 
                onClick={() => goToSection(idx)}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-4 mb-2 transition-all ${currentSection === idx ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <div className={`${currentSection === idx ? 'text-indigo-600' : 'text-slate-400'}`}>{section.icon}</div>
                {section.topic}
              </button>
            ))}
          </div>
        )}

        {/* SLIDE CONTENT */}
        <div className="flex-1 flex flex-col relative px-8 md:px-24 pb-12 justify-center">
          
          {activeData.id === 'intro' ? (
            <div className="text-center animate-[fadeIn_1s] px-4 md:px-10 lg:px-16">
               <div className="flex justify-center mb-10">{activeData.icon}</div>
               <h1 className="font-black text-white mb-5 leading-tight tracking-tight drop-shadow-xl"
                   style={{ fontSize: 'clamp(1.8rem, 3.4vw + 0.8rem, 4rem)' }}>
                 {activeData.title}
               </h1>
               {activeData.subtitle && (
                 <p className="text-white/90 font-light max-w-4xl mx-auto leading-snug"
                    style={{ fontSize: 'clamp(1.1rem, 1.8vw + 0.6rem, 2.1rem)' }}>
                   {activeData.subtitle}
                 </p>
               )}
               <ul className="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label="Vortragsteam">
                 {TEAM_MEMBERS.map((member) => (
                   <li
                     key={member}
                     className="px-4 py-2 rounded-full text-sm md:text-base font-semibold text-white bg-white/15 border border-white/20 backdrop-blur animate-pulse-10s motion-reduce:animate-none"
                   >
                     {member}
                   </li>
                 ))}
               </ul>
               <div className="mt-16 md:mt-20">
                 <IntroCover />
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center h-full">
              
              {/* TEXT (LINKS) */}
              <div className="lg:col-span-7 space-y-12 animate-[slideInLeft_0.8s]">
                <div>
                  <h2 className={`text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-md ${activeData.text}`}>
                    {activeSlideContent.headline}
                  </h2>
                  <div className="h-2 w-32 bg-white/40 rounded-full mb-6"></div>
                  <p className="text-3xl md:text-4xl text-white/90 font-light leading-snug">
                    {activeSlideContent.sub}
                  </p>
                </div>

                <ul className="space-y-8">
                  {activeSlideContent.bullets.map((txt, i) => (
                    <li key={i} className="flex items-center gap-6 text-2xl md:text-3xl text-white font-medium drop-shadow-sm">
                      <ChevronRight className="shrink-0 opacity-70" size={40} />
                      <span>{txt}</span>
                    </li>
                  ))}
                </ul>

                {activeSlideContent.interactive === 'thanks-cover' && (
                  <div className="mt-4">
                    <button
                      onClick={() => setMode('wiki')}
                      className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-8 py-4 rounded-full font-bold text-lg transition backdrop-blur border border-white/20 shadow-lg"
                    >
                      <BookOpen size={22} /> Wiki & Quellen öffnen
                    </button>
                  </div>
                )}

                {activeSlideContent.quote && (
                  <div className="mt-12 p-8 border-l-[12px] border-white/20 bg-white/5 rounded-r-2xl italic text-2xl md:text-3xl text-white/90 font-serif leading-relaxed">
                    {activeSlideContent.quote}
                  </div>
                )}
              </div>

              {/* VISUALS (RECHTS) */}
              <div className="lg:col-span-5 h-full max-h-[70vh] flex items-center justify-center">
                <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-[zoomIn_0.8s]">
                   {activeSlideContent.interactive === 'iceberg' && <IcebergModel />}
                   {activeSlideContent.interactive === 'aggression-types' && <AggressionTypes />}
                   {activeSlideContent.interactive === 'theory-grid' && <TheoryGrid />}
                   {activeSlideContent.interactive === 'stop-sign' && <StopSign />}
                   {activeSlideContent.interactive === 'volume-control' && <VolumeControl />}
                   {activeSlideContent.interactive === 'intervention-scale' && <InterventionScale />}
                   {activeSlideContent.interactive === 'rogers-triangle' && <RogersTriangle />}
                   {activeSlideContent.interactive === 'trauma-glasses' && <TraumaGlasses />}
                   {activeSlideContent.interactive === 'bridge-repair' && <BridgeRepair />}
                   {activeSlideContent.interactive === 'role-switch' && <RoleSwitch />}
                   {activeSlideContent.interactive === 'trigger-pulse' && <TriggerPulse />}
                   {activeSlideContent.interactive === 'heiner-slider' && <HeinerSlider />}
                   {activeSlideContent.interactive === 'hygiene-battery' && <HygieneBattery />}
                   {activeSlideContent.interactive === 'outro-summary' && <OutroSummary />}
                   {activeSlideContent.interactive === 'thanks-cover' && <ThanksCover />}
                   
                   {/* Fallback */}
                   {activeSlideContent.interactive === 'intro-cover' && <div/>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="h-20 flex justify-between items-center px-8 bg-black/20 backdrop-blur-md">
          <div className="text-white/60 font-mono text-base font-bold">
             Folie {currentSlide + 1} / {activeData.slides.length}
          </div>
          
          <div className="flex gap-4">
            <button onClick={prev} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition disabled:opacity-30 border border-white/5" disabled={currentSection===0 && currentSlide===0}>
              <ChevronLeft size={28} />
            </button>
            <button onClick={next} className="p-4 bg-white/20 hover:bg-white/30 rounded-full text-white shadow-lg transition disabled:opacity-30 border border-white/10" disabled={currentSection===presentationData.length-1 && currentSlide===activeData.slides.length-1}>
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
        
        {/* PROGRESS */}
        <div className="h-3 bg-black/30 w-full fixed bottom-0 left-0">
          <div 
            className="h-full bg-white/80 transition-all duration-500 shadow-[0_0_10px_white]"
            style={{ width: `${((currentSection * 100) + ((currentSlide + 1) / activeData.slides.length * 100)) / presentationData.length}%` }}
          />
        </div>
      </div>
    );
  }

  // --- RENDER WIKI ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-slate-200 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-200"><BookOpen size={28} /></div>
          <div>
             <h1 className="font-bold text-2xl leading-none text-slate-900">Wissensspeicher</h1>
             <p className="text-sm text-slate-500 mt-1 font-medium">{TALK_TOPIC}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadHandoutPdf}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-lg transition"
          >
            <FileDown size={18} /> Handout als PDF
          </button>
          <button 
            onClick={() => setMode('present')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-indigo-200 transition transform hover:scale-105"
          >
            <Eye size={20} /> Zurück zur Präsentation
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8 md:p-16 space-y-16">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl">
           <h2 className="text-4xl font-black mb-6">Handout & Dokumentation</h2>
           <p className="text-slate-300 leading-relaxed text-lg">
             Diese Übersicht dient zur Vertiefung der Präsentation. Sie enthält alle theoretischen Modelle, Definitionen und Quellenangaben für die Prüfungsvorbereitung.
           </p>
        </div>

        {presentationData.slice(1).map((section) => (
          <div key={section.id} className="scroll-mt-32" id={section.id}>
            <div className="flex items-center gap-6 mb-8">
              <div className={`p-4 rounded-2xl ${section.color.replace('bg-', 'text-')} bg-white shadow-md border border-slate-100`}>
                {section.icon}
              </div>
              <h2 className="text-4xl font-bold text-slate-800">{section.speaker}: {section.topic}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white rounded-3xl p-10 shadow-sm border border-slate-200 hover:shadow-md transition">
                 <h3 className="font-bold text-lg text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Theoretische Hintergründe</h3>
                 <div className="prose prose-lg prose-slate leading-relaxed text-slate-600 whitespace-pre-line">
                    {section.wiki}
                 </div>
              </div>
              <div className="space-y-6">
                 <h3 className="font-bold text-lg text-slate-400 uppercase tracking-widest pl-2">Kernpunkte</h3>
                 {section.slides.map((slide, i) => (
                   <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 transition group cursor-default">
                      <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition">{slide.headline}</h4>
                      <p className="text-sm text-slate-500 font-medium">{slide.sub}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-slate-200 pt-12 mt-16">
          <h3 className="font-bold text-lg text-slate-500 uppercase tracking-widest mb-6">Quellen (APA 7)</h3>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
            <div className="space-y-8">
              {presentationData.slice(1).map((section) => {
                const references = sectionReferences[section.id] || [];
                if (references.length === 0) return null;

                return (
                  <div key={`refs-${section.id}`}>
                    <h4 className="font-bold text-slate-800 mb-3">{section.speaker}: {section.topic}</h4>
                    <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
                      {references.map((reference, idx) => (
                        <li key={`${section.id}-${idx}`}>{reference}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-6 text-center text-slate-400 text-sm font-medium">Erstellt für Prüfung: {TALK_TOPIC}.</p>
        </div>
      </div>
    </div>
  );
}
