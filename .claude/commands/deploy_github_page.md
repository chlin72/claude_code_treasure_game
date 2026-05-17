Automatically build and deploy the Interactive Treasure Box Game to GitHub Pages. Run every step below using tool calls — do not ask the user for manual input at any point.

## Step 1 — Check GitHub CLI is installed

Run `gh --version` using the Bash tool.

- If the command **fails** (gh not found), inform the user:
  "GitHub CLI is not installed. Please install it from https://cli.github.com/, then re-run /deploy_github_page."
  Stop execution here.
- If installed, continue to Step 2 silently.

## Step 2 — Check GitHub CLI authentication

Run `gh auth status` using the Bash tool.

- If the output shows the user is **not logged in**, run:
  ```
  gh auth login --web
  ```
  Then inform the user: "Please complete the GitHub login in your browser, then re-run /deploy_github_page."
  Stop execution here.
- If already logged in, continue to Step 3 silently.

## Step 3 — Check if a remote GitHub repository exists

Run `git remote get-url origin` using the Bash tool.

- If the command **fails** (no remote set), create a new public repository:
  ```
  gh repo create <repo-name> --public --source=. --remote=origin --push
  ```
  Replace `<repo-name>` with the actual folder name from `basename $(pwd)`.
  Inform the user: "Created new GitHub repository and set as origin."
- If the remote already exists, continue to Step 4 silently.

## Step 4 — Detect the GitHub username and repo name

Run the following using the Bash tool:
```
gh repo view --json nameWithOwner --jq '.nameWithOwner'
gh repo view --json name --jq '.name'
```

Store `<owner>/<repo>` and `<repo>` for use in later steps.

## Step 5 — Run the production build with the correct base path

Run `npm run build` with `GITHUB_REPOSITORY` set so Vite generates the correct `/<repo>/` base path for GitHub Pages:

On Windows (PowerShell):
```
$env:GITHUB_REPOSITORY="<owner>/<repo>"; npm run build
```

Replace `<owner>/<repo>` with the value from Step 4. If the build fails, fix the error and retry.

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

Run the following using the Bash tool:
```
npx gh-pages -d build --dotfiles
```

`gh-pages` will be fetched via npx automatically if not installed.

## Step 9 — Enable GitHub Pages (if not already enabled)

Run the following to configure GitHub Pages to serve from the `gh-pages` branch:
```
gh api repos/<owner>/<repo>/pages --method POST --field source[branch]=gh-pages --field source[path]=/ 2>&1
```

If the response contains a 409 conflict error or "already enabled", skip silently — Pages is already configured.

## Step 10 — Report the live URL

Display the result to the user in this format:

```
Deployment complete.
Live URL: https://<owner>.github.io/<repo>/

Note: GitHub Pages may take 1–2 minutes to go live after the first deployment.
```
