Deploy all current changes to Vercel by following these steps in order:

## Step 1 — Check for changes
Run `git status` to see what files have been modified, added, or deleted.

If there are no changes (clean working tree), tell the user "No changes to deploy." and stop.

## Step 2 — Show a diff summary
Run `git diff --stat` to summarize what changed. Briefly tell the user what you see (e.g. "2 files changed: App.tsx and ScoreHistory.tsx").

## Step 3 — Stage all changes
Run `git add .` to stage all modified and new files.

## Step 4 — Write a commit message
Based on the diff summary, write a concise commit message that describes what changed (e.g. "Add score summary to My Scores dialog"). Do not use generic messages like "update files".

## Step 5 — Commit
Run git commit with the message you wrote.

## Step 6 — Push to GitHub
Run `git push origin main`.

## Step 7 — Deploy to Vercel
Run `vercel --prod` to deploy the latest build to production.

If the `vercel` command is not found, tell the user to run `! npm install -g vercel` in the prompt and then run `/deploy_vercel` again.

## Step 8 — Report the result
Tell the user the production URL returned by Vercel so they can open it immediately.
