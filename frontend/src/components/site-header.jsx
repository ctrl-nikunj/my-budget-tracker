import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import GlobalCommand from "./GlobalCommand"; // Capital G here
import { useState, useEffect } from "react";

export default function SiteHeader({ name }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        setOpen((prev) => !prev); // Toggle Command Palette
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="flex justify-center items-center px-4 py-2 border-b relative">
      <div className="absolute left-4 flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="h-4 mx-2 text-muted-foreground"
        />
        <h1 className="text-base font-medium">{name}</h1>
      </div>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-muted/50 hover:bg-muted px-2 py-1 cursor-pointer transition-all duration-300 w-[120px] md:w-[250px] focus-within:w-[250px]"
      >
        <span className="text-muted-foreground text-sm truncate">
          Search or run command…
        </span>
        <kbd className="ml-auto rounded bg-muted px-1 text-xs">Ctrl+J</kbd>
      </div>

      {/* Pass open & setOpen to GlobalCommand */}
      <GlobalCommand
        open={open}
        setOpen={setOpen}
      />
    </header>
  );
}
