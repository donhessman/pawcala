# Multiplayer Setup Guide

This guide explains how to set up online multiplayer for Pawcala using Supabase Realtime.

## Overview

Pawcala uses **Supabase Realtime Broadcast channels** for real-time multiplayer gameplay. This provides:
- Low-latency WebSocket connections (< 100ms)
- Direct browser-to-Supabase communication (no custom backend server needed)
- Presence tracking for online/offline status
- Free tier: 200 concurrent connections (100 simultaneous games)

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. This project cloned locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization (or create one)
4. Fill in project details:
   - **Name**: `pawcala` (or any name you prefer)
   - **Database Password**: Choose a secure password (you won't need this for the app)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free (sufficient for development and small-scale production)
5. Click "Create new project"
6. Wait 1-2 minutes for the project to be provisioned

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

These are safe to use in your client-side code.

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
   ```

3. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 4: Enable Realtime (Usually Already Enabled)

Supabase Realtime is enabled by default for new projects. To verify:

1. In your Supabase dashboard, go to **Database** → **Replication**
2. Ensure "Realtime" is toggled ON
3. If you need to enable it, toggle it ON and click "Save"

## Step 5: Test Locally

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

4. Test multiplayer:
   - Choose "Online Multiplayer"
   - Click "Create Room"
   - Copy the room code
   - Open a new browser window (or incognito window)
   - Choose "Online Multiplayer" → "Join Room"
   - Enter the room code
   - Play the game across both windows!

## Step 6: Deploy to Vercel

1. Push your code to GitHub (if not already done)

2. Import your project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Add environment variables in Vercel:
   - In the Vercel project settings, go to **Settings** → **Environment Variables**
   - Add both variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Apply to all environments (Production, Preview, Development)

4. Deploy:
   ```bash
   vercel --prod
   ```

## Architecture

### How It Works

```
Browser A                    Supabase Realtime                    Browser B
    |                                |                                 |
    |--- WebSocket Connect -----------|------------- WebSocket Connect-|
    |                                 |                                 |
    |--- Broadcast Move ------------->|                                 |
    |                                 |--- Forward Move ---------------->|
    |                                 |                                 |
    |<-- Receive Move ----------------|<--- Broadcast Move -------------|
```

### Key Components

1. **Broadcast Channels**: Ephemeral message passing (perfect for game moves)
   - No database writes for every move
   - Ultra-low latency
   - Scales to thousands of concurrent games

2. **Presence Tracking**: Know when players are online/offline
   - Automatic heartbeat
   - Graceful disconnect handling

3. **Room Codes**: Simple 6-character codes for matchmaking
   - Example: `A3B7K9`
   - Easy to share over text/voice

### Data Flow

1. **Room Creation**:
   - Player 1 generates a room code
   - Player 1 joins channel `game:{roomCode}`
   - Player 1 waits for opponent

2. **Room Joining**:
   - Player 2 enters room code
   - Player 2 joins same channel `game:{roomCode}`
   - Game starts when both players are present

3. **Game Play**:
   - Player clicks pit → calculates move locally → broadcasts result
   - Supabase forwards to opponent via WebSocket
   - Opponent receives move → updates UI → triggers animation
   - Continues until game over

## Troubleshooting

### "Failed to connect to game room"

**Cause**: Invalid Supabase credentials or Realtime not enabled

**Fix**:
1. Double-check your `.env.local` values
2. Verify Realtime is enabled in Supabase dashboard
3. Restart your dev server (`npm run dev`)

### "Room is full"

**Cause**: Two players are already in the room

**Fix**:
- Create a new room code
- Rooms support exactly 2 players

### Moves not syncing between players

**Cause**: Channel subscription issue or network problem

**Fix**:
1. Check browser console for errors
2. Verify both players are in the same room code
3. Refresh both browser windows
4. Check Supabase project status (rare outages)

### Slow or laggy gameplay

**Cause**: Network latency or region mismatch

**Fix**:
- Choose a Supabase region closer to your users
- Check your internet connection
- Typical latency: 50-200ms depending on distance to Supabase servers

## Free Tier Limits

Supabase Free Tier includes:
- **200 concurrent WebSocket connections** (100 simultaneous games)
- **500MB database storage** (not used for basic multiplayer)
- **5GB bandwidth/month**
- **50,000 monthly active users**

When to upgrade to Pro ($25/month):
- More than 100 concurrent games
- Need more than 2 active projects
- Require guaranteed uptime SLA

## Optional: Database Persistence

By default, games are **not saved** to the database. Moves are only broadcast via WebSocket.

To add game persistence (for history, leaderboards, etc.):

1. Create tables in Supabase:
   ```sql
   -- In Supabase SQL Editor
   create table game_results (
     id uuid primary key default gen_random_uuid(),
     room_code text not null,
     winner int,
     player1_score int,
     player2_score int,
     completed_at timestamptz default now()
   );
   ```

2. Use Server Actions to save completed games (see `src/app/actions/gameActions.ts` for examples)

## Security Notes

1. **API Keys**: The `anon` key is safe to use client-side. It only has public access.
2. **Row Level Security**: If you add database tables, enable RLS policies to restrict access.
3. **Rate Limiting**: Supabase includes built-in rate limiting to prevent abuse.
4. **Cheating**: Current implementation trusts clients. For competitive play, add server-side validation.

## Next Steps

- Add authentication (Supabase Auth) for persistent player profiles
- Add game history/statistics with database persistence
- Implement matchmaking (lobby with available players list)
- Add chat functionality using Broadcast channels
- Create spectator mode for watching games

## Resources

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase Next.js Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Broadcast Channels](https://supabase.com/docs/guides/realtime/broadcast)
- [Supabase Presence](https://supabase.com/docs/guides/realtime/presence)

## Support

If you encounter issues:
1. Check the [Supabase Status Page](https://status.supabase.com/)
2. Review the browser console for errors
3. Verify your environment variables are correct
4. Open an issue on this project's GitHub repository
