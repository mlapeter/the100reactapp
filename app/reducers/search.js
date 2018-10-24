import Environment from "../config/environment";

import {
  CHANGE_ACTIVITY,
  CHANGE_GAME,
  CHANGE_GAMING_SESSIONS_PAGE,
  CHANGE_MY_GAMING_SESSIONS_PAGE,
  CHANGE_GROUP_GAMING_SESSIONS_PAGE,
  CHANGE_RECENT_GAMING_SESSIONS_PAGE,
  CHANGE_PLATFORM,
  TOGGLE_NOT_FULL,
  FETCH_GAMES,
  FETCH_GAMES_RESULT,
  FETCH_GAMES_ERROR,
  FETCH_ACTIVITIES_RESULT
} from "../actions/search";

const initialState = {
  activity: "",
  gameId: Environment["DEFAULT_GAME_ID"],
  games: null,
  game: {},
  activities: [],
  notFull: 0,
  gamingSessionsPage: 1,
  myGamingSessionsPage: 1,
  groupGamingSessionsPage: 1,
  recentGamingSessionsPage: 1,
  platform: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };
    case CHANGE_GAME:
      return {
        ...state,
        gameId: action.gameId
      };
    case CHANGE_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        gamingSessionsPage: action.page
      };
    case CHANGE_MY_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        myGamingSessionsPage: action.page
      };
    case CHANGE_GROUP_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        groupGamingSessionsPage: action.page
      };
    case CHANGE_RECENT_GAMING_SESSIONS_PAGE:
      return {
        ...state,
        recentGamingSessionsPage: action.page
      };
    case CHANGE_PLATFORM:
      return {
        ...state,
        platform: action.platform
      };
    case TOGGLE_NOT_FULL:
      return {
        ...state,
        notFull: action.notFull
      };
    case FETCH_GAMES:
      return {
        ...state
      };
    case FETCH_GAMES_RESULT:
      return {
        ...state,
        games: action.result
      };
    case FETCH_GAMES_ERROR:
      return {
        ...state,
        error: action.error
      };
    case FETCH_ACTIVITIES_RESULT:
      return {
        ...state,
        game: action.game,
        activities: action.activities
      };
    default:
      return state;
  }
};

// "1": {
//   activities: [
//     "Archon’s Forge Arena",
//     "Bounty",
//     "Cerberus Vae III",
//     "Challenge of Elders - Level 42",
//     "Court of Oryx",
//     "Crota's End - Hard Mode",
//     "Crota's End - Normal Mode",
//     "Crucible - 3 Person",
//     "Crucible - 6 Person",
//     "Crucible - Clash",
//     "Crucible - Control",
//     "Crucible - Crimson Doubles",
//     "Crucible - Doubles Skirmish",
//     "Crucible - Elimination",
//     "Crucible - Iron Banner",
//     "Crucible - Mayhem",
//     "Crucible - Private Match",
//     "Crucible - Rift",
//     "Crucible - Salvage",
//     "Crucible - Skirmish",
//     "Crucible - Supremacy",
//     "Daily Heroic Mission",
//     "Darkblade",
//     "Dust Palace",
//     "Exotic Weapon Bounty",
//     "Festival of the Lost - Candy Farming",
//     "King's Fall - Hard Mode",
//     "King's Fall - Normal Mode",
//     "Miscellaneous - 3 Person",
//     "Miscellaneous - 6 Person",
//     "Mission",
//     "Patrol",
//     "Prison of Elders - Level 28",
//     "Prison of Elders - Level 32",
//     "Prison of Elders - Level 34",
//     "Prison of Elders - Level 35",
//     "Prison of Elders - Level 41",
//     "Queen's Kill Order",
//     "Quest",
//     "S.A.B.R.E 2",
//     "Shield Brothers",
//     "Sparrow Racing",
//     "Story Missions",
//     "Story Missions - Rise of Iron",
//     "Strike",
//     "The Devil's Lair",
//     "The Nexus",
//     "The Shadow Thief",
//     "The Summoning Pits",
//     "The Undying Mind",
//     "The Will of Crota",
//     "Trials of Osiris",
//     "Vanguard Heroic Strikes Playlist",
//     "Vanguard Legacy Strike Playlist",
//     "Vanguard Strikes Playlist",
//     "Vault of Glass - Hard Mode",
//     "Vault of Glass - Normal Mode",
//     "Weekly Nightfall Strike",
//     "Winter's Run",
//     "Wrath of the Machine - Heroic Mode",
//     "Wrath of the Machine - Normal Mode"
//   ]
// },
// "23": {
//   activities: [
//     "Anything",
//     "Adventures",
//     "Crucible - Control",
//     "Crucible - Countdown",
//     "Crucible - Survival",
//     "Crucible - Trials of the Nine",
//     "Lost Sectors",
//     "Public Events",
//     "Raid - Leviathan - Normal",
//     "Quest",
//     "Story Missions",
//     "Strike - Inverted Spire",
//     "Strike - Nightfall",
//     "Strike - Playlist"
//   ]
// }
