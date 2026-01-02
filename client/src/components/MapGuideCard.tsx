import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MapGuide } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MapGuideCardProps {
  guide: MapGuide;
  isOnHomePage?: boolean;
}

export default function MapGuideCard({ guide, isOnHomePage = false }: MapGuideCardProps) {
  const mapId = guide.name.toLowerCase().replace(/\s+/g, '-');
  
  // Determine the href for the anchor link
  const anchorHref = isOnHomePage ? `/guides/maps/#${mapId}` : `#${mapId}`;
  
  return (
    <Card id={mapId} className="h-full flex flex-col scroll-mt-24" data-testid={`card-map-guide-${mapId}`}>
      <CardHeader className="border-b border-chart-1/20 bg-chart-1/5">
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
              >
                {guide.name}
              </a>
            </CardTitle>
            <Badge variant="outline" className="text-xs mt-1">
              {guide.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 overflow-auto">
        <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-h2:text-base prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-4 first:prose-h2:mt-0 prose-h3:text-sm prose-h3:font-medium prose-h3:mb-2 prose-ul:my-2 prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {guide.content}
          </ReactMarkdown>
        </article>
      </CardContent>
    </Card>
  );
}
