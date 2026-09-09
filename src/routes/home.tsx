import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEntries, type CheckinEntry } from "@/lib/sahayak";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Sahayak Wellness" },
      {
        name: "description",
        content:
          "Your private wellness companion: log how you feel and see your own trend over the last week.",
      },
      { property: "og:title", content: "Home — Sahayak Wellness" },
      {
        property: "og:description",
        content: "A calm, private space to check in with yourself.",
      },
    ],
  }),
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function startOfWeekSunday(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return date;
}

function HomePage() {
  const [entries, setEntries] = useState<CheckinEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(getEntries());
    setReady(true);
  }, []);

  const anchor = ready ? startOfWeekSunday(new Date()) : null;
  const sundays = anchor
    ? [-2, -1, 0, 1, 2].map((off) => {
        const s = new Date(anchor);
        s.setDate(anchor.getDate() + off * 7);
        return s;
      })
    : [];

  const today = ready ? new Date() : null;

  const schedule = sundays.map((sunday) => {
    const weekEnd = new Date(sunday);
    weekEnd.setDate(sunday.getDate() + 7);
    const taken = entries.some((e) => {
      const d = new Date(e.date);
      return d >= sunday && d < weekEnd;
    });
    let status: "taken" | "missed" | "upcoming";
    if (taken) status = "taken";
    else if (today && weekEnd <= today) status = "missed";
    else status = "upcoming";
    return { sunday, status };
  });

  const currentWeekTaken = schedule[2]?.status === "taken";
  const nextUpcoming = schedule.find(({ status }) => status === "upcoming");

  const statusConfig = {
    taken: { icon: "✓", className: "text-emerald-600", label: "Taken" },
    missed: { icon: "✕", className: "text-muted-foreground", label: "Missed" },
    upcoming: { icon: "○", className: "text-primary", label: "Upcoming" },
  } as const;

  return (
    <AppShell title="Sahayak Wellness">
      {(user) => (
        <>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {greeting()}, {user.name.split(" ")[0]} 👋
            </p>
            <p className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              This is a voluntary stress analysis.
            </p>
          </div>

          {/* Welcome Section */}
          <section className="space-y-1 pt-2">
            <h2 className="text-xl font-semibold text-foreground">Take a moment for yourself.</h2>
            <p className="text-sm text-muted-foreground">
              A simple space to reflect, recharge, and stay connected with your well-being.
            </p>
          </section>

          {/* Wellness Resources */}
          <Card className="rounded-3xl">
            <CardContent className="space-y-3 p-6">
              <div className="text-3xl">🌿</div>
              <p className="text-base font-semibold text-foreground">Wellness Resources</p>
              <p className="text-sm text-muted-foreground">
                Explore simple techniques and resources for relaxation, sleep, and well-being.
              </p>
              <Button asChild className="w-full rounded-2xl">
                <Link to="/resources">Explore Resources</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Assessment Schedule */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">📅 Weekly Assessment Schedule</h2>
            <Card className="rounded-3xl">
              <CardContent className="space-y-3 p-6">
                {schedule.map(({ sunday, status }) => {
                  const cfg = statusConfig[status];
                  return (
                    <div
                      key={+sunday}
                      className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {sunday.toLocaleDateString(undefined, {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                      <span className={`flex items-center gap-1.5 text-sm font-medium ${cfg.className}`}>
                        <span>{cfg.icon}</span>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>

          {/* Assessment Card */}
          <Card className="rounded-3xl">
            <CardContent className="space-y-3 p-6 text-center">
              {currentWeekTaken ? (
                <>
                  <p className="text-base font-semibold text-foreground">
                    This week's assessment is complete ✓
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nextUpcoming
                      ? `Next assessment: ${nextUpcoming.sunday.toLocaleDateString(undefined, {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })} — Upcoming`
                      : "You're all caught up. See you next week."}
                  </p>
                  <Button asChild size="lg" variant="secondary" className="h-14 w-full rounded-2xl text-base">
                    <Link to="/resources">Explore Resources</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-base font-semibold text-foreground">
                    Ready to take your assessment?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Take a few moments to complete your assessment and reflect on your day.
                  </p>
                  <Button asChild size="lg" className="h-14 w-full rounded-2xl text-base">
                    <Link to="/assessment">Start Assessment</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppShell>
  );
}
