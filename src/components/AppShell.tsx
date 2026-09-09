import { Link, useNavigate } from "@tanstack/react-router";
import { Home, ClipboardList, LifeBuoy, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { getSession, type SahayakUser } from "@/lib/sahayak";

const tabs = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/assessment", label: "Assessment", Icon: ClipboardList },
  { to: "/resources", label: "Resources", Icon: LifeBuoy },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: (user: SahayakUser) => ReactNode;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<SahayakUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    setUser(session);
    setReady(true);
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/90 px-5 py-4 backdrop-blur">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </header>

      <main className="flex-1 space-y-5 px-5 pb-28 pt-5">
        {ready && user ? children(user) : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md items-stretch border-t border-border/60 bg-card px-2 py-2">
        {tabs.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs text-muted-foreground transition-colors data-[status=active]:bg-secondary data-[status=active]:text-primary"
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
