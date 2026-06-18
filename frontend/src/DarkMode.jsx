import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DarkMode = () => {
    const { setTheme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl border border-border/60 hover:bg-accent hover:border-border transition-all duration-200"
                >
                    <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-amber-500" />
                    <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-primary" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="rounded-xl border-border/60 bg-popover/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-1.5"
                sideOffset={8}
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                    <Sun size={14} className="text-amber-500" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                >
                    <Moon size={14} className="text-primary" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-muted transition-colors"
                >
                    💻 System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DarkMode
