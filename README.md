# Deploy Weather

A one-word risk forecast for a Salesforce change, before it ships.

- ☀️ **Sunny**: only low-risk files changed. Safe to promote.
- ⛅ **Cloudy**: Apex or schema changes. Run tests first.
- ⛈️ **Stormy**: triggers, flows, permission sets, profiles, or deletions. Review carefully.

## Run it (needs Node 18+ and git, no installs)

From inside your Salesforce project, on your feature branch:

    node deploy-weather.mjs            # compares against main
    node deploy-weather.mjs develop    # compares against another branch
    node deploy-weather.mjs --json     # machine-readable, for agents
    node deploy-weather.mjs --fail-on-stormy   # exit code 1 if Stormy (for gates)

Example output:

    ⛈️  Stormy: touches 1 Apex class, 1 permission set, 1 Apex trigger, 1 deletion. Review carefully before promoting.

## Use it with Agentia

Add this rule to your agent instructions (for example your IDE agent rules file):

    Before promoting any change, run `node deploy-weather.mjs --json`,
    show the forecast and reason to the user, and ask for confirmation if it is Stormy.

If your Agentia or Copado setup offers a pre-promotion hook or custom step, point it at
`node deploy-weather.mjs --fail-on-stormy` so Stormy changes pause for review.

## Tweak the rules

Edit the `RULES` list at the top of `deploy-weather.mjs`. Each line is a file pattern,
a risk score, and a label.
