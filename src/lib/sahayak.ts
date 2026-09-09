/**
 * Local (DEMO_MODE) data layer. Mirrors the Firestore document shapes so the
 * same calls can be swapped for Firestore reads/writes later.
 *
 * Everything written here is entered deliberately by the person using the app.
 * There is no background, passive or hidden collection of any kind.
 */

export type SahayakUser = {
  userId: string;
  name: string;
  serviceId: string;
  role: string;
};

export type CheckinEntry = {
  entryId: string;
  date: string; // ISO
  mood: number; // 1-5
  sleepHours: number; // 0-12
  workload: number; // 1-5
  journalText: string;
  // Daily reflection answers (Home check-in). All optional, all voluntary.
  familyTime?: string; // e.g. "30-60 min" or free text
  workHours?: number; // hours spent working
  incident?: string; // "No" | "Minor incident" | ... | free text
  sleepLabel?: string; // chosen sleep range label
  workloadLabel?: string; // chosen workload label
  dayAnswer?: string; // "Smooth" | "Normal" | "Busy" | "Challenging"
};

export type SupportRequest = {
  requestId: string;
  userId: string; // or "anonymous"
  timestamp: string;
  status: "new" | "acknowledged" | "closed";
  message: string;
};

const SESSION_KEY = "sahayak.session";
const ENTRIES_KEY = "sahayak.entries";
const REQUESTS_KEY = "sahayak.supportRequests";

export const DEMO_USER: SahayakUser = {
  userId: "demo-arjun",
  name: "Arjun Mehta",
  serviceId: "CAPF-48219",
  role: "Constable / 12th Battalion",
};

export const MOODS = [
  { value: 1, emoji: "😔", label: "Low" },
  { value: 2, emoji: "😕", label: "Off" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export const FAMILY_TIME_OPTIONS = [
  "No time",
  "Less than 30 min",
  "30–60 min",
  "1–2 hours",
  "2–4 hours",
  "More than 4 hours",
];

export const INCIDENT_OPTIONS = [
  "No",
  "Minor incident",
  "Somewhat difficult",
  "Very difficult",
];

export const SLEEP_OPTIONS = [
  "Less than 4 hours",
  "4–6 hours",
  "6–8 hours",
  "8–10 hours",
  "More than 10 hours",
];

export const WORKLOAD_OPTIONS = [
  "Light",
  "Manageable",
  "Balanced",
  "Quite a lot",
  "Demanding",
  "More than expected",
];

const canStore = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!canStore()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------- session ---------------- */

export function getSession(): SahayakUser | null {
  return read<SahayakUser | null>(SESSION_KEY, null);
}

export function signIn(): SahayakUser {
  write(SESSION_KEY, DEMO_USER);
  seedIfEmpty();
  return DEMO_USER;
}

export function signOut() {
  if (canStore()) window.localStorage.removeItem(SESSION_KEY);
}

/* ---------------- check-ins ---------------- */

export function getEntries(): CheckinEntry[] {
  return read<CheckinEntry[]>(ENTRIES_KEY, []).sort(
    (a, b) => +new Date(a.date) - +new Date(b.date),
  );
}

export function addEntry(entry: Omit<CheckinEntry, "entryId" | "date">) {
  const entries = read<CheckinEntry[]>(ENTRIES_KEY, []);
  entries.push({
    ...entry,
    entryId: `e-${Date.now()}`,
    date: new Date().toISOString(),
  });
  write(ENTRIES_KEY, entries.slice(-60));
}

/* ---------------- support requests ---------------- */

export function getSupportRequests(): SupportRequest[] {
  return read<SupportRequest[]>(REQUESTS_KEY, []);
}

export function addSupportRequest(input: { anonymous: boolean; message: string }) {
  const list = read<SupportRequest[]>(REQUESTS_KEY, []);
  const req: SupportRequest = {
    requestId: `r-${Date.now()}`,
    userId: input.anonymous ? "anonymous" : DEMO_USER.userId,
    timestamp: new Date().toISOString(),
    status: "new",
    message: input.message,
  };
  list.push(req);
  write(REQUESTS_KEY, list);
  return req;
}

/* ---------------- demo seed ---------------- */

function seedIfEmpty() {
  if (read<CheckinEntry[]>(ENTRIES_KEY, []).length > 0) return;
  const seed: CheckinEntry[] = [3, 4, 3, 4, 5, 4, 4].map((mood, i) => ({
    entryId: `seed-${i}`,
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
    mood,
    sleepHours: 5 + (i % 3),
    workload: 3,
    journalText: "",
  }));
  write(ENTRIES_KEY, seed);
}
