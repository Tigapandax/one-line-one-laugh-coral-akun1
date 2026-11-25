// One Line, One Laugh — writes the entry line to /output/entry.txt
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LIMIT = 200;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function problems(text: string): string[] {
  const bad: string[] = [];
  if (text.length === 0) bad.push("line is empty");
  if ([...text].length > LIMIT) bad.push(`line is ${[...text].length} chars, over the ${LIMIT} cap`);
  if (text.trim() !== text) bad.push("line has leading or trailing space");
  if (text.includes("\n") || text.includes("\r")) bad.push("line must be exactly one line");
  if (/ {2,}/.test(text)) bad.push("line has a double space");
  if (/[^\x20-\x7E]/.test(text)) bad.push("line has a non-printable character");
  if (!/[.!?]$/.test(text)) bad.push("line needs a closing . ! or ?");
  if (text.split(/\s+/).length < 3) bad.push("a joke needs at least three words");
  return bad;
}

const url = new URL("./one-line.txt", import.meta.url);
const line = readFileSync(url, "utf8").replace(/\n$/, "");
const found = problems(line);
if (found.length > 0) {
  for (const p of found) console.error(`FAIL: ${p}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_DIR + "/entry.txt", line + "\n");
console.log("entry:", line);
console.log(`OK: ${[...line].length}/${LIMIT} chars, entry written.`);
