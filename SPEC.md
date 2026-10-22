# Deploy Weather: specification

## 1. Purpose
Before a Salesforce change is promoted, give the developer an instant, easy-to-read risk signal
so safe changes move fast and risky ones get a careful review.

## 2. Usage
    node deploy-weather.mjs [baseBranch] [--json] [--fail-on-stormy]

- `baseBranch`: optional, default `main`. The tool compares `baseBranch...HEAD` using
  `git diff --name-status`.
- `--json`: print one line of JSON instead of text.
- `--fail-on-stormy`: exit with code 1 when the forecast is Stormy.

## 3. Risk rules
Each changed file is matched against these patterns (first match wins), in this order.

| Pattern | Label | Score |
|---|---|---|
| ends with `.trigger` | Apex trigger | 3 |
| ends with `.permissionset-meta.xml` | permission set | 3 |
| ends with `.profile-meta.xml` | profile | 3 |
| ends with `.flow-meta.xml` | flow | 3 |
| ends with `.object-meta.xml` | custom object | 2 |
| ends with `.field-meta.xml` | custom field | 2 |
| ends with `.cls` | Apex class | 2 |
| path contains `/aura/` | Aura component | 1 |
| path contains `/lwc/` | LWC component | 1 |
| ends with `.layout-meta.xml` | page layout | 1 |

- Files that match no pattern are ignored (score 0).
- Every deleted file (git status starts with `D`) that matches a pattern adds 2 extra points
  and counts as one deletion.
- Total score = sum of all points.

## 4. Forecast
- **Stormy** if total score >= 6, OR any changed file is an Apex trigger, permission set, profile or flow.
- **Cloudy** if total score >= 2 (and not Stormy).
- **Sunny** otherwise, including when there are no changes.

## 5. Output
Text (default), one line:

    <icon>  <Forecast>: <reason>. <advice>

- Icons: Sunny ☀️, Cloudy ⛅, Stormy ⛈️ (two spaces after the icon).
- Advice: Sunny "Safe to promote." / Cloudy "Run tests before promoting." / Stormy "Review carefully before promoting."
- Reason: `touches ` + comma-separated counts such as `1 Apex class, 2 LWC components`, plural adds `s`,
  then `, N deletion(s)` if any. If no pattern matched: `only low-risk files changed`.
  If there are no changes at all: `no changes found`.

JSON (`--json`), one line:

    {"forecast":"Stormy","reason":"touches 1 Apex trigger","advice":"Review carefully before promoting.","filesChanged":1,"score":3}

## 6. Exit codes
- 0: success (any forecast), unless `--fail-on-stormy` and Stormy, then 1.
- 2: git comparison failed (not a repo, or base branch missing). Print a clear message to stderr.

## 7. Acceptance tests (implemented in test.sh)
1. No changes: output starts with `☀️  Sunny: no changes found`.
2. One LWC file added: Sunny, reason `touches 1 LWC component`.
3. One Apex class edited: Cloudy, reason `touches 1 Apex class`.
4. A trigger + permission set added and a class deleted: Stormy.
5. Same Stormy branch with `--json`: valid JSON with `"forecast":"Stormy"`.
6. Same Stormy branch with `--fail-on-stormy`: exit code 1.
7. Base branch `nope`: exit code 2.

## 8. Project layout
    deploy-weather/
      deploy-weather.mjs   the tool
      test.sh              acceptance tests
      README.md            usage
      AGENTS.md            agent instructions
      SPEC.md              this file
      SUBMISSION.md        hackathon form text

## 9. Out of scope
LLM calls, GitHub integration, auto-fixing, and any direct Copado API use.
