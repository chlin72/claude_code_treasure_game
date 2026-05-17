// Auth and score persistence module using localStorage and Web Crypto API (SHA-256)

export interface StoredUser {
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  username: string;
  loginAt: string;
}

export interface ScoreRecord {
  username: string;
  score: number;
  result: 'win' | 'tie';
  playedAt: string;
}

const USERS_KEY = 'treasure_hunt_users';
const SESSION_KEY = 'treasure_hunt_session';
const SCORES_KEY = 'treasure_hunt_scores';

// Hashes a plain-text password using SHA-256 via Web Crypto API and returns a lowercase hex string.
// Input: password (string) — raw password. Output: Promise<string> — hex-encoded digest.
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Reads and parses the full user registry from localStorage.
// Input: none. Output: StoredUser[] — empty array if key absent or parse fails.
function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

// Persists the full user registry to localStorage.
// Input: users (StoredUser[]). Output: void.
function setUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Writes an AuthSession to localStorage.
// Input: session (AuthSession). Output: void.
function setSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Registers a new user account after validating username uniqueness and hashing the password.
// Input: username (string), password (string). Output: Promise resolving to success+session or error string.
export async function signUp(
  username: string,
  password: string
): Promise<{ success: true; session: AuthSession } | { success: false; error: string }> {
  const normalized = username.trim().toLowerCase();
  const users = getUsers();

  if (users.some(u => u.username === normalized)) {
    return { success: false, error: 'Username already taken.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = { username: normalized, passwordHash, createdAt: new Date().toISOString() };
  setUsers([...users, newUser]);

  const session: AuthSession = { username: normalized, loginAt: new Date().toISOString() };
  setSession(session);
  return { success: true, session };
}

// Authenticates a user by comparing the hashed password against the stored hash.
// Input: username (string), password (string). Output: Promise resolving to success+session or error string.
export async function signIn(
  username: string,
  password: string
): Promise<{ success: true; session: AuthSession } | { success: false; error: string }> {
  const normalized = username.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(u => u.username === normalized);

  if (!user) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const session: AuthSession = { username: normalized, loginAt: new Date().toISOString() };
  setSession(session);
  return { success: true, session };
}

// Clears the active session from localStorage.
// Input: none. Output: void.
export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Retrieves the currently stored session, or null if none exists.
// Input: none. Output: AuthSession | null.
export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Reads all score records from localStorage, filtered and sorted newest-first.
// Input: username (string | null) — filter by user if provided. Output: ScoreRecord[].
export function getScores(username: string | null): ScoreRecord[] {
  try {
    const all: ScoreRecord[] = JSON.parse(localStorage.getItem(SCORES_KEY) ?? '[]');
    const filtered = username ? all.filter(r => r.username === username) : all;
    return filtered.sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  } catch {
    return [];
  }
}

// Persists the full scores list to localStorage.
// Input: scores (ScoreRecord[]). Output: void.
function setScores(scores: ScoreRecord[]): void {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

// Appends a new score record for a signed-in user to localStorage.
// Input: username (string), score (number) — final game score. Output: void.
export function saveScore(username: string, score: number): void {
  const record: ScoreRecord = {
    username,
    score,
    result: score > 0 ? 'win' : 'tie',
    playedAt: new Date().toISOString(),
  };
  const existing = getScores(null);
  setScores([...existing, record]);
}
