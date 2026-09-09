import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/lib/sahayak";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Privacy — Sahayak Wellness" },
      {
        name: "description",
        content:
          "Your service details and how Sahayak Wellness handles what you choose to log.",
      },
      { property: "og:title", content: "Profile & Privacy — Sahayak Wellness" },
      {
        property: "og:description",
        content: "Clear, plain-language privacy for personnel.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <AppShell title="Profile">
      {(user) => (
        <>
          <Card className="rounded-3xl">
            <CardContent className="space-y-4 py-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-semibold text-primary">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="space-y-3">
                <ProfileField label="Full Name" value={user.name} />
                <ProfileField label="Email Address" placeholder />
                <ProfileField label="Role" value={user.role} />
                <ProfileField label="Phone Number" placeholder />
                <ProfileField label="Location" placeholder />
                <ProfileField label="Professional Summary" placeholder multiline />
                <ProfileField label="Work History" placeholder multiline />
                <ProfileField label="Education" placeholder multiline />
                <ProfileField label="Languages" placeholder multiline />
                <ProfileField label="Medical Reports" placeholder multiline />
                <Row label="Service ID" value={user.serviceId} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Your privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Your check-ins are private and used only to show you your own trends and to
                help Welfare Officers offer voluntary support — never for discipline, and
                never shared as an individual score without your own support request.
              </p>
              <p>
                Everything in this app is entered by you, deliberately. The app does not
                listen, track your location, or collect anything in the background.
              </p>
              <p>
                Profile details are filled automatically from the uploaded dataset and are
                editable before saving.
              </p>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            size="lg"
            className="h-14 w-full rounded-2xl text-base"
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
          >
            Log out
          </Button>
        </>
      )}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function ProfileField({
  label,
  value,
  placeholder,
  multiline,
}: {
  label: string;
  value?: string;
  placeholder?: boolean;
  multiline?: boolean;
}) {
  if (placeholder) {
    return (
      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div
          className={`mt-1 rounded-2xl border border-dashed border-border bg-secondary/40 px-3 ${
            multiline ? "py-3" : "py-2"
          } text-sm text-muted-foreground`}
        >
          <span className="italic">Auto-filled from uploaded dataset</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
