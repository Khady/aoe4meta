import { useState, useEffect } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MapGuide } from "@/lib/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MapGuideCardProps {
  guide: MapGuide;
  isOnHomePage?: boolean;
  defaultFolded?: boolean;
}

export default function MapGuideCard({ guide, isOnHomePage = false, defaultFolded = false }: MapGuideCardProps) {
  const [isFolded, setIsFolded] = useState(defaultFolded);
  
  useEffect(() => {
    setIsFolded(defaultFolded);
  }, [defaultFolded]);
  
  const mapId = guide.name.toLowerCase().replace(/\s+/g, '-');
  
  // Determine the href for the anchor link
  const anchorHref = isOnHomePage ? `/guides/maps/#${mapId}` : `#${mapId}`;
  
  return (
    <Card id={mapId} className="h-full flex flex-col scroll-mt-24" data-testid={`card-map-guide-${mapId}`}>
      <CardHeader 
        className="border-b border-chart-1/20 bg-chart-1/5 cursor-pointer select-none hover:bg-chart-1/10 transition-colors"
        onClick={() => setIsFolded(!isFolded)}
        data-testid={`card-header-${mapId}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-chart-1/20 border-2 border-chart-1/40 flex items-center justify-center shrink-0">
            <MapPin className="h-6 w-6 text-chart-1" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-serif">
              <a 
                href={anchorHref}
                className="hover:text-primary transition-colors"
                data-testid={`link-anchor-${mapId}`}
                onClick={(e) => e.stopPropagation()}
              >
                {guide.name}
              </a>
            </CardTitle>
            <Badge variant="outline" className="text-xs mt-1">
              {guide.type}
            </Badge>
          </div>
          <div className="flex items-center shrink-0">
            {isFolded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" data-testid={`chevron-down-${mapId}`} />
            ) : (
              <ChevronUp className="h-5 w-5 text-muted-foreground" data-testid={`chevron-up-${mapId}`} />
            )}
          </div>
        </div>
      </CardHeader>
      
      {!isFolded && (
        <CardContent className="flex-1 p-6 overflow-auto">
          <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-h2:text-base prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-4 first:prose-h2:mt-0 prose-h3:text-sm prose-h3:font-medium prose-h3:mb-2 prose-ul:my-2 prose-li:my-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide.content}
            </ReactMarkdown>
          </article>
        </CardContent>
      )}
    </Card>
  );
}
