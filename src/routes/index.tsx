import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, DEMO_USER } from "@/lib/sahayak";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahayak Wellness — A private wellness companion" },
      {
        name: "description",
        content:
          "A calm, private wellness companion for uniformed forces personnel: voluntary check-ins, your own trends, and confidential support.",
      },
      { property: "og:title", content: "Sahayak Wellness" },
      {
        property: "og:description",
        content: "Voluntary check-ins, your own trends, confidential support.",
      },
    ],
  }),
  component: Entry,
});

type Step = "splash" | "login" | "otp";

function Entry() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("splash");
  const [serviceId, setServiceId] = useState(DEMO_USER.serviceId);
  const [password, setPassword] = useState("demo1234");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s === "splash" ? "login" : s)), 1800);
    return () => clearTimeout(t);
  }, []);

  const verify = () => {
    signIn();
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 bg-gradient-to-b from-secondary to-background px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
          <ShieldCheck className="size-10" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-foreground">Sahayak Wellness</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A private space for your wellbeing. You choose what to share.
        </p>
      </div>

      {step === "login" && (
        <div className="space-y-4 rounded-3xl bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="sid">Service ID</Label>
            <Input
              id="sid"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="h-12 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">Password</Label>
            <Input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl"
            />
          </div>
          <Button
            onClick={() => setStep("otp")}
            size="lg"
            className="h-14 w-full rounded-2xl text-base"
          >
            Continue
          </Button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-4 rounded-3xl bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter the 6-digit code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-14 rounded-2xl text-center text-2xl tracking-[0.4em]"
            />
          </div>
          <Button onClick={verify} size="lg" className="h-14 w-full rounded-2xl text-base">
            Verify & enter
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo code: any six digits.
          </p>
        </div>
      )}

      {step === "splash" && (
        <p className="text-center text-sm text-muted-foreground">Taking a breath…</p>
      )}
    </div>
  );
}
