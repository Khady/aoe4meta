import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import type { CivilizationGuide, CivilizationKey } from "@/lib/schema";
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
  maxRating?: number | null;
  maxRatingElo?: number | null;
  modes?: any;
  currentLeaderboard?: string | null;
  isOnHomePage?: boolean;
  defaultFolded?: boolean;
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
  rm_1v1: "Ranked 1v1",
  rm_2v2: "Ranked 2v2",
  rm_3v3: "Ranked 3v3",
  rm_4v4: "Ranked 4v4",
  rm_team: "Ranked Team",
  rm_ffa: "Ranked FFA",
  
  // Quick match modes
  qm_1v1: "Quick Match 1v1",
  qm_2v2: "Quick Match 2v2",
  qm_3v3: "Quick Match 3v3",
  qm_4v4: "Quick Match 4v4",
  qm_ffa: "Quick Match FFA",
  
  // ELO modes (for display when showing standalone)
  rm_1v1_elo: "Ranked 1v1",
  rm_2v2_elo: "Ranked 2v2",
  rm_3v3_elo: "Ranked 3v3",
  rm_4v4_elo: "Ranked 4v4"
};

const standardToEloMap: Record<string, string> = {
  rm_solo: "rm_1v1_elo",
  rm_1v1: "rm_1v1_elo",
  rm_2v2: "rm_2v2_elo",
  rm_3v3: "rm_3v3_elo",
  rm_4v4: "rm_4v4_elo",
};

const eloToStandardMap: Record<string, string> = {
  rm_1v1_elo: "rm_solo",
  rm_2v2_elo: "rm_2v2",
  rm_3v3_elo: "rm_3v3",
  rm_4v4_elo: "rm_4v4",
};

export default function CivilizationGuideCard({ guide, title, playerName, playerProfileId, rating, mmr, maxRating, maxRatingElo, modes = {}, currentLeaderboard, isOnHomePage = false, defaultFolded = false }: CivilizationGuideCardProps) {
  const [isFolded, setIsFolded] = useState(defaultFolded);
  
  useEffect(() => {
    setIsFolded(defaultFolded);
  }, [defaultFolded]);
  
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
    <TooltipProvider delayDuration={0}>
      <Card id={guide.key} className="flex flex-col scroll-mt-24" data-testid={`card-civ-guide-${guide.key}`}>
        <CardHeader 
          className="border-b border-primary/20 bg-primary/5 py-3 px-4 cursor-pointer select-none hover:bg-primary/10 transition-colors"
          onClick={() => setIsFolded(!isFolded)}
          data-testid={`card-header-${guide.key}`}
        >
        <div className="flex items-start gap-2">
          <img 
            src={civIconPath} 
            alt={`${guide.name} flag`}
            className="w-12 h-12 object-contain shrink-0"
            data-testid={`img-civ-flag-${guide.key}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <CardTitle className="text-base font-serif" data-testid={`text-card-title-${guide.key}`}>
                <a 
                  href={anchorHref}
                  className="hover:text-primary transition-colors"
                  data-testid={`link-anchor-${guide.key}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {title || guide.name}
                </a>
              </CardTitle>
              <div className="flex items-center gap-1">
                {aoe4worldUrl && (
                  <a href={aoe4worldUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80" data-testid="link-aoe4world-civ" onClick={(e) => e.stopPropagation()}>
                    <img src="/logo/aoe4world-logo.png" alt="AoE4World" className="w-3.5 h-3.5" />
                  </a>
                )}
                {aoe4guidesUrl && (
                  <a href={aoe4guidesUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80" data-testid="link-aoe4guides-civ" onClick={(e) => e.stopPropagation()}>
                    <img src="/logo/aoe4guides-logo.png" alt="AoE4Guides" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              {playerName && (
                <span className="text-xs text-muted-foreground">
                  {playerProfileId ? (
                    <a 
                      href={`/#${playerProfileId}-${playerName}`}
                      className="hover:text-primary transition-colors text-foreground"
                      data-testid={`link-player-${playerName}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {playerName}
                    </a>
                  ) : (
                    <span className="text-foreground">{playerName}</span>
                  )}
                </span>
              )}
              <div className="flex items-center gap-1">
                {playerProfileId && (
                  <a href={`https://aoe4world.com/players/${playerProfileId}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80" data-testid="link-aoe4world-profile" onClick={(e) => e.stopPropagation()}>
                    <img src="/logo/aoe4world-logo.png" alt="Profile" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
            {/* Compact ratings chips */}
            {playerName && (Object.keys(standardModes).some((k) => (standardModes as any)[k]?.rating != null) || 
              Object.keys(eloModes).some((k) => (eloModes as any)[k]?.rating != null)) && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {Object.entries(standardModes).map(([modeKey, modeData]: [string, any]) => {
                  if (modeKey === 'rm_1v1' && modes['rm_solo']?.rating != null) return null;
                  if (modeData?.rating == null) return null;
                  
                  const isCurrentGame = modeKey === currentLeaderboard || 
                    (modeKey === 'rm_solo' && currentLeaderboard === 'rm_1v1') ||
                    (modeKey === 'rm_1v1' && currentLeaderboard === 'rm_solo');
                  const rankInfo = getRankFromRating(modeData.rating);
                  const eloModeKey = standardToEloMap[modeKey];
                  const eloData = eloModeKey ? eloModes[eloModeKey] : null;
                  
                  return (
                    <Tooltip key={modeKey}>
                      <TooltipTrigger asChild>
                        <span 
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] cursor-default ${
                            isCurrentGame 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted/50 text-muted-foreground border border-border/50'
                          }`}
                        >
                          <span>{modeLabels[modeKey] || modeKey}:</span>
                          <span className={isCurrentGame ? 'text-primary-foreground' : 'text-foreground/80'}>{rankInfo?.shortLabel ?? '-'}</span>
                          <span className={isCurrentGame ? 'text-primary-foreground/70' : 'text-muted-foreground'}>·</span>
                          <span className={`font-mono ${isCurrentGame ? 'text-primary-foreground' : 'text-foreground/80'}`}>{modeData.rating}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-0.5 font-normal">
                          <div className="font-medium mb-2.5 mt-2 text-muted-foreground uppercase tracking-wider text-xs">Rank</div>
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              <tr>
                                <td className="py-0.5 pr-4 text-[#1c1e22]">Current</td>
                                <td className="py-0.5 pr-4 text-[#1c1e22]">{rankInfo?.shortLabel ?? '-'}</td>
                                <td className="py-0.5 text-right font-mono text-[#1c1e22]">
                                  {modeData.games_count != null ? `${modeData.wins_count ?? 0}W-${modeData.losses_count ?? 0}L` : ''}
                                </td>
                              </tr>
                              {modeData.previous_seasons?.length > 0 && 
                                modeData.previous_seasons.slice(0, 6).map((season: any) => (
                                  <tr key={season.season}>
                                    <td className="py-0.5 pr-4 text-muted-foreground">S{season.season}</td>
                                    <td className="py-0.5 pr-4 text-[#505662]">
                                      {season.rank_level?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? '-'}
                                    </td>
                                    <td className="py-0.5 text-right text-muted-foreground font-mono text-[10px]">
                                      {season.games_count != null ? `${season.wins_count ?? 0}W-${season.losses_count ?? 0}L` : ''}
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                          <div className="h-2"></div>
                          <div className="border-t border-gray-300"></div>
                          <div className="h-2"></div>
                          <div className="font-medium mb-2.5 text-muted-foreground uppercase tracking-wider text-xs">Statistics</div>
                          <table className="w-full border-collapse font-mono text-xs">
                            <thead>
                              <tr className="border-b border-border/30">
                                <th className="py-1 pr-2 font-sans text-left font-normal text-muted-foreground">Type</th>
                                <th className="py-1 px-2 text-right font-sans font-normal text-muted-foreground">Now</th>
                                <th className="py-1 px-2 text-right font-sans font-normal text-muted-foreground">Max</th>
                                <th className="py-1 px-2 text-right font-sans font-normal text-muted-foreground">7d</th>
                                <th className="py-1 pl-2 text-right font-sans font-normal text-muted-foreground">1m</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-0.5 pr-2 font-sans text-foreground">Rating</td>
                                <td className="py-0.5 px-2 text-right text-foreground">{modeData.rating ?? '-'}</td>
                                <td className="py-0.5 px-2 text-right text-muted-foreground">{modeData.max_rating ?? '-'}</td>
                                <td className="py-0.5 px-2 text-right text-muted-foreground/60">{modeData.max_rating_7d ?? '-'}</td>
                                <td className="py-0.5 pl-2 text-right text-muted-foreground/60">{modeData.max_rating_1m ?? '-'}</td>
                              </tr>
                              {eloData?.rating != null && (
                                <tr>
                                  <td className="py-0.5 pr-2 font-sans text-foreground">ELO</td>
                                  <td className="py-0.5 px-2 text-right text-foreground">{eloData.rating ?? '-'}</td>
                                  <td className="py-0.5 px-2 text-right text-muted-foreground">{eloData.max_rating ?? '-'}</td>
                                  <td className="py-0.5 px-2 text-right text-muted-foreground/60">{eloData.max_rating_7d ?? '-'}</td>
                                  <td className="py-0.5 pl-2 text-right text-muted-foreground/60">{eloData.max_rating_1m ?? '-'}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                {Object.entries(eloModes).map(([modeKey, modeData]: [string, any]) => {
                  const hasStandardMode = eloToStandardMap[modeKey];
                  if (hasStandardMode) return null;
                  if (modeData?.rating == null) return null;
                  
                  const isCurrentGame = modeKey === currentLeaderboard || 
                    (modeKey === 'rm_solo' && currentLeaderboard === 'rm_1v1') ||
                    (modeKey === 'rm_1v1' && currentLeaderboard === 'rm_solo');
                  
                  return (
                    <Tooltip key={modeKey}>
                      <TooltipTrigger asChild>
                        <span 
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] cursor-default ${
                            isCurrentGame 
                              ? 'bg-primary/20 text-primary font-semibold border border-primary/30' 
                              : 'bg-muted/50 text-muted-foreground border border-border/50'
                          }`}
                        >
                          <span>{modeLabels[modeKey] || modeKey}:</span>
                          <span className="text-muted-foreground">ELO</span>
                          <span className={`font-mono ${isCurrentGame ? '' : 'text-foreground/80'}`}>{modeData.rating}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-0.5 font-normal">
                          <div className="font-medium mb-2.5 mt-2 text-muted-foreground uppercase tracking-wider text-xs">ELO</div>
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              <tr>
                                <td className="py-0.5 pr-4">Current</td>
                                <td className="py-0.5 pr-4 font-mono">{modeData.rating ?? '-'}</td>
                                <td className="py-0.5 text-right text-muted-foreground font-mono">
                                  {modeData.games_count != null ? `${modeData.wins_count ?? 0}W-${modeData.losses_count ?? 0}L` : ''}
                                </td>
                              </tr>
                              {modeData.previous_seasons?.length > 0 && 
                                modeData.previous_seasons.slice(0, 6).map((season: any) => (
                                  <tr key={season.season}>
                                    <td className="py-0.5 pr-4 text-muted-foreground">S{season.season}</td>
                                    <td className="py-0.5 pr-4 font-mono">{season.rating ?? '-'}</td>
                                    <td className="py-0.5 text-right text-muted-foreground font-mono text-[10px]">
                                      {season.games_count != null ? `${season.wins_count ?? 0}W-${season.losses_count ?? 0}L` : ''}
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                          <div className="h-2"></div>
                          <div className="border-t border-gray-300"></div>
                          <div className="h-2"></div>
                          <div className="font-medium mb-2.5 text-muted-foreground uppercase tracking-wider text-xs">Statistics</div>
                          <table className="w-full border-collapse font-mono text-xs">
                            <thead>
                              <tr className="border-b border-border/30">
                                <th className="py-1 pr-2 font-sans text-left font-normal text-muted-foreground">Type</th>
                                <th className="py-1 px-2 text-right font-sans font-normal text-muted-foreground">Now</th>
                                <th className="py-1 px-2 text-right font-sans font-normal text-muted-foreground">Max</th>
                                <th className="py-1 px-2 text-right font-sans font-normal text-muted-foreground">7d</th>
                                <th className="py-1 pl-2 text-right font-sans font-normal text-muted-foreground">1m</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-1.5 pr-2 font-sans text-foreground">ELO</td>
                                <td className="py-1.5 px-2 text-right text-foreground">{modeData.rating ?? '-'}</td>
                                <td className="py-1.5 px-2 text-right text-muted-foreground">{modeData.max_rating ?? '-'}</td>
                                <td className="py-1.5 px-2 text-right text-muted-foreground/60">{modeData.max_rating_7d ?? '-'}</td>
                                <td className="py-1.5 pl-2 text-right text-muted-foreground/60">{modeData.max_rating_1m ?? '-'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center ml-2 shrink-0">
            {isFolded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" data-testid={`chevron-down-${guide.key}`} />
            ) : (
              <ChevronUp className="h-5 w-5 text-muted-foreground" data-testid={`chevron-up-${guide.key}`} />
            )}
          </div>
        </div>
      </CardHeader>
      
        {!isFolded && (
          <CardContent className="flex-1 p-6 overflow-auto">
            <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-h2:text-base prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-4 first:prose-h2:mt-0 prose-h3:text-sm prose-h3:font-medium prose-h3:mb-2 prose-ul:my-2 prose-li:my-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentWithoutLinks}
              </ReactMarkdown>
            </article>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
}
