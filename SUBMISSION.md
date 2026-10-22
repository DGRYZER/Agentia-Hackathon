# Hackathon registration text (copy into the form)

**Solution title**
Deploy Weather: a one-word forecast (Sunny, Cloudy or Stormy) for every change before it ships

**Problem statement**
Before promoting a change, developers have no quick way to judge how risky it is. They read long diffs or guess, and risky changes slip through while safe ones get over-reviewed.

**Abstract / description of solution**
A tiny agent step that looks at the files in a change and returns a one-word forecast with a one-line reason. For example: "Stormy: touches 2 Apex triggers and a permission set." Sunny means only low-risk files changed, Cloudy means some caution is needed, and Stormy means review carefully before promoting.

**Problem solved**
It gives developers and reviewers an instant, easy-to-read risk signal before promotion. Safe changes move faster, risky ones get extra attention, and nobody has to read a whole diff to know where to look. It doesn't replace Copado's quality gates, it just adds a quick signal in front of them.

**Tools / technologies planned to use**
Agentia™ Headless CLI, Copado pipelines, git, Node.js script, an LLM agent.
