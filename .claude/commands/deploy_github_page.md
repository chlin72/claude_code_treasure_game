Automatically build and deploy the Interactive Treasure Box Game to GitHub Pages. Run every step below using tool calls — do not ask the user for manual input at any point.

## Step 1 — Check GitHub CLI authentication

Run `gh auth status` using the Bash tool.

- If the output shows the user is **not logged in** (exit code non-zero or error message), run:
  ```
  gh auth login --web
  ```
  Then inform the user: "Please complete the GitHub login in your browser, then re-run /deploy_github_page."
  Stop execution here until the user re-runs the command after logging in.

- If the user **is logged in**, continue to Step 2 silently.

## Step 2 — Check if a remote GitHub repository exists

Run `git remote get-url origin` using the Bash tool.

- If the command **fails** (no remote set), a new repo must be created:
  1. Run `gh repo create` to create a new public repository. Use the current directory name as the repo name:
     ```
     gh repo create <repo-name> --public --source=. --remote=origin --push
     ```
     Replace `<repo-name>` with the actual folder name obtained from `basename $(pwd)`.
  2. Inform the user: "Created new GitHub repository and set as origin."

- If the remote **already exists**, continue to Step 3 silently.

## Step 3 — Detect the GitHub username and repo name

Run the following using the Bash tool to extract the repo info:
```
gh repo view --json nameWithOwner --jq '.nameWithOwner'
```

Store the result as `<owner>/<repo>` for use in Step 7.

Also extract just the repo name with:
```
gh repo view --json name --jq '.name'
```

## Step 4 — Update Vite base path for GitHub Pages

Read `vite.config.ts`. Check if the `base` option is already set to `'/<repo-name>/'`.

- If **not set or different**, update `vite.config.ts` to add `base: '/<repo-name>/'` inside the `defineConfig({})` call, replacing `<repo-name>` with the actual repo name from Step 3.
- If already correct, skip silently.

## Step 5 — Run the production build

Run `npm run build` using the Bash tool. If it fails, fix the error and retry before continuing.

## Step 6 — Commit all pending changes

Use the Bash tool to:
1. Run `git status` to check for uncommitted changes.
2. If there are changes, run:
   ```
   git add -A
   git commit -m "Deploy: update build and source files for GitHub Pages"
   ```
3. If there is nothing to commit, skip silently.

## Step 7 — Push to GitHub main branch

Run `git push origin main` using the Bash tool. If the push fails, report the error to the user.

## Step 8 — Deploy build/ to gh-pages branch

Use the Bash tool to push the `build/` directory to the `gh-pages` branch:

```
npx gh-pages -d build --dotfiles
```

If `gh-pages` is not installed, it will be fetched via npx automatically.

## Step 9 — Enable GitHub Pages (if not already enabled)

Run the following to configure GitHub Pages to serve from the `gh-pages` branch:
```
gh api repos/<owner>/<repo>/pages --method POST --field source[branch]=gh-pages --field source[path]=/ 2>&1
```

If the response contains "already enabled" or a 409 conflict error, skip silently — Pages is already configured.

## Step 10 — Report the live URL

The GitHub Pages URL follows this pattern: `https://<owner>.github.io/<repo>/`

Display the result to the user in this format:

```
Deployment complete.
Live URL: https://<owner>.github.io/<repo>/

Note: GitHub Pages may take 1–2 minutes to go live after the first deployment.
```
