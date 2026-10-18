// Online multiplayer needs a realtime transport (see docs/online-multiplayer-restore-plan.md).
// NEXT_PUBLIC_ values are inlined at build time, so changing the flag requires a redeploy.
export const ONLINE_MULTIPLAYER_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ONLINE_MULTIPLAYER === 'true';
