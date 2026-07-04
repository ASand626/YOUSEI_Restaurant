const KEY_KNOWN_USERS = "fr-known-users-v1";
const KEY_CURRENT_USER = "fr-current-user-v1";

/** Usernames that have ever registered on this device. */
export function getKnownUsers(): string[] {
  try {
    const raw = localStorage.getItem(KEY_KNOWN_USERS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveKnownUsers(users: string[]) {
  try {
    localStorage.setItem(KEY_KNOWN_USERS, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

export function getCurrentUser(): string | null {
  try {
    return localStorage.getItem(KEY_CURRENT_USER);
  } catch {
    return null;
  }
}

/**
 * Logs in as `username`. If this device has never seen that name before,
 * it is registered as a brand-new profile with empty progress.
 */
export function loginOrRegister(username: string): void {
  const users = getKnownUsers();
  if (!users.includes(username)) {
    saveKnownUsers([...users, username]);
  }
  try {
    localStorage.setItem(KEY_CURRENT_USER, username);
  } catch {
    /* ignore */
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(KEY_CURRENT_USER);
  } catch {
    /* ignore */
  }
}

/** Namespaces a storage key to `username`, so each profile keeps separate progress. */
export function userScopedKey(baseKey: string, username: string): string {
  return `${baseKey}:${username}`;
}
