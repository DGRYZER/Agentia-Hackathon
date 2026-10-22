# AGENTS.md: instructions for the coding agent

## Project
Deploy Weather is a tiny command-line tool for the Copado Agentia hackathon. It looks at the
files changed in a Salesforce git branch and prints a one-word risk forecast
(Sunny, Cloudy or Stormy) with a one-line reason.

## Your task
Build the tool exactly as described in `SPEC.md`. A working reference implementation is in
`deploy-weather.mjs`. If it already passes `test.sh`, improve only what `SPEC.md` asks for.
Do not add features that are not in the spec.

## Hard rules
- Node.js 18+ only. No npm dependencies. Single file `deploy-weather.mjs` (ES module).
- Must work on Windows, Mac and Linux.
- The tool never changes git state or any file. It only reads.
- Keep output exactly as specified in `SPEC.md` (the format is tested).
- Do not invent Copado or Agentia CLI commands. If integration is needed, only document it in README.

## How to check your work
Run: `bash test.sh` (needs git and node). All checks must print PASS.

## Definition of done
1. `bash test.sh` passes.
2. `README.md` explains usage in under one page.
3. No files other than those in the project layout of `SPEC.md` are added.
