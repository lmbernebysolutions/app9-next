import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(projectRoot, "app", "page.jsx");
const outputPath = path.join(projectRoot, "Kahoot-Ressource-Praesentation.pdf");

const source = fs.readFileSync(sourcePath, "utf8");

const slideRegex =
  /headline:\s*"((?:[^"\\]|\\.)*)",\s*sub:\s*"((?:[^"\\]|\\.)*)",\s*bullets:\s*\[((?:[\s\S]*?))\]\s*,\s*interactive:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*quote:\s*"((?:[^"\\]|\\.)*)")?/g;
const sectionTitleRegex = /speaker:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*topic:\s*"((?:[^"\\]|\\.)*)"/g;
const wikiRegex = /wiki:\s*`([\s\S]*?)`\s*[,\n]/g;

const unescapeJs = (text) =>
  text
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");

const slides = [];
let match;
while ((match = slideRegex.exec(source)) !== null) {
  const headline = unescapeJs(match[1].trim());
  const sub = unescapeJs(match[2].trim());
  const bulletsRaw = match[3];
  const quote = match[5] ? unescapeJs(match[5].trim()) : null;

  const bulletRegex = /"((?:[^"\\]|\\.)*)"/g;
  const bullets = [];
  let bulletMatch;
  while ((bulletMatch = bulletRegex.exec(bulletsRaw)) !== null) {
    bullets.push(unescapeJs(bulletMatch[1].trim()));
  }

  slides.push({ headline, sub, bullets, quote });
}

if (slides.length === 0) {
  throw new Error("Keine Folieninhalte gefunden. Regex-Parsing fehlgeschlagen.");
}

const sectionTitles = [];
let sectionTitleMatch;
while ((sectionTitleMatch = sectionTitleRegex.exec(source)) !== null) {
  const speaker = unescapeJs(sectionTitleMatch[1].trim());
  const topic = unescapeJs(sectionTitleMatch[2].trim());
  sectionTitles.push(`${speaker}: ${topic}`);
}

const wikiBlocks = [];
let wikiMatch;
while ((wikiMatch = wikiRegex.exec(source)) !== null) {
  const text = wikiMatch[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
  wikiBlocks.push(unescapeJs(text));
}

const buildEntries = () => {
  const entries = [];
  entries.push({
    text: "Ressourcenblatt fur Kahoot-Quiz (1 Seite)",
    type: "title",
  });
  entries.push({
    text: "Inhalte 1:1 aus der Prasentation (ohne Fragen), nur als Informationsquelle.",
    type: "meta",
  });

  slides.forEach((slide, index) => {
    entries.push({ text: `Folie ${index + 1}: ${slide.headline}`, type: "heading" });
    entries.push({ text: slide.sub, type: "subheading" });
    slide.bullets.forEach((bullet) => entries.push({ text: `- ${bullet}`, type: "bullet" }));
    if (slide.quote) entries.push({ text: slide.quote, type: "quote" });
    entries.push({ text: "", type: "spacer" });
  });

  entries.push({ text: "Vertiefung aus Wiki/Wissensspeicher", type: "heading" });
  wikiBlocks.forEach((block, index) => {
    const sectionLabel = sectionTitles[index] || `Teil ${index + 1}`;
    entries.push({ text: `${sectionLabel}:`, type: "subheading" });
    entries.push({ text: block, type: "detail" });
    entries.push({ text: "", type: "spacer" });
  });

  return entries;
};

const styleFor = (entryType, scale) => {
  const base = {
    title: { size: 9.0, lineHeight: 10.6, spacingAfter: 2.0, bold: true, indent: 0 },
    meta: { size: 5.4, lineHeight: 6.4, spacingAfter: 2.1, bold: false, indent: 0 },
    heading: { size: 6.1, lineHeight: 7.2, spacingAfter: 1.2, bold: true, indent: 0 },
    subheading: { size: 5.6, lineHeight: 6.6, spacingAfter: 1.0, bold: true, indent: 0 },
    bullet: { size: 5.2, lineHeight: 6.2, spacingAfter: 0.6, bold: false, indent: 4.6 },
    quote: { size: 5.1, lineHeight: 6.0, spacingAfter: 0.8, bold: false, indent: 6.0 },
    detail: { size: 4.9, lineHeight: 5.8, spacingAfter: 0.9, bold: false, indent: 4.0 },
    spacer: { size: 4.8, lineHeight: 4.8, spacingAfter: 1.0, bold: false, indent: 0 },
  }[entryType];

  return {
    size: base.size * scale,
    lineHeight: base.lineHeight * scale,
    spacingAfter: base.spacingAfter * scale,
    bold: base.bold,
    indent: base.indent * scale,
  };
};

const tryLayout = (doc, entries, scale) => {
  const margin = 12;
  const top = 12;
  const bottom = 12;
  const gap = 10;
  const columns = 3;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const columnWidth = (usableWidth - gap * (columns - 1)) / columns;
  const maxY = pageHeight - bottom;

  let col = 0;
  let y = top;

  for (const entry of entries) {
    const s = styleFor(entry.type, scale);
    doc.setFont("helvetica", s.bold ? "bold" : "normal");
    doc.setFontSize(s.size);

    const width = columnWidth - s.indent;
    const lines = entry.type === "spacer" ? [""] : doc.splitTextToSize(entry.text, width);
    const blockHeight = lines.length * s.lineHeight + s.spacingAfter;

    if (y + blockHeight > maxY) {
      col += 1;
      if (col >= columns) return false;
      y = top;
    }

    const x = margin + col * (columnWidth + gap) + s.indent;
    for (const line of lines) {
      if (entry.type !== "spacer") doc.text(line, x, y);
      y += s.lineHeight;
    }
    y += s.spacingAfter;
  }

  return true;
};

const entries = buildEntries();
const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });

let low = 0.65;
let high = 1.5;
let best = null;

for (let i = 0; i < 18; i += 1) {
  const mid = Number(((low + high) / 2).toFixed(4));
  const testDoc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const fits = tryLayout(testDoc, entries, mid);
  if (fits) {
    best = mid;
    low = mid;
  } else {
    high = mid;
  }
}

if (!best) {
  throw new Error("Inhalte passen selbst im kompakten Layout nicht auf eine Seite.");
}

tryLayout(doc, entries, best);
doc.save(outputPath);
console.log(`PDF erstellt (1 Seite, maximale Ausnutzung): ${outputPath}`);
