# Oswal Books frontend checklist

Work top to bottom. One step is done only when its gate passes. Do not start the next step early.

The phone is the product. Desktop is a wider layout of the same screens.

## Baseline

These constraints stay fixed until we measure real users and change them on purpose.

| Constraint | Target |
| --- | --- |
| First release | Mobile shell, live list, one match, confirm, receipt |
| Player | Indian cricket fan, English or Hindi, 18+ |
| Device | Android Chrome, 360px wide, ₹10–20k class (about 4–6 GB RAM) |
| Network lab | Slow 4G, 4× CPU throttle |
| Concurrent players | 50k. The server owns fan-out. The phone holds only what is on screen |
| Money unit | One name everywhere (credits until the legal model says otherwise) |
| Out of this track | Crash, Dice, Mines, Plinko, and the long marketing page |

Field targets, same as Core Web Vitals:

- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

Lab budget for the home route on the device profile above:

- First-load JavaScript ≤ 180KB gzipped
- No hero photo on first paint
- At most one self-hosted font family, or the system font if Hindi subsetting blows the budget
- No backdrop blur, no stacked glows
- A scroll frame stays under 16ms on the lab profile. A long task over 50ms during idle scroll fails the gate
- Live updates for the open match only. Off-screen cards do not subscribe ball-by-ball

## How a step is finished

1. The slice matches the scope line. Nothing extra landed in the same change.
2. The gate checks pass on a 360px viewport and at 1280px.
3. Loading, empty, and error exist for anything that reads data.
4. Touch targets are at least 40×40px. Focus is visible. Buttons and links are real elements.
5. `prefers-reduced-motion` is respected.
6. A failure in this slice cannot blank the rest of the shell.

---

## 0. Write the rules down

Scope: this file is the contract. No UI yet.

- [x] Device, network, bundle, and vitals budgets are written
- [x] v1 surface is named: shell, live list, match, confirm, receipt
- [x] Games and the marketing scroll are parked

Gate: a later change that breaks a budget has to say so in the step that breaks it.

## 1. Routes and names

Scope: the map of screens. No visual design yet.

Routes:

- `/` player home (the live list lands here in step 5)
- `/live` every match in play
- `/matches/[id]?market=&selection=` score, markets, confirm, receipt
- `/cricket` series list (T20I, IPL, WPL, Ranji Trophy). `/sports` redirects here
- `/p2p` parked route, empty state only until step 10
- `/rankings` parked route, empty state only until step 11. Linked from Profile, not a tab
- `/profile` language, history entry, responsible play entry
- `/about` logged-out intro, not the player home

- [x] Each route has one job, written in a single sentence
- [x] Bottom nav is Home, Live, Cricket, P2P, Profile
- [x] Rankings sit under Profile until a real tab earns its place
- [x] The signed-out action is one path: Continue with WhatsApp
- [x] Match, market, and selection ids are in the URL so a bug report can name the screen

Gate: every box in the screenshots maps to one route, or it is explicitly parked. The map is `features/shell/routes.ts`.

## 2. Tokens

Scope: color, type, spacing, elevation. No pages.

- [x] Dark surface, 1px border, no glow, no blur
- [x] One action color (green). Yellow is only for the player’s own rank
- [x] Cricket identity is an icon or a 2px edge, not a recolored card
- [x] Body text 16px minimum. Scores and odds use tabular numbers
- [x] Spacing comes from the scale. No one-off pixel values
- [x] Hindi sample string fits the tightest chip and the confirm bar

Gate: a sample card and a sample button exist in isolation, and they use tokens only. See `/about`.

## 3. Shell

Scope: header, bottom nav, safe areas, feature error boundary. Still no live data.

- [x] Header: logo, balance chip (static), bell, profile
- [x] Bottom nav with a current-route state and 40px targets
- [x] Main content clears the header, the nav, and the iOS/Android safe area
- [x] Each route renders inside its own error boundary
- [x] A thrown error in one route leaves the nav usable
- [x] Keyboard access reaches nav, bell, and profile

Gate: every route from step 1 renders inside the shell at 360px and 1280px. Home is not the marketing page.

## 4. Domain and mock feed

Scope: types and one fake server. No extra screens.

Types: `Match`, `Market`, `Selection`, `Score`, `Wallet`, `Receipt`.

- [x] Screens import types from one module
- [x] A `LiveFeed` interface is the only way to read scores and markets
- [x] The mock implements `LiveFeed` and updates on a timer
- [x] The mock can emit stale, empty, and error
- [x] Percent and pool are server fields. The client does not recompute a crowd
- [x] Wallet balance has one reader. Header and confirm both use it

Gate: swapping the mock later is a new file behind `LiveFeed`, not a rewrite of the pages. `getLiveFeed()` is that file.

## 5. Live list

Scope: `/` as the player home. Compact rows only.

A row shows the series, clock, both sides, score, and the current split. The row is the tap target. It opens `/matches/[id]`.

- [x] Home opens with the cricket intro and featured match, then the live list. The photo is one 19KB image
- [x] No pick buttons on the row
- [x] Off-screen rows are not subscribed ball-by-ball
- [x] Updates coalesce to one paint per frame
- [x] Empty, loading skeleton, and retry exist
- [x] A delayed feed keeps the last score and shows the age
- [x] List scroll does not repaint the whole page (no blur, no glow)

Gate: on the lab profile, home meets the bundle and LCP budgets with the mock feed running. Module scripts for `/` measured at about 145KB gzipped. The Slow 4G and 4× CPU lab pass has not been run.

## 6. Match, confirm, receipt

Scope: one match screen. This is the play loop.

- [x] Score stays visible while markets load
- [x] Markets are tabs: winner, runs, bowler. One market is mounted
- [x] The selected side is obvious
- [x] A bottom bar shows pick, percent, fee (including zero), and Confirm
- [x] Confirm is disabled until a side is selected
- [x] Success writes a receipt: market, pick, credits locked, time
- [x] Failure keeps the selection and offers retry
- [x] Double-tap does not send two confirms
- [x] The URL records match id and market id

Gate: a full play — open row, pick side, confirm, read receipt, refresh, land on the same market — works at 360px. INP of Confirm stays ≤ 200ms on the lab profile. The screen and the confirm rules are in place. The throttled INP pass has not been run. A placed call locks 100 credits from a 1,000 credit demo balance. Refresh keeps the market in the URL and the receipt in this tab.

## 7. Resilience of the play loop

Scope: behavior when the network is bad. No new features.

- [x] Hidden tab pauses the feed
- [x] Reconnect does not blank the score
- [x] Stale data is labeled with age
- [x] Errors show a code support can ask for
- [x] The shell still navigates when the feed is down
- [x] Reduced motion turns off non-essential movement

Gate: airplane mode, mid-confirm failure, and a thrown market panel each have a written result, and that result happens in the app.

Written results:

- Airplane mode (`feed` mode `error`): the last score stays on the row and the match. The label says the score is delayed. The alert shows code `feed/unavailable`. Header and bottom nav still move to other routes.
- Reconnect: the next live tick folds into the board. The score line is replaced only when a newer line arrives. An empty error tick does not clear it.
- Mid-confirm failure: Confirm while the feed is down returns code `feed/unavailable`, leaves the selection in the URL, and the button becomes Retry.
- Thrown market panel: `/matches/[id]?panel=crash` throws inside the market card after paint. The score stays. The card shows code `market/panel` and Try again. The shell nav stays.
- A hidden tab unsubscribes. `prefers-reduced-motion` drops the live-dot pulse. The age text still updates.

## 8. Language and the player record

Scope: English and Hindi, plus the minimum profile.

- [x] Strings live in one catalog per locale
- [x] Layout holds a string about 30% longer than English
- [x] EN/HI switches without a full reload of the shell
- [x] Profile shows language, a history entry, and responsible play (18+, limits, self-exclusion entry)
- [x] Events and screens do not store a raw phone number or a public @handle in the UI model for P2P

Gate: the play loop is completable in Hindi on a 360px screen with no clipped team names. Catalogs are `features/i18n/catalog.ts`. Profile switches `en` and `hi` in this tab without a navigation. The Hindi WhatsApp label is longer than English and wraps inside the button. Team names wrap instead of truncating. India and Australia render as भारत and ऑस्ट्रेलिया.

## 9. Know the user base

Scope: measurement, not more UI. Add this before P2P, so the cricket loop is the thing you learn from.

Events, no PII:

- `session_start` with locale, viewport bucket, device-memory bucket, network bucket, app version
- `screen_view` with route
- `match_open` with match id and series
- `selection_made` with market id
- `confirm_result` with success or failure code
- `receipt_view`
- `feed_stale` when the age label appears
- Web vitals per route (LCP, INP, CLS)

- [x] Event names and properties are a typed list
- [x] The mock sink logs them in development
- [x] Production sink is one adapter, same idea as `LiveFeed`
- [x] A dashboard question is answerable from these events: which series, which market, where confirm fails, which phones miss the vitals budget

Gate: one completed play in dev prints the event sequence above, in order, with no name, phone, or free-text note. `session_start`, `screen_view`, `match_open`, `selection_made`, `confirm_result`, and `receipt_view` follow a play. `feed_stale` prints when the age label appears. `web_vital` prints when the browser reports LCP, INP, or CLS. The dev sink is `console.info("[oswal]", …)`. The production adapter is `features/analytics/production-sink.ts`. Viewport `narrow` is under 768px. Memory `low` is 4 GB or less. Network `slow` is 2g or 3g.

## 10. P2P

Start only after steps 5–9 are green.

Scope: `/p2p` as its own feature folder.

- [ ] Steps are Request, Match, Verify, Complete
- [ ] Open requests show amount, average match time, and trade count
- [ ] Fulfil opens a sheet: amount, fee, second confirm, then OTP
- [ ] The same wallet unit as the header
- [ ] The list is virtualized
- [ ] Error boundary is the P2P boundary, not the shell

Gate: a fulfil can fail at OTP and return to the list with the request still visible and the balance unchanged.

## 11. Rankings

Scope: `/rankings`, still its own folder.

- [ ] India, state, and city placement
- [ ] One accuracy meter, one cricket meter
- [ ] The player’s row is marked with the yellow “you” token
- [ ] The board is virtualized
- [ ] Empty and stale states exist

Gate: opening rankings does not increase the home route’s JavaScript.

## 12. Budget check before any new surface

Run this again before games, chat, or a richer live center.

- [ ] Home JavaScript still ≤ 180KB gzipped
- [ ] LCP, INP, and CLS still meet the field targets on the lab profile
- [ ] One socket (or one SSE) per session
- [ ] Off-screen subscriptions are off
- [ ] Feature folders still match the route map
- [ ] A support engineer can go from an error code to one feature folder

Games stay parked until this gate passes and the event stream shows people finishing the cricket loop.

## Working agreement

- One step per change. The scope line is the whole change.
- Mock data until the real feed exists. Pages never call a socket directly.
- If a step needs to break a budget, stop and update the baseline table first.
- Parked routes may show a plain empty state. They may not grow a partial product.
