#!/usr/bin/env node
// Deploy Weather: one-word risk forecast for a Salesforce change.
// Usage: node deploy-weather.mjs [baseBranch] [--json] [--fail-on-stormy]
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--")) ?? "main";
const asJson = args.includes("--json");
const failOnStormy = args.includes("--fail-on-stormy");

// Each rule: pattern, risk score, human label.
const RULES = [
  [/\.trigger$/, 3, "Apex trigger"],
  [/\.permissionset-meta\.xml$/, 3, "permission set"],
  [/\.profile-meta\.xml$/, 3, "profile"],
  [/\.flow-meta\.xml$/, 3, "flow"],
  [/\.object-meta\.xml$/, 2, "custom object"],
  [/\.field-meta\.xml$/, 2, "custom field"],
  [/\.cls$/, 2, "Apex class"],
  [/\/aura\//, 1, "Aura component"],
  [/\/lwc\//, 1, "LWC component"],
  [/\.layout-meta\.xml$/, 1, "page layout"],
];

function gitDiff(baseBranch) {
  return execFileSync("git", ["diff", "--name-status", `${baseBranch}...HEAD`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

let files;
try {
  files = gitDiff(base).trim().split("\n").filter(Boolean);
} catch (e) {
  console.error(`Could not compare with "${base}". Are you in a git repo with that branch?`);
  process.exit(2);
}

const counts = {};
let score = 0;
let deletions = 0;
for (const line of files) {
  const [status, path] = line.split("\t");
  const rule = RULES.find(([re]) => re.test(path));
  if (!rule) continue;
  counts[rule[2]] = (counts[rule[2]] ?? 0) + 1;
  score += rule[1];
  if (status.startsWith("D")) { deletions++; score += 2; }
}

let forecast = "Sunny";
if (files.length === 0) forecast = "Sunny";
else if (score >= 6 || Object.keys(counts).some((k) => ["Apex trigger", "permission set", "profile", "flow"].includes(k))) forecast = "Stormy";
else if (score >= 2) forecast = "Cloudy";

const parts = Object.entries(counts).map(([k, n]) => `${n} ${k}${n > 1 ? "s" : ""}`);
if (deletions) parts.push(`${deletions} deletion${deletions > 1 ? "s" : ""}`);
const reason = files.length === 0
  ? "no changes found"
  : parts.length ? `touches ${parts.join(", ")}` : "only low-risk files changed";
const advice = { Sunny: "Safe to promote.", Cloudy: "Run tests before promoting.", Stormy: "Review carefully before promoting." }[forecast];
const icon = { Sunny: "☀️", Cloudy: "⛅", Stormy: "⛈️" }[forecast];

if (asJson) {
  console.log(JSON.stringify({ forecast, reason, advice, filesChanged: files.length, score }));
} else {
  console.log(`${icon}  ${forecast}: ${reason}. ${advice}`);
}
if (failOnStormy && forecast === "Stormy") process.exit(1);
