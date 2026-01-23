import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Minimize2, Maximize2, Clock, Calendar, Trophy, Globe, Users } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import PlayerSearchInput from "@/components/PlayerSearchInput";
import CivilizationGuideCard from "@/components/CivilizationGuideCard";
import MapGuideCard from "@/components/MapGuideCard";
import { Button } from "@/components/ui/button";
import { civilizationGuides, mapGuides } from "@/lib/guides";
import type { Player, CivilizationKey } from "@/lib/schema";

const modeLabels: Record<string, string> = {
  rm_solo: "Ranked 1v1",
  rm_1v1: "Ranked 1v1",
  rm_2v2: "Ranked 2v2",
  rm_3v3: "Ranked 3v3",
  rm_4v4: "Ranked 4v4",
  rm_team: "Ranked Team",
  rm_ffa: "Ranked FFA",
  qm_1v1: "Quick Match 1v1",
  qm_2v2: "Quick Match 2v2",
  qm_3v3: "Quick Match 3v3",
  qm_4v4: "Quick Match 4v4",
  qm_ffa: "Quick Match FFA",
};

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatStartTime = (isoString: string | null): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatLastRefresh = (date: Date | null): string => {
  if (!date) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  
  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  return `${Math.floor(diffMins / 60)}h ago`;
};

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [hashPlayerParam, setHashPlayerParam] = useState<string>('');
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [, setRefreshTick] = useState(0);
  const [defaultFolded, setDefaultFolded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('defaultFolded') === 'true';
    }
    return false;
  });

  // Save defaultFolded to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('defaultFolded', String(defaultFolded));
  }, [defaultFolded]);

  // Tick every 30 seconds to update relative time displays
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTick(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get player param from hash (format: #profileId-playerName)
  const getHashPlayerParam = (): string => {
    if (typeof window === 'undefined') return '';
    const hash = window.location.hash;
    return hash.startsWith('#') ? hash.substring(1) : '';
  };

  // Set player param in hash
  const setHashParam = (param: string) => {
    if (typeof window === 'undefined') return;
    window.location.hash = param;
  };

  // Parse profile ID and name from hash format: #profileId-playerName
  const parsePlayerParam = (param: string): { profileId: number | null; playerName: string } => {
    if (!param) return { profileId: null, playerName: '' };
    const match = param.match(/^(\d+)-(.+)$/);
    if (match) {
      return { profileId: parseInt(match[1]), playerName: decodeURIComponent(match[2]) };
    }
    // Fallback for old format or invalid format
    return { profileId: null, playerName: decodeURIComponent(param) };
  };

  const normalizeCivKey = (civString: string): CivilizationKey => {
    // Exhaustive mapping of all AoE4World civilization names including variants
    const civMap: Record<string, CivilizationKey> = {
      // Base game
      "english": "english",
      "chinese": "chinese",
      "french": "french",
      "holy roman empire": "holy_roman_empire",
      "holyromanempire": "holy_roman_empire",
      "mongols": "mongols",
      "delhi sultanate": "delhi",
      "delhisultanate": "delhi",
      "delhi": "delhi",
      "rus": "rus",
      "rus'": "rus",
      "abbasid dynasty": "abbasid",
      "abbasid_dynasty": "abbasid",
      "abbassiddynasty": "abbasid",
      "abbasid": "abbasid",
      // Free expansions
      "ottomans": "ottomans",
      "malians": "malians",
      // Sultans Ascend
      "byzantines": "byzantines",
      "japanese": "japanese",
      "ayyubids": "ayyubids",
      "zhu xi's legacy": "zhu_xis_legacy",
      "zhu xis legacy": "zhu_xis_legacy",
      "zhuxislegacy": "zhu_xis_legacy",
      "jeanne d'arc": "jeanne_darc",
      "jeanne darc": "jeanne_darc",
      "jeannedarc": "jeanne_darc",
      "order of the dragon": "order_of_the_dragon",
      "orderofthedragon": "order_of_the_dragon",
      // Knights of Cross and Rose
      "knights templar": "knights_templar",
      "knightstemplar": "knights_templar",
      "house of lancaster": "house_of_lancaster",
      "houseoflancaster": "house_of_lancaster",
      // New expansion civs
      "macedonian dynasty": "macedonian_dynasty",
      "macedoniandynasty": "macedonian_dynasty",
      "macedonian": "macedonian_dynasty",
      "sengoku daimyo": "sengoku_daimyo",
      "sengokudaimyo": "sengoku_daimyo",
      "sengoku": "sengoku_daimyo",
      "golden horde": "golden_horde",
      "goldenhorde": "golden_horde",
      "tughlaq dynasty": "tughlaq_dynasty",
      "tughlaqdynasty": "tughlaq_dynasty",
      "tughlaq": "tughlaq_dynasty"
    };

    const lower = civString.toLowerCase();
    
    // Check direct mapping first
    if (civMap[lower]) {
      return civMap[lower];
    }
    
    // Fallback: remove all non-alphanumeric except spaces, then replace spaces with underscores
    const normalized = lower.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
    
    // Check if normalized version is in our map
    if (civMap[normalized]) {
      return civMap[normalized];
    }
    
    return normalized as CivilizationKey;
  };

  // Load game data for a player
  const loadGameData = async (player: Player, isBackgroundUpdate = false) => {
    setSelectedPlayer(player);
    if (isBackgroundUpdate) {
      setIsAutoUpdating(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Fetch last game from API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://aoe4world.com/api/v0/players/${player.profile_id}/games/last`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Player not found or no recent games');
        }
        throw new Error('Failed to fetch last game');
      }
      
      const gameApiData = await response.json();
      
      // Detect FFA mode: more than 2 teams means FFA
      const isFFA = gameApiData.teams.length > 2;
      
      // Extract game mode (kind) - this tells us which leaderboard this game was played in
      const gameKind = gameApiData.kind || null;
      // Use mmr_leaderboard if available (it's the actual leaderboard key), otherwise use kind
      const leaderboardKey = gameApiData.mmr_leaderboard || gameKind;
      
      let yourTeamData: any[] = [];
      let enemyTeamData: any[] = [];
      let allPlayers: any[] = [];
      let searchedPlayerData: any = null;
      
      if (isFFA) {
        // In FFA, each team has one player - collect all players
        for (const team of gameApiData.teams) {
          if (team.length > 0) {
            const playerData = team[0];
            allPlayers.push(playerData);
            if (playerData.profile_id === player.profile_id) {
              searchedPlayerData = playerData;
            }
          }
        }
        
        if (!searchedPlayerData) {
          throw new Error('Could not find player in FFA game data');
        }
      } else {
        // Team game (2 teams)
        for (const team of gameApiData.teams) {
          const playerInTeam = team.find((p: any) => p.profile_id === player.profile_id);
          if (playerInTeam) {
            // This is the player's team
            yourTeamData = team;
            searchedPlayerData = playerInTeam;
            // The other team is the enemy team
            enemyTeamData = gameApiData.teams.find((t: any) => t !== team) || [];
            break;
          }
        }

        if (!searchedPlayerData || yourTeamData.length === 0 || enemyTeamData.length === 0) {
          throw new Error('Could not find player or opponent teams in game data');
        }
      }

      // Helper function to process player data
      const processPlayer = (teamMember: any, isSearched: boolean = false) => {
        const civKey = normalizeCivKey(teamMember.civilization);
        const civGuide = civilizationGuides[civKey];
        if (!civGuide) {
          throw new Error(`No guide available for civilization: ${teamMember.civilization}`);
        }
        
        // Extract rating and MMR from the top-level player object
        // These represent the player's stats in the current game
        const rating = teamMember.rating ?? null;
        const mmr = teamMember.mmr ?? null;
        
        // Max ratings are inside each mode object in the modes field
        // e.g., modes.rm_team.max_rating, modes.rm_team.max_rating_7d, modes.rm_team.max_rating_1m
        const modes = teamMember.modes || {};
        
        // Compute overall max rating as the highest max_rating across all standard modes
        let computedMaxRating: number | null = null;
        let computedMaxRatingElo: number | null = null;
        
        Object.entries(modes).forEach(([modeKey, modeData]: [string, any]) => {
          if (modeData?.max_rating != null) {
            if (modeKey.endsWith('_elo')) {
              // ELO mode - track max for ELO display
              if (computedMaxRatingElo === null || modeData.max_rating > computedMaxRatingElo) {
                computedMaxRatingElo = modeData.max_rating;
              }
            } else {
              // Standard mode - track max for rank display
              if (computedMaxRating === null || modeData.max_rating > computedMaxRating) {
                computedMaxRating = modeData.max_rating;
              }
            }
          }
        });
        
        const maxRating = computedMaxRating;
        const maxRatingElo = computedMaxRatingElo;
        
        return {
          name: teamMember.name,
          profileId: teamMember.profile_id,
          civKey: civKey,
          rating: rating,
          mmr: mmr,
          maxRating: maxRating,
          maxRatingElo: maxRatingElo,
          modes: modes,
          result: teamMember.result,
          guide: civGuide,
          isSearchedPlayer: isSearched
        };
      };

      // Process your team - create array of player data with guides
      const yourTeam = yourTeamData.map((teamMember: any) => {
        return processPlayer(teamMember, teamMember.profile_id === player.profile_id);
      });

      // Process enemy team - create array of player data with guides
      const enemyTeam = enemyTeamData.map((teamMember: any) => {
        return processPlayer(teamMember, false);
      });

      // Process FFA players
      const ffaPlayers = isFFA ? allPlayers.map((playerData: any) => {
        return processPlayer(playerData, playerData.profile_id === player.profile_id);
      }) : [];

      // Get map guide
      const mapGuide = mapGuides[gameApiData.map] || {
        name: gameApiData.map,
        type: "Land" as const,
        content: `## Map Overview\n\nThis map is not yet documented. Scout carefully to understand the terrain and resource layout.\n\n## Strategic Approach\n\n- Scout early to identify key resource locations\n- Adapt your strategy based on terrain features\n- Play to your civilization's strengths`
      };

      setGameData({
        game: {
          map: gameApiData.map,
          mapType: mapGuide.type,
          duration: gameApiData.duration,
          result: searchedPlayerData.result,
          leaderboard: leaderboardKey,
          startedAt: gameApiData.started_at,
          gameId: gameApiData.game_id,
          server: gameApiData.server
        },
        isFFA: isFFA,
        yourTeam: yourTeam,
        enemyTeam: enemyTeam,
        ffaPlayers: ffaPlayers,
        mapGuide: mapGuide
      });
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game data');
    } finally {
      if (isBackgroundUpdate) {
        setIsAutoUpdating(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Fetch player data from autocomplete API by name
  const fetchPlayerByName = async (playerName: string): Promise<Player | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://aoe4world.com/api/v0/players/autocomplete?leaderboard=rm_solo&limit=10&query=${encodeURIComponent(playerName)}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) return null;
      const data = await response.json();
      const players = data.players || [];
      // Find exact match (case-insensitive)
      const exactMatch = players.find((p: Player) => 
        p.name.toLowerCase() === playerName.toLowerCase()
      );
      return exactMatch || (players.length > 0 ? players[0] : null);
    } catch {
      return null;
    }
  };

  // Fetch player data from autocomplete API by profile ID
  const fetchPlayerById = async (profileId: number): Promise<Player | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://aoe4world.com/api/v0/players/autocomplete?leaderboard=rm_solo&limit=10&query=${profileId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) return null;
      const data = await response.json();
      const players = data.players || [];
      // Find exact match by profile_id
      const match = players.find((p: Player) => p.profile_id === profileId);
      return match || null;
    } catch {
      return null;
    }
  };

  // Listen for hash changes
  useEffect(() => {
    // Guard against non-browser environments
    if (typeof window === 'undefined') return;
    
    const handleHashChange = () => {
      setHashPlayerParam(getHashPlayerParam());
    };
    
    // Set initial hash value
    setHashPlayerParam(getHashPlayerParam());
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-load last searched player on home page visit
  useEffect(() => {
    if (!hashPlayerParam && !selectedPlayer && !isLoading) {
      try {
        const savedPlayer = localStorage.getItem('lastSearchedPlayer');
        if (savedPlayer) {
          const { profile_id, name } = JSON.parse(savedPlayer);
          if (profile_id && name) {
            // Auto-load the saved player
            const player: Player = {
              profile_id: profile_id,
              name: name,
              rating: null,
              rank: null,
              rank_level: null,
              win_rate: null,
              avatars: {
                small: '',
                medium: '',
                full: ''
              }
            };
            loadGameData(player);
          }
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [hashPlayerParam, selectedPlayer, isLoading]);

  // Load player data when hash contains playerName
  useEffect(() => {
    if (hashPlayerParam) {
      const { profileId, playerName } = parsePlayerParam(hashPlayerParam);
      
      // Skip if we already have this player loaded
      if (selectedPlayer?.profile_id === profileId || 
          (profileId === null && selectedPlayer?.name.toLowerCase() === playerName.toLowerCase())) {
        return;
      }
      
      const loadPlayerFromHash = async () => {
        let player: Player | null = null;
        
        // Prefer fetching by profile_id if available
        if (profileId !== null) {
          // Try to fetch by ID first
          player = await fetchPlayerById(profileId);
          
          // If that fails, create a minimal player object and let the game API provide full details
          if (!player) {
            player = {
              profile_id: profileId,
              name: playerName,
              rating: null,
              rank: null,
              rank_level: null,
              win_rate: null,
              avatars: {
                small: '',
                medium: '',
                full: ''
              }
            };
          }
        } else {
          player = await fetchPlayerByName(playerName);
        }
        
        if (player) {
          await loadGameData(player);
        } else {
          setError(`Player "${playerName}" not found`);
        }
      };
      loadPlayerFromHash();
    }
  }, [hashPlayerParam]);

  const handlePlayerSelect = async (player: Player) => {
    // Save to localStorage for auto-load on next visit
    try {
      localStorage.setItem('lastSearchedPlayer', JSON.stringify({
        profile_id: player.profile_id,
        name: player.name
      }));
    } catch (e) {
      // Ignore localStorage errors
    }
    
    // Load game data first
    await loadGameData(player);
    // Update hash after successful load with format: #profileId-playerName
    setHashParam(`${player.profile_id}-${encodeURIComponent(player.name)}`);
  };

  // Auto-update effect: check for new games every minute when enabled
  useEffect(() => {
    if (!autoUpdateEnabled || !selectedPlayer) {
      return;
    }

    const intervalId = setInterval(() => {
      if (selectedPlayer) {
        loadGameData(selectedPlayer, true); // Pass true for background update
      }
    }, 60000); // 60 seconds = 1 minute

    return () => clearInterval(intervalId);
  }, [autoUpdateEnabled, selectedPlayer]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        rightContent={selectedPlayer ? (
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
            <Button
              variant={autoUpdateEnabled ? "default" : "outline"}
              size="icon"
              onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
              data-testid="button-auto-update-toggle"
              title={autoUpdateEnabled ? "Auto-update enabled (checks every minute)" : "Enable auto-update"}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${isAutoUpdating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        ) : undefined}
      >
        <PlayerSearchInput 
          onPlayerSelect={handlePlayerSelect}
          isLoading={isLoading}
          currentPlayerName={selectedPlayer?.name || (hashPlayerParam ? parsePlayerParam(hashPlayerParam).playerName : '')}
        />
      </HeroSection>

      <div className="py-12">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {gameData && !isLoading && (
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Game Meta Info */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                <span className={`font-medium ${
                  gameData.game.leaderboard?.startsWith('rm_') 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-sky-600 dark:text-sky-400'
                }`}>
                  {modeLabels[gameData.game.leaderboard] || gameData.game.leaderboard || 'Unknown Mode'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatStartTime(gameData.game.startedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(gameData.game.duration)}</span>
              </div>
              {gameData.game.server && (
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>{gameData.game.server}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>
                  {gameData.isFFA 
                    ? `${gameData.ffaPlayers?.length || 0} players` 
                    : `${gameData.yourTeam?.length || 0}v${gameData.enemyTeam?.length || 0}`
                  }
                </span>
              </div>
              {lastRefreshTime && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                  <RefreshCw className="h-3 w-3" />
                  <span>Updated {formatLastRefresh(lastRefreshTime)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Your Civilization (Team games) or Searched Player (FFA) */}
              <div className="space-y-6">
                {gameData.isFFA ? (
                  /* FFA: Show only the searched player */
                  gameData.ffaPlayers
                    .filter((player: any) => player.isSearchedPlayer)
                    .map((player: any) => (
                      <CivilizationGuideCard 
                        key={player.profileId}
                        guide={player.guide}
                        playerName={player.name}
                        playerProfileId={player.profileId}
                        rating={player.rating}
                        mmr={player.mmr}
                        maxRating={player.maxRating}
                        maxRatingElo={player.maxRatingElo}
                        modes={player.modes}
                        currentLeaderboard={gameData.game.leaderboard}
                        isOnHomePage={true}
                        defaultFolded={defaultFolded}
                      />
                    ))
                ) : (
                  /* Team games: Show your team */
                  [...gameData.yourTeam]
                    .sort((a: any, b: any) => (b.isSearchedPlayer ? 1 : 0) - (a.isSearchedPlayer ? 1 : 0))
                    .map((player: any, index: number) => (
                      <CivilizationGuideCard 
                        key={player.profileId}
                        guide={player.guide}
                        playerName={player.name}
                        playerProfileId={player.profileId}
                        rating={player.rating}
                        mmr={player.mmr}
                        maxRating={player.maxRating}
                        maxRatingElo={player.maxRatingElo}
                        modes={player.modes}
                        currentLeaderboard={gameData.game.leaderboard}
                        isOnHomePage={true}
                        defaultFolded={defaultFolded}
                      />
                    ))
                )}
              </div>

              {/* Map Column */}
              <div>
                <MapGuideCard guide={gameData.mapGuide} isOnHomePage={true} defaultFolded={defaultFolded} />
              </div>

              {/* Right Column - Enemy Team (Team games) or All Other Players (FFA) */}
              <div className="space-y-6">
                {gameData.isFFA ? (
                  /* FFA: Show all other players */
                  gameData.ffaPlayers
                    .filter((player: any) => !player.isSearchedPlayer)
                    .map((player: any) => (
                      <CivilizationGuideCard 
                        key={player.profileId}
                        guide={player.guide}
                        playerName={player.name}
                        playerProfileId={player.profileId}
                        rating={player.rating}
                        mmr={player.mmr}
                        maxRating={player.maxRating}
                        maxRatingElo={player.maxRatingElo}
                        modes={player.modes}
                        currentLeaderboard={gameData.game.leaderboard}
                        isOnHomePage={true}
                        defaultFolded={defaultFolded}
                      />
                    ))
                ) : (
                  /* Team games: Show enemy team */
                  gameData.enemyTeam.map((player: any, index: number) => (
                    <CivilizationGuideCard 
                      key={player.profileId}
                      guide={player.guide}
                      playerName={player.name}
                      playerProfileId={player.profileId}
                      rating={player.rating}
                      mmr={player.mmr}
                      maxRating={player.maxRating}
                      maxRatingElo={player.maxRatingElo}
                      modes={player.modes}
                      currentLeaderboard={gameData.game.leaderboard}
                      isOnHomePage={true}
                      defaultFolded={defaultFolded}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-lg text-destructive mb-2">Error: {error}</p>
              <p className="text-sm text-muted-foreground">
                Try searching for a different player or check if they have recent games
              </p>
            </div>
          </div>
        )}

        {!gameData && !isLoading && !error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                Search for a player above to view their last game and get strategic insights
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
