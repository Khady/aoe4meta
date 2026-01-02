import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Player } from "@shared/schema";

interface PlayerSearchInputProps {
  onPlayerSelect: (player: Player) => void;
  isLoading?: boolean;
  currentPlayerName?: string;
}

export default function PlayerSearchInput({
  onPlayerSelect,
  isLoading,
  currentPlayerName,
}: PlayerSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sync query with current player name
  useEffect(() => {
    if (currentPlayerName) {
      setQuery(currentPlayerName);
    } else {
      setQuery("");
    }
  }, [currentPlayerName]);

  const handleSearch = async () => {
    if (query.length < 1) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://aoe4world.com/api/v0/players/autocomplete?leaderboard=rm_solo&limit=10&query=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Failed to fetch players");

      const data = await response.json();
      setResults(data.players || []);
    } catch (error) {
      console.error("Error searching players:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayerClick = (player: Player) => {
    onPlayerSelect(player);
    setShowResults(false);
    setQuery(player.name);
  };

  return (
    <div className="relative w-full flex items-center h-10">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
      <Input
        data-testid="input-player-search"
        type="text"
        placeholder="Enter player name (e.g., Beastyqt, MarineLord)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="pl-12 pr-20 sm:pr-32 h-10 text-base border-primary/20 focus-visible:border-primary/50 bg-card w-full"
      />
      <Button
        data-testid="button-search"
        onClick={handleSearch}
        disabled={query.length < 3 || isSearching || isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2"
        size="sm"
        aria-label="Search players"
      >
        {isSearching || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
            <span className="hidden sm:inline">Searching</span>
          </>
        ) : (
          <>
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </>
        )}
      </Button>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 p-2">
          {results.map((player) => (
            <button
              key={player.profile_id}
              data-testid={`player-result-${player.profile_id}`}
              onClick={() => handlePlayerClick(player)}
              className="w-full flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2"
            >
              <img
                src={player.avatars.medium}
                alt={player.name}
                className="w-12 h-12 rounded-full border-2 border-primary/30"
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">{player.name}</div>
                <div className="text-sm text-muted-foreground">
                  Rating: {player.rating} • Rank: #{player.rank}
                </div>
              </div>
              {player.rank_level && (
                <Badge variant="outline" className="text-xs">
                  {player.rank_level.replace(/_/g, " ")}
                </Badge>
              )}
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
