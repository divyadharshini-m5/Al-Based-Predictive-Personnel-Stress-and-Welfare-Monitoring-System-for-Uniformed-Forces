import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addSupportRequest, getSupportRequests } from "@/lib/sahayak";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Support — Sahayak Wellness" },
      {
        name: "description",
        content:
          "Breathing exercises, sleep hygiene, stress-relief techniques, helplines and a confidential support request.",
      },
      { property: "og:title", content: "Resources & Support — Sahayak Wellness" },
      {
        property: "og:description",
        content: "Calming techniques and confidential, voluntary support.",
      },
    ],
  }),
  component: ResourcesPage,
});

const guides = [
  {
    title: "Box breathing (4 minutes)",
    body: "Sit comfortably. Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat for eight rounds. Useful before sleep or after a long duty shift.",
  },
  {
    title: "Sleep hygiene basics",
    body: "Keep a consistent sleep and wake time even on rotating duty. Dim lights an hour before rest, keep the room cool and dark, and avoid tea, coffee or screens close to bedtime. A short wind-down routine signals your body it is safe to rest.",
  },
  {
    title: "Grounding when tension rises",
    body: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell and 1 you can taste. Slows racing thoughts within a couple of minutes.",
  },
  {
    title: "Progressive muscle relaxation",
    body: "Starting at your feet, tense each muscle group for 5 seconds, then release for 10. Work upward to your shoulders and jaw. Excellent after long standing duties.",
  },
];

const helplines = [
  { name: "Unit Welfare Helpline", number: "1800-000-0000" },
  { name: "24x7 Counselling Line", number: "1800-111-1111" },
  { name: "Tele-MANAS (placeholder)", number: "14416" },
];

function ResourcesPage() {
  const [open, setOpen] = useState(false);
  const [anon, setAnon] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submittedToday, setSubmittedToday] = useState(
    () =>
      getSupportRequests().some(
        (r) => new Date(r.timestamp).toDateString() === new Date().toDateString(),
      ),
  );

  const send = () => {
    addSupportRequest({ anonymous: anon, message });
    setSent(true);
    setOpen(false);
    setMessage("");
    setSubmittedToday(true);
  };

  return (
    <AppShell title="Resources">
      {() => (
        <>
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Calming practices</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {guides.map((g) => (
                  <AccordionItem key={g.title} value={g.title}>
                    <AccordionTrigger className="text-left text-sm">{g.title}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {g.body}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Voluntary Counselling</CardTitle>
              <p className="text-xs text-muted-foreground">
                Confidential counselling support is available if you would like to talk to someone.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {helplines.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-4"
                >
                  <span className="text-sm font-medium">{h.name}</span>
                  <span className="flex items-center gap-2 text-sm text-primary">
                    <Phone className="size-4" /> {h.number}
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Request Support</CardTitle>
              <p className="text-xs text-muted-foreground">
                A Welfare Officer will reach out only because you asked. You can stay
                anonymous.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {submittedToday ? (
                <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                  {sent
                    ? `Your request has been sent${anon ? " anonymously" : ""}. You can submit another request tomorrow.`
                    : "You've already submitted a request today. You can submit another response after 24 hours."}
                </p>
              ) : sent ? (
                <p className="rounded-2xl bg-accent px-4 py-3 text-sm text-accent-foreground">
                  Your request has been sent{anon ? " anonymously" : ""}.
                </p>
              ) : null}
              {!submittedToday &&
                (open ? (
                  <>
                    <Textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What would help right now? (optional)"
                      className="rounded-2xl"
                    />
                    <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
                      <span className="text-sm">Send anonymously</span>
                      <Switch checked={anon} onCheckedChange={setAnon} />
                    </div>
                    <Button onClick={send} className="h-13 w-full rounded-2xl py-4">
                      Send request
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setOpen(true);
                      setSent(false);
                    }}
                    size="lg"
                    className="h-14 w-full rounded-2xl text-base"
                  >
                    Request Support
                  </Button>
                ))}
            </CardContent>
          </Card>
        </>
      )}
    </AppShell>
  );
}
