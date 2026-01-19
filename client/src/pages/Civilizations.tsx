import { useState, useEffect } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import CivilizationGuideCard from "@/components/CivilizationGuideCard";
import { civilizationGuides } from "@/lib/guides";

export default function Civilizations() {
  const [civSearch, setCivSearch] = useState("");
  const [defaultFolded, setDefaultFolded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('defaultFolded') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('defaultFolded', String(defaultFolded));
  }, [defaultFolded]);

  useEffect(() => {
    document.title = "Civilization Guides - AoE4 Meta";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Browse comprehensive strategy guides for all Age of Empires 4 civilizations. Learn builds, counters, and winning strategies.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Browse comprehensive strategy guides for all Age of Empires 4 civilizations. Learn builds, counters, and winning strategies.';
      document.head.appendChild(meta);
    }

    return () => {
      document.title = 'AoE4 Meta';
    };
  }, []);

  useEffect(() => {
    const scrollToAnchor = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    const timeout = setTimeout(scrollToAnchor, 100);
    window.addEventListener('hashchange', scrollToAnchor);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('hashchange', scrollToAnchor);
    };
  }, []);

  const civGuidesList = Object.values(civilizationGuides);

  const filteredCivs = civGuidesList.filter(guide =>
    guide.name.toLowerCase().includes(civSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <HeroSection 
        showAttribution={false}
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant={defaultFolded ? "default" : "outline"}
              size="icon"
              onClick={() => setDefaultFolded(!defaultFolded)}
              data-testid="button-fold-toggle"
              title={defaultFolded ? "Cards are folded by default (click to expand)" : "Cards are expanded by default (click to fold)"}
              className="shrink-0"
            >
              {defaultFolded ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <p className="text-xs text-muted-foreground whitespace-nowrap" data-testid="text-civ-count">
              {filteredCivs.length} civilization{filteredCivs.length !== 1 ? 's' : ''}
            </p>
          </div>
        }
      >
        <Input
          type="text"
          placeholder="Search civilizations..."
          value={civSearch}
          onChange={(e) => setCivSearch(e.target.value)}
          className="h-10"
          data-testid="input-search-civilizations"
        />
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCivs.map((guide) => (
              <CivilizationGuideCard key={guide.key} guide={guide} defaultFolded={defaultFolded} />
            ))}
          </div>

          {filteredCivs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-civ-empty">No civilizations found matching "{civSearch}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
