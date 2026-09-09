import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  addEntry,
  getEntries,
  FAMILY_TIME_OPTIONS,
  INCIDENT_OPTIONS,
  SLEEP_OPTIONS,
  WORKLOAD_OPTIONS,
  type CheckinEntry,
} from "@/lib/sahayak";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Self Check-in — Sahayak Wellness" },
      {
        name: "description",
        content:
          "A short, voluntary self check-in on how your day went. Private to you.",
      },
      { property: "og:title", content: "Self Check-in — Sahayak Wellness" },
      {
        property: "og:description",
        content: "Log how your day went in under a minute.",
      },
    ],
  }),
  component: AssessmentPage,
});

function OptionPills({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          aria-pressed={value === opt}
          className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors active:scale-[0.98] ${
            value === opt
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-secondary text-secondary-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function startOfWeekSunday(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return date;
}

function weekHasEntry(entries: CheckinEntry[], date: Date) {
  const weekStart = startOfWeekSunday(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return entries.some((e) => {
    const d = new Date(e.date);
    return d >= weekStart && d < weekEnd;
  });
}

function buildSuggestions(entry: CheckinEntry | undefined) {
  const s: string[] = [];
  const sleepLabel = entry?.sleepLabel;
  const workloadLabel = entry?.workloadLabel;
  const incident = entry?.incident;
  const familyTime = entry?.familyTime;

  if (["Less than 4 hours", "4–6 hours"].includes(sleepLabel ?? ""))
    s.push("Try the sleep hygiene guide to wind down gently before rest.");
  if (["Demanding", "Quite a lot", "More than expected"].includes(workloadLabel ?? ""))
    s.push("Progressive muscle relaxation can help you unwind after a demanding shift.");
  if (["Very difficult", "Somewhat difficult"].includes(incident ?? ""))
    s.push("A quick grounding exercise can help ease a tough moment.");
  if (["No time", "Less than 30 min"].includes(familyTime ?? ""))
    s.push("A short, calm moment with family can help you recharge.");

  if (s.length < 2) s.push("Box breathing is a calm way to ease tension anytime.");
  if (s.length < 3) s.push("Taking a brief pause for yourself can help you reset.");
  return s.slice(0, 3);
}

function AssessmentPage() {
  const [day, setDay] = useState("");
  const [familyTime, setFamilyTime] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [incident, setIncident] = useState("");
  const [incidentText, setIncidentText] = useState("");
  const [sleep, setSleep] = useState("");
  const [workload, setWorkload] = useState("");
  const [done, setDone] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  useEffect(() => {
    setAlreadyTaken(weekHasEntry(getEntries(), new Date()));
  }, []);

  const answers = {
    day: day.trim() !== "",
    family: familyTime.trim() !== "",
    work: workHours.trim() !== "" && Number(workHours) >= 0,
    incident: incident.trim() !== "" || incidentText.trim() !== "",
    sleep: sleep.trim() !== "",
    workload: workload.trim() !== "",
  };
  const complete = Object.values(answers).every(Boolean);
  const unanswered = Object.entries(answers)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  const analyze = () => {
    if (!complete) {
      toast(
        unanswered.length
          ? "Please answer the questions marked below."
          : "Please answer all questions to analyze your day.",
      );
      return;
    }

    const familyAnswer = familyTime;
    const sleepAnswer = sleep;
    const incidentAnswer = incidentText.trim() || incident;

    // Map answers onto the existing 1–5 scales the analysis system uses.
    const sleepMap: Record<string, number> = {
      "Less than 4 hours": 1,
      "4–6 hours": 2,
      "6–8 hours": 4,
      "8–10 hours": 5,
      "More than 10 hours": 4,
    };
    const workloadMap: Record<string, number> = {
      Light: 1,
      Manageable: 2,
      Balanced: 2,
      "Quite a lot": 4,
      Demanding: 4,
      "More than expected": 5,
    };
    const sleepNum = sleep
      ? { "Less than 4 hours": 3, "4–6 hours": 5, "6–8 hours": 7, "8–10 hours": 9, "More than 10 hours": 11 }[sleep]
      : 7;
    const sleepScore = sleepMap[sleep] ?? 3;
    const workloadScore = workloadMap[workload] ?? 3;
    const incidentScore = incidentAnswer
      ? { No: 5, "Minor incident": 4, "Somewhat difficult": 2, "Very difficult": 1 }[incidentAnswer] ?? 3
      : 3;
    const mood = Math.max(1, Math.min(5, Math.round((sleepScore + (6 - workloadScore) + incidentScore) / 3)));

    addEntry({
      mood,
      sleepHours: sleepNum ?? 7,
      workload: workloadScore,
      journalText: incidentText.trim(),
      ...(familyAnswer ? { familyTime: familyAnswer } : {}),
      ...(workHours ? { workHours: Number(workHours) } : {}),
      ...(incidentAnswer ? { incident: incidentAnswer } : {}),
      ...(sleepAnswer ? { sleepLabel: sleepAnswer } : {}),
      ...(workload ? { workloadLabel: workload } : {}),
      ...(day ? { dayAnswer: day } : {}),
    });
    toast.success("Saved. This stays private to you.");
    setDone(true);
  };

  const latest = getEntries()[getEntries().length - 1];
  const suggestions = buildSuggestions(latest);
  const nextSunday = new Date(startOfWeekSunday(new Date()));
  nextSunday.setDate(nextSunday.getDate() + 7);

  return (
    <AppShell title="Self Check-in">
      {() =>
        done || alreadyTaken ? (
          <Card className="rounded-3xl">
            <CardContent className="space-y-5 py-8 text-center">
              <div className="text-4xl">🌿</div>
              <p className="text-lg font-semibold">Thank you. This is private to you.</p>
              <p className="text-sm text-muted-foreground">
                Your entry has been added to the record. Nothing is shared with anyone
                unless you ask for support yourself.
              </p>
              <p className="text-sm text-muted-foreground">
                Next assessment:{" "}
                {nextSunday.toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>

              <div className="rounded-2xl bg-secondary px-4 py-4 text-left">
                <p className="mb-2 text-sm font-semibold text-foreground">Suggestions for You</p>
                <ul className="space-y-2">
                  {suggestions.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-muted-foreground">
                      <span>•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button asChild variant="secondary" className="h-12 w-full rounded-2xl">
                <Link to="/resources">View All Resources</Link>
              </Button>
              <Button asChild className="h-12 w-full rounded-2xl">
                <Link to="/home">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="space-y-1 pt-1">
              <h2 className="text-xl font-semibold text-foreground">A Moment for Yourself</h2>
              <p className="text-sm text-muted-foreground">
                Take a few moments to reflect on your week and check in with yourself.
              </p>
            </section>

            <Card className="rounded-3xl">
              <CardContent className="space-y-6">
                {/* 1. How was your day */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    How was your day?
                  </p>
                  <OptionPills
                    options={["Smooth", "Normal", "Busy", "Challenging"]}
                    value={day}
                    onSelect={setDay}
                  />
                  {!answers.day && (
                    <p className="text-xs text-muted-foreground">Please choose an option to continue.</p>
                  )}
                </div>

                {/* 2. Family time */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    How much time did you spend with your family today?
                  </p>
                  <OptionPills
                    options={FAMILY_TIME_OPTIONS}
                    value={familyTime}
                    onSelect={setFamilyTime}
                  />
                  {!answers.family && (
                    <p className="text-xs text-muted-foreground">Please choose an option to continue.</p>
                  )}
                </div>

                {/* 3. Working hours */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    How many hours did you spend working today?
                  </p>
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    placeholder="Enter hours, e.g. 8"
                    className="rounded-xl"
                  />
                  {!answers.work && (
                    <p className="text-xs text-muted-foreground">Please enter the number of hours.</p>
                  )}
                </div>

                {/* 4. Unexpected incident */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Did anything difficult or unexpected happen today?
                  </p>
                  <OptionPills
                    options={INCIDENT_OPTIONS}
                    value={incident}
                    onSelect={(v) => {
                      setIncident(v);
                      setIncidentText("");
                    }}
                  />
                  <Input
                    value={incidentText}
                    onChange={(e) => {
                      setIncidentText(e.target.value);
                      if (e.target.value.trim()) setIncident("");
                    }}
                    placeholder="Prefer to say it in your own words? Type here"
                    className="rounded-xl"
                  />
                  {!answers.incident && (
                    <p className="text-xs text-muted-foreground">
                      Please choose an option or write one in your own words.
                    </p>
                  )}
                </div>

                {/* 5. Sleep hours */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    How many hours did you sleep last night?
                  </p>
                  <OptionPills
                    options={SLEEP_OPTIONS}
                    value={sleep}
                    onSelect={setSleep}
                  />
                  {!answers.sleep && (
                    <p className="text-xs text-muted-foreground">Please choose an option to continue.</p>
                  )}
                </div>

                {/* 6. Workload */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    How did the workload feel?
                  </p>
                  <OptionPills
                    options={WORKLOAD_OPTIONS}
                    value={workload}
                    onSelect={setWorkload}
                  />
                  {!answers.workload && (
                    <p className="text-xs text-muted-foreground">Please choose an option to continue.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="h-14 w-full rounded-2xl text-base"
              disabled={!complete}
              onClick={analyze}
            >
              Analyze My Day
            </Button>
          </>
        )
      }
    </AppShell>
  );
}
