// Utility functions for converting rating numbers to rank labels

export interface RankInfo {
  division: string;
  tier: number;
  label: string;
  shortLabel: string;
}

/**
 * Converts a rating number to a rank label
 * Based on official AoE4 Season 2+ thresholds from Age of Empires Support
 * @param rating - The player's rating number
 * @returns RankInfo object with division, tier, and formatted labels
 */
export function getRankFromRating(rating: number | null | undefined): RankInfo | null {
  if (rating === null || rating === undefined) {
    return null;
  }

  // Official Season 2+ thresholds (each tier has different point ranges)
  // Bronze I: 0-399, Bronze II: 400-449, Bronze III: 450-499
  // Silver I: 500-599, Silver II: 600-649, Silver III: 650-699
  // Gold I: 700-799, Gold II: 800-899, Gold III: 900-999
  // Platinum I: 1000-1099, Platinum II: 1100-1149, Platinum III: 1150-1199
  // Diamond I: 1200-1299, Diamond II: 1300-1349, Diamond III: 1350-1399
  // Conqueror I: 1400-1499, Conqueror II: 1500-1599, Conqueror III: 1600+

  if (rating < 400) {
    // Bronze I: 0-399
    return {
      division: 'Bronze',
      tier: 1,
      label: 'Bronze 1',
      shortLabel: 'Bronze 1',
    };
  } else if (rating < 450) {
    // Bronze II: 400-449
    return {
      division: 'Bronze',
      tier: 2,
      label: 'Bronze 2',
      shortLabel: 'Bronze 2',
    };
  } else if (rating < 500) {
    // Bronze III: 450-499
    return {
      division: 'Bronze',
      tier: 3,
      label: 'Bronze 3',
      shortLabel: 'Bronze 3',
    };
  } else if (rating < 600) {
    // Silver I: 500-599
    return {
      division: 'Silver',
      tier: 1,
      label: 'Silver 1',
      shortLabel: 'Silver 1',
    };
  } else if (rating < 650) {
    // Silver II: 600-649
    return {
      division: 'Silver',
      tier: 2,
      label: 'Silver 2',
      shortLabel: 'Silver 2',
    };
  } else if (rating < 700) {
    // Silver III: 650-699
    return {
      division: 'Silver',
      tier: 3,
      label: 'Silver 3',
      shortLabel: 'Silver 3',
    };
  } else if (rating < 800) {
    // Gold I: 700-799
    return {
      division: 'Gold',
      tier: 1,
      label: 'Gold 1',
      shortLabel: 'Gold 1',
    };
  } else if (rating < 900) {
    // Gold II: 800-899
    return {
      division: 'Gold',
      tier: 2,
      label: 'Gold 2',
      shortLabel: 'Gold 2',
    };
  } else if (rating < 1000) {
    // Gold III: 900-999
    return {
      division: 'Gold',
      tier: 3,
      label: 'Gold 3',
      shortLabel: 'Gold 3',
    };
  } else if (rating < 1100) {
    // Platinum I: 1000-1099
    return {
      division: 'Platinum',
      tier: 1,
      label: 'Platinum 1',
      shortLabel: 'Plat 1',
    };
  } else if (rating < 1150) {
    // Platinum II: 1100-1149
    return {
      division: 'Platinum',
      tier: 2,
      label: 'Platinum 2',
      shortLabel: 'Plat 2',
    };
  } else if (rating < 1200) {
    // Platinum III: 1150-1199
    return {
      division: 'Platinum',
      tier: 3,
      label: 'Platinum 3',
      shortLabel: 'Plat 3',
    };
  } else if (rating < 1300) {
    // Diamond I: 1200-1299
    return {
      division: 'Diamond',
      tier: 1,
      label: 'Diamond 1',
      shortLabel: 'Diamond 1',
    };
  } else if (rating < 1350) {
    // Diamond II: 1300-1349
    return {
      division: 'Diamond',
      tier: 2,
      label: 'Diamond 2',
      shortLabel: 'Diamond 2',
    };
  } else if (rating < 1400) {
    // Diamond III: 1350-1399
    return {
      division: 'Diamond',
      tier: 3,
      label: 'Diamond 3',
      shortLabel: 'Diamond 3',
    };
  } else if (rating < 1500) {
    // Conqueror I: 1400-1499
    return {
      division: 'Conqueror',
      tier: 1,
      label: 'Conqueror 1',
      shortLabel: 'Conq 1',
    };
  } else if (rating < 1600) {
    // Conqueror II: 1500-1599
    return {
      division: 'Conqueror',
      tier: 2,
      label: 'Conqueror 2',
      shortLabel: 'Conq 2',
    };
  } else {
    // Conqueror III: 1600+
    return {
      division: 'Conqueror',
      tier: 3,
      label: 'Conqueror 3',
      shortLabel: 'Conq 3',
    };
  }
}

/**
 * Filters modes to only include standard modes (no suffix variations like _elo, _ew, etc.)
 * @param modes - Object containing mode data
 * @returns Filtered object with only standard modes
 */
export function getStandardModes(modes: Record<string, any> | null | undefined): Record<string, any> {
  if (!modes) return {};
  
  return Object.fromEntries(
    Object.entries(modes).filter(([key]) => {
      // Include modes that don't have suffixes like _elo, _ew, _chartacourse, etc.
      // Standard modes: rm_solo, rm_1v1, rm_team, qm_1v1, qm_2v2, qm_3v3, qm_4v4, qm_ffa, rm_ffa, etc.
      const isStandard = !key.includes('_elo') && 
             !key.includes('_ew') && 
             !key.includes('_chartacourse') && 
             !key.includes('_mapmonsters') && 
             !key.includes('_chaoticclimate');
      
      return isStandard;
    })
  );
}

/**
 * Filters modes to only include ELO modes (with _elo suffix)
 * @param modes - Object containing mode data
 * @returns Filtered object with only ELO modes
 */
export function getEloModes(modes: Record<string, any> | null | undefined): Record<string, any> {
  if (!modes) return {};
  
  return Object.fromEntries(
    Object.entries(modes).filter(([key]) => key.endsWith('_elo'))
  );
}
