import { modules } from "@/data/moduleRegistry";
import { ModuleCard } from "@/components/ModuleCard";
import { Plane } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Pilot Mental Trainer</h1>
            <p className="text-sm text-muted-foreground">Sharpen your in-flight calculations</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
