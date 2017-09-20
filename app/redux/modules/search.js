const CHANGE_PLATFORM = "CHANGE_PLATFORM";
const CHANGE_GAME = "CHANGE_GAME";
const CHANGE_ACTIVITY = "CHANGE_ACTIVITY";
const FETCH_GAMES = "FETCH_GAMES";

export const changePlatform = platform => ({
  type: CHANGE_PLATFORM,
  platform
});

export const changeGame = gameId => ({
  type: CHANGE_GAME,
  gameId
});

export const changeActivity = activity => ({
  type: CHANGE_ACTIVITY,
  activity
});

export const fetchGames = games => ({
  type: FETCH_GAMES,
  games
});

const initialState = {
  gameId: 23,
  platform: "ps4",
  games: {
    1: {
      activities: [
        "Archon’s Forge Arena",
        "Bounty",
        "Cerberus Vae III",
        "Challenge of Elders - Level 42",
        "Court of Oryx",
        "Crota's End - Hard Mode",
        "Crota's End - Normal Mode",
        "Crucible - 3 Person",
        "Crucible - 6 Person",
        "Crucible - Clash",
        "Crucible - Control",
        "Crucible - Crimson Doubles",
        "Crucible - Doubles Skirmish",
        "Crucible - Elimination",
        "Crucible - Iron Banner",
        "Crucible - Mayhem",
        "Crucible - Private Match",
        "Crucible - Rift",
        "Crucible - Salvage",
        "Crucible - Skirmish",
        "Crucible - Supremacy",
        "Daily Heroic Mission",
        "Darkblade",
        "Dust Palace",
        "Exotic Weapon Bounty",
        "Festival of the Lost - Candy Farming",
        "King's Fall - Hard Mode",
        "King's Fall - Normal Mode",
        "Miscellaneous - 3 Person",
        "Miscellaneous - 6 Person",
        "Mission",
        "Patrol",
        "Prison of Elders - Level 28",
        "Prison of Elders - Level 32",
        "Prison of Elders - Level 34",
        "Prison of Elders - Level 35",
        "Prison of Elders - Level 41",
        "Queen's Kill Order",
        "Quest",
        "S.A.B.R.E 2",
        "Shield Brothers",
        "Sparrow Racing",
        "Story Missions",
        "Story Missions - Rise of Iron",
        "Strike",
        "The Devil's Lair",
        "The Nexus",
        "The Shadow Thief",
        "The Summoning Pits",
        "The Undying Mind",
        "The Will of Crota",
        "Trials of Osiris",
        "Vanguard Heroic Strikes Playlist",
        "Vanguard Legacy Strike Playlist",
        "Vanguard Strikes Playlist",
        "Vault of Glass - Hard Mode",
        "Vault of Glass - Normal Mode",
        "Weekly Nightfall Strike",
        "Winter's Run",
        "Wrath of the Machine - Heroic Mode",
        "Wrath of the Machine - Normal Mode"
      ]
    },
    23: {
      activities: [
        "Anything",
        "Adventures",
        "Crucible - Control",
        "Crucible - Countdown",
        "Crucible - Survival",
        "Crucible - Trials of the Nine",
        "Lost Sectors",
        "Public Events",
        "Raid - Leviathan - Normal",
        "Quest",
        "Story Missions",
        "Strike - Inverted Spire",
        "Strike - Nightfall",
        "Strike - Playlist"
      ]
    }
  },
  activity: "",
  notFull: 1
};

export const search = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_GAME:
      return {
        ...state,
        gameId: action.gameId
      };
    case CHANGE_PLATFORM:
      return {
        ...state,
        platform: action.platform
      };
    case CHANGE_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };
    case FETCH_GAMES:
      return {
        ...state,
        games: action.games
      };
    default:
      return state;
  }
};
