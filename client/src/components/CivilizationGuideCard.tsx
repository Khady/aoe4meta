import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CivilizationGuide, CivilizationKey } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getRankFromRating, getStandardModes, getEloModes } from "@/lib/rankUtils";

interface CivilizationGuideCardProps {
  guide: CivilizationGuide;
  title?: string;
  playerName?: string;
  playerProfileId?: number;
  rating?: number | null;
  mmr?: number | null;
  modes?: any;
  isOnHomePage?: boolean;
}

const civIconMap: Record<CivilizationKey, string> = {
  abbasid: "/civilization_flag/abb-large.webp",
  ayyubids: "/civilization_flag/ayy-large.webp",
  byzantines: "/civilization_flag/byz-large.webp",
  chinese: "/civilization_flag/chi-large.webp",
  delhi: "/civilization_flag/del-large.webp",
  english: "/civilization_flag/eng-large.webp",
  french: "/civilization_flag/fre-large.webp",
  holy_roman_empire: "/civilization_flag/hre-large.webp",
  japanese: "/civilization_flag/jap-large.webp",
  jeanne_darc: "/civilization_flag/jda-large.webp",
  malians: "/civilization_flag/mal-large.webp",
  mongols: "/civilization_flag/mon-large.webp",
  order_of_the_dragon: "/civilization_flag/dra-large.webp",
  ottomans: "/civilization_flag/ott-large.webp",
  rus: "/civilization_flag/rus-large.webp",
  zhu_xis_legacy: "/civilization_flag/zxl-large.webp",
  knights_templar: "/civilization_flag/kte-large.webp",
  house_of_lancaster: "/civilization_flag/hol-large.webp",
  macedonian_dynasty: "/civilization_flag/mac-large.webp",
  sengoku_daimyo: "/civilization_flag/sen-large.webp",
  golden_horde: "/civilization_flag/goh-large.webp",
  tughlaq_dynasty: "/civilization_flag/tug-large.webp",
};

const modeLabels: Record<string, string> = {
  // Standard ranked modes
  rm_solo: "Ranked 1v1",
  rm_team: "Ranked Team",
  rm_ffa: "Ranked FFA",
  
  // Quick match modes
  qm_1v1: "Quick Match 1v1",
  qm_2v2: "Quick Match 2v2",
  qm_3v3: "Quick Match 3v3",
  qm_4v4: "Quick Match 4v4",
  qm_ffa: "Quick Match FFA",
  
  // ELO modes
  rm_1v1_elo: "Ranked 1v1 ELO",
  rm_2v2_elo: "Ranked 2v2 ELO",
  rm_3v3_elo: "Ranked 3v3 ELO",
  rm_4v4_elo: "Ranked 4v4 ELO"
};

export default function CivilizationGuideCard({ guide, title, playerName, playerProfileId, rating, mmr, modes = {}, isOnHomePage = false }: CivilizationGuideCardProps) {
  const civIconPath = civIconMap[guide.key];
  
  // Determine the href for the anchor link
  const anchorHref = isOnHomePage ? `/guides/civilizations/#${guide.key}` : `#${guide.key}`;
  
  // Convert rating to rank label
  const rankInfo = getRankFromRating(rating);
  
  // Filter modes for tooltips
  const standardModes = getStandardModes(modes);
  const eloModes = getEloModes(modes);
  
  // Extract aoe4world and aoe4guides links from content
  const aoe4worldMatch = guide.content.match(/\[aoe4world\]\((https:\/\/aoe4world\.com\/[^)]+)\)/);
  const aoe4guidesMatch = guide.content.match(/\[aoe4guides\]\((https:\/\/aoe4guides\.com\/[^)]+)\)/);
  const aoe4worldUrl = aoe4worldMatch ? aoe4worldMatch[1] : null;
  const aoe4guidesUrl = aoe4guidesMatch ? aoe4guidesMatch[1] : null;
  
  // Remove the links line from content (first line with emoji and links)
  const contentWithoutLinks = guide.content.replace(/^🔗.*\n\n/, '');
  
  return (
    <Card id={guide.key} className="flex flex-col scroll-mt-24" data-testid={`card-civ-guide-${guide.key}`}>
      <CardHeader className="border-b border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3">
          <img 
            src={civIconPath} 
            alt={`${guide.name} flag`}
            className="w-20 h-20 object-contain"
            data-testid={`img-civ-flag-${guide.key}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl font-serif" data-testid={`text-card-title-${guide.key}`}>
                <a 
                  href={anchorHref}
                  className="hover:text-primary transition-colors"
                  data-testid={`link-anchor-${guide.key}`}
                >
                  {title || guide.name}
                </a>
              </CardTitle>
              <div className="flex items-center gap-1.5">
                {aoe4worldUrl && (
                  <a 
                    href={aoe4worldUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:opacity-80 transition-opacity"
                    data-testid="link-aoe4world-civ"
                  >
                    <img 
                      src="/logo/aoe4world-logo.png" 
                      alt="AoE4World"
                      className="w-4 h-4"
                    />
                  </a>
                )}
                {aoe4guidesUrl && (
                  <a 
                    href={aoe4guidesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:opacity-80 transition-opacity"
                    data-testid="link-aoe4guides-civ"
                  >
                    <img 
                      src="/logo/aoe4guides-logo.png" 
                      alt="AoE4Guides"
                      className="w-4 h-4"
                    />
                  </a>
                )}
              </div>
            </div>
            {playerName && (
              <div className="mt-1 space-y-1">
                <p className="text-sm text-foreground">
                  {playerProfileId ? (
                    <a 
                      href={`/#${playerProfileId}-${playerName}`}
                      className="hover:text-primary transition-colors"
                      data-testid={`link-player-${playerName}`}
                    >
                      {playerName}
                    </a>
                  ) : (
                    <span>{playerName}</span>
                  )}
                  {playerProfileId && (
                    <>
                      {' '}
                      <a 
                        href={`https://aoe4world.com/players/${playerProfileId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block hover:opacity-80 transition-opacity"
                        data-testid="link-aoe4world-profile"
                      >
                        <img 
                          src="/logo/aoe4world-logo.png" 
                          alt="AoE4World"
                          className="w-3 h-3 inline-block"
                        />
                      </a>
                    </>
                  )}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {rankInfo && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="cursor-help" data-testid="text-rank">
                        {rankInfo.shortLabel}
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold mb-2">Ratings by Mode:</p>
                          {Object.entries(standardModes).map(([modeKey, modeData]: [string, any]) => {
                            if (modeData?.rating != null) {
                              return (
                                <div key={modeKey} className="flex justify-between gap-4">
                                  <span>{modeLabels[modeKey] || modeKey}</span>
                                  <span className="font-mono text-right">{modeData.rating}</span>
                                </div>
                              );
                            }
                            return null;
                          }).filter(Boolean)}
                          {Object.keys(standardModes).length > 0 && Object.values(standardModes).every((m: any) => m?.rating == null) && (
                            <p className="text-muted-foreground">No ratings available</p>
                          )}
                          {Object.keys(standardModes).length === 0 && (
                            <p className="text-muted-foreground">No standard mode data available</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {mmr != null && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="cursor-help" data-testid="text-elo">
                        ELO: {mmr}
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold mb-2">ELO Ratings by Mode:</p>
                          {Object.entries(eloModes).map(([modeKey, modeData]: [string, any]) => {
                            if (modeData?.rating != null) {
                              return (
                                <div key={modeKey} className="flex justify-between gap-4">
                                  <span>{modeLabels[modeKey] || modeKey}</span>
                                  <span className="font-mono text-right">{modeData.rating}</span>
                                </div>
                              );
                            }
                            return null;
                          }).filter(Boolean)}
                          {Object.keys(eloModes).length > 0 && Object.values(eloModes).every((m: any) => m?.rating == null) && (
                            <p className="text-muted-foreground">No ELO ratings available</p>
                          )}
                          {Object.keys(eloModes).length === 0 && (
                            <p className="text-muted-foreground">No ELO mode data available</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 overflow-auto">
        <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-h2:text-base prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-4 first:prose-h2:mt-0 prose-h3:text-sm prose-h3:font-medium prose-h3:mb-2 prose-ul:my-2 prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contentWithoutLinks}
          </ReactMarkdown>
        </article>
      </CardContent>
    </Card>
  );
}
