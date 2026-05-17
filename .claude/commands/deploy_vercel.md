Automatically build and deploy the Interactive Treasure Box Game to Vercel production. Run every step below using tool calls — do not ask the user for manual input at any point.

## Step 1 — Verify and run the production build

Run `npm run build` using the Bash tool. If it fails, fix the error and retry before continuing.

## Step 2 — Commit all pending changes

Use the Bash tool to:
1. Run `git status` to check for uncommitted changes.
2. If there are changes, run:
   ```
   git add -A
   git commit -m "Deploy: update build and source files"
   ```
3. If there is nothing to commit, skip silently.

## Step 3 — Push to GitHub

Run `git push` using the Bash tool. If the push fails, report the error to the user.

## Step 4 — Deploy to Vercel

Run the following using the Bash tool:
```
vercel --prod --yes
```

The `--yes` flag accepts all prompts automatically so no manual input is needed.

## Step 5 — Report the live URL

Parse the production URL from the Vercel output (the line starting with `▲ Production` or the aliased URL) and display it to the user in this format:

```
Deployment complete.
Live URL: <url>
```
