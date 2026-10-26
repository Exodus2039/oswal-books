/**
 * One job per route. Screenshot sections either land here or are parked.
 * Step 5 fills `/` and `/live` with the same list component.
 */

export type RouteId =
  | "home"
  | "live"
  | "cricket"
  | "match"
  | "p2p"
  | "rankings"
  | "profile"
  | "about";

export type AppRoute = {
  id: RouteId;
  href: string;
  title: string;
  /** Single sentence. This is the whole job of the screen. */
  job: string;
  parked: boolean;
  nav: boolean;
};

export const ROUTES: Record<RouteId, AppRoute> = {
  home: {
    id: "home",
    href: "/",
    title: "Home",
    job: "Shows the matches in play and the match you last opened.",
    parked: false,
    nav: true,
  },
  live: {
    id: "live",
    href: "/live",
    title: "Live",
    job: "Lists every match in play, one row per match.",
    parked: false,
    nav: true,
  },
  cricket: {
    id: "cricket",
    href: "/cricket",
    title: "Cricket",
    job: "Lists the cricket series on the board.",
    parked: false,
    nav: true,
  },
  match: {
    id: "match",
    href: "/matches/ind-aus?market=winner&selection=india",
    title: "Match",
    job: "Shows the score, one market, and the confirm bar for this match.",
    parked: false,
    nav: false,
  },
  p2p: {
    id: "p2p",
    href: "/p2p",
    title: "P2P",
    job: "Requests, matches, verifies, and completes a voucher exchange.",
    parked: true,
    nav: true,
  },
  rankings: {
    id: "rankings",
    href: "/rankings",
    title: "Rankings",
    job: "Shows your India, state, and city placement.",
    parked: true,
    nav: false,
  },
  profile: {
    id: "profile",
    href: "/profile",
    title: "Profile",
    job: "Holds language, prediction history, and responsible play.",
    parked: false,
    nav: true,
  },
  about: {
    id: "about",
    href: "/about",
    title: "About",
    job: "Introduces Oswal Books to someone who is not signed in.",
    parked: false,
    nav: false,
  },
};

export const NAV_ITEMS = [
  ROUTES.home,
  ROUTES.live,
  ROUTES.cricket,
  ROUTES.p2p,
  ROUTES.profile,
] as const;

/** Where each screenshot block lives. `null` means it has no route. */
export const SCREEN_MAP = [
  { screen: "Hero and featured match", route: "/" as const },
  { screen: "Live now cards", route: "/live" as const },
  { screen: "Cricket series", route: "/cricket" as const },
  { screen: "Prediction markets and confirm", route: "/matches/[id]" as const },
  { screen: "P2P exchange", route: "/p2p" as const, parked: true },
  { screen: "Activity counts", route: "/" as const },
  { screen: "Quick games", route: null, parked: true },
  { screen: "Leaderboards and achievements", route: "/rankings" as const, parked: true },
  { screen: "Advantage, fair play, and closing pitch", route: "/about" as const },
  { screen: "Mobile header, balance, and bottom nav", route: "shell" as const },
] as const;
