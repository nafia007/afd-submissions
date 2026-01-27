
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Sunset, Waves, Trees, Zap, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "gold-dark", icon: Crown, label: "Gold & Dark" },
    { name: "afrofuturistic", icon: Zap, label: "Afrofuturistic" },
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "sunset", icon: Sunset, label: "Sunset" },
    { name: "ocean", icon: Waves, label: "Ocean" },
    { name: "forest", icon: Trees, label: "Forest" },
  ] as const;

  const activeTheme = themes.find((t) => t.name === theme) || themes[0];
  const ActiveIcon = activeTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-background border border-border hover:bg-accent/10 hover:text-accent"
        >
          <ActiveIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[140px] bg-background border-2 border-border shadow-lg z-50"
      >
        {themes.map(({ name, icon: Icon, label }) => (
          <DropdownMenuItem
            key={name}
            onClick={() => setTheme(name)}
            className={`gap-2 font-medium transition-colors ${
              theme === name 
                ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                : 'hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
