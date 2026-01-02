import { useState, useEffect } from "react";
import { Swords, Menu, Shield, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeroSectionProps {
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  showAttribution?: boolean;
}

export default function HeroSection({ children, rightContent, showAttribution = true }: HeroSectionProps) {
  const [currentPath, setCurrentPath] = useState('/');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);
  
  const isHome = currentPath === '/' || currentPath === '/index.html';
  const isCivilizations = currentPath.includes('/guides/civilizations');
  const isMaps = currentPath.includes('/guides/maps');

  const AttributionLink = ({ className = "" }: { className?: string }) => (
    <a 
      href="https://aoe4world.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ${className}`}
      data-testid="link-attribution-aoe4world"
    >
      <span>Match data from</span>
      <span className="font-medium">aoe4world.com</span>
    </a>
  );

  const NavigationMenu = ({ isMobile = false }: { isMobile?: boolean }) => (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={isMobile ? "sm:hidden" : ""} 
          data-testid={isMobile ? "button-menu-mobile" : "button-menu"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild disabled={isHome}>
          <a href="/" className="flex items-center gap-2 cursor-pointer" data-testid={isMobile ? "menu-home-mobile" : "menu-home"}>
            <Home className="h-4 w-4" />
            Home
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={isCivilizations}>
          <a href="/guides/civilizations/" className="flex items-center gap-2 cursor-pointer" data-testid={isMobile ? "menu-civilizations-mobile" : "menu-civilizations"}>
            <Shield className="h-4 w-4" />
            Civilization Guides
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={isMaps}>
          <a href="/guides/maps/" className="flex items-center gap-2 cursor-pointer" data-testid={isMobile ? "menu-maps-mobile" : "menu-maps"}>
            <MapPin className="h-4 w-4" />
            Map Guides
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="relative bg-gradient-to-b from-background via-background to-card/30 border-b border-primary/10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
            <a href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity" data-testid="link-home-logo">
              <Swords className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-serif font-bold text-foreground whitespace-nowrap">
                AoE4 Meta
              </h1>
            </a>
            
            <NavigationMenu isMobile={true} />
          </div>
          
          {showAttribution && (
            <AttributionLink className="sm:hidden" />
          )}
          
          <div className="flex-1 min-w-0">
            {children}
          </div>

          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {rightContent}
            {showAttribution && <AttributionLink />}
            <NavigationMenu isMobile={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
