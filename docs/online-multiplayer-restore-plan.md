# Restoring online multiplayer

Status: **disabled**. The UI hides the option and `/game/[roomId]` shows an "unavailable" notice. The Supabase project it used (`pawcala`, ref `dgtilokejevfvtrsbved`) had no tables, users or storage; the only thing it provided was Realtime Broadcast and Presence.

## What is kept

- Flag: `NEXT_PUBLIC_ENABLE_ONLINE_MULTIPLAYER=true` enables it (build-time, needs a redeploy). Defined in `src/config/features.ts`.
- `RoomCreator`, `RoomJoiner`, `GameModeSelector` and `src/app/game/[roomId]/page.tsx` are unchanged apart from the gate.
- `src/utils/supabase/client.ts` is a plain `@supabase/supabase-js` client. The auth middleware and server client were removed (unused). `@supabase/ssr` was dropped.

## What the game needs from a transport

Everything lives in `src/app/game/[roomId]/page.tsx`, channel `game:{roomId}`:

| Need                                | Current use                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Pub/sub per room, no echo to sender | broadcast events `move`, `join`, `state_request`, `state_sync`                                               |
| Presence keyed by slot              | `track({...}, { key: 'player_N' })`; `sync`, `join`, `leave` events; the key lets a refresh reclaim the slot |
| Room full detection                 | derived from presence state after subscribe                                                                  |
| Latency                             | a move is sent and the opponent animates it, so ~100-300 ms is fine                                          |

The client is trusted (moves are computed locally and broadcast). There is no server-side validation.

## Options

| Option                                                     | Fit                     | Notes                                                                                                                                                      |
| ---------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ably or Pusher Channels** (Vercel Marketplace or direct) | Best fit, lowest effort | Native pub/sub plus presence with client IDs. Free tiers should cover a hobby game. Swap `supabase.channel()` for their client.                            |
| **Another Supabase project**                               | Zero code change        | Only env vars change. Needs Realtime "Allow public access" on and a channel prefix such as `pawcala:game:{roomId}`. Does not reduce the number of vendors. |
| **PartyKit / Cloudflare Durable Objects**                  | Best long-term          | One room = one object, so moves can be validated server-side and the board kept authoritative. More code.                                                  |
| **Vercel Functions WebSockets**                            | Possible, more work     | Supported on Fluid Compute, but instances do not share memory, so cross-instance room fan-out still needs a pub/sub backend (e.g. Redis).                  |
| **SSE + POST with Redis/Upstash pub/sub**                  | Works, clunky           | Presence has to be built by hand with heartbeats and TTL keys.                                                                                             |

Recommendation: Ably (or Pusher) first, to get back to parity quickly. Move to a Durable Object per room later if cheating or state drift matters.

## Steps (Ably example, ~8-12 hours)

1. Create the service through the Vercel Marketplace; add its keys as env vars (Production and Preview).
2. Add a small token endpoint (`app/api/realtime-token/route.ts`) so the API key never reaches the browser.
3. Write a `useRoomChannel(roomId, playerId)` hook exposing `publish(event, payload)`, `onEvent(event, handler)`, and presence enter/leave/get/subscribe. Move the `supabase.channel(...)` calls in `page.tsx` behind it. Keep slot reclaim by using a stable client ID per slot.
4. Replace `src/utils/supabase/client.ts`, remove `@supabase/supabase-js`, and drop the `RealtimeChannel` type import in `page.tsx`.
5. Add unit tests for the hook with a fake transport; keep the existing component tests.
6. Remove any leftover Supabase env vars from Vercel and docs; set `NEXT_PUBLIC_ENABLE_ONLINE_MULTIPLAYER=true`.

## Test checklist

- Create a room, join from a second window, play a full game.
- Refresh mid-game: the player keeps their slot and sees the current board (`state_request`/`state_sync`).
- Close one tab and rejoin: presence shows offline, then online.
- A third client gets "Room is full".
- Phone on mobile data plus desktop, to check latency and reconnect after sleep.
- Verify on a preview deployment first; promote only after a real two-device game.

## Cutover and rollback

Deploy with the flag off, verify on a preview with the flag on, then set it in Production and redeploy. Rollback: unset the flag and redeploy. Local and vs-computer modes are unaffected.
