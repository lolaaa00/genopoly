-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  genlayer_game_id TEXT UNIQUE NOT NULL,
  creator_wallet TEXT NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 4,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Players
CREATE TABLE IF NOT EXISTS room_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  username TEXT,
  is_ready BOOLEAN DEFAULT FALSE,
  player_index INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, wallet)
);

-- Games
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  genlayer_game_id TEXT UNIQUE NOT NULL,
  room_id UUID REFERENCES rooms(id),
  players TEXT[] NOT NULL DEFAULT '{}',
  winner TEXT,
  move_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('waiting','active','completed','cancelled','disputed')),
  cached_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Game Players
CREATE TABLE IF NOT EXISTS game_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  player_index INTEGER NOT NULL,
  final_balance INTEGER,
  final_properties INTEGER[],
  status TEXT DEFAULT 'active',
  UNIQUE(game_id, wallet)
);

-- Board Properties (cached)
CREATE TABLE IF NOT EXISTS board_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  space_id INTEGER NOT NULL,
  owner TEXT,
  upgrade_level INTEGER DEFAULT 0,
  mortgaged BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, space_id)
);

-- Moves
CREATE TABLE IF NOT EXISTS moves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  move_number INTEGER NOT NULL,
  wallet TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auctions
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  space_id INTEGER NOT NULL,
  highest_bid INTEGER DEFAULT 0,
  highest_bidder TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','resolved','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Trades
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  from_player TEXT NOT NULL,
  to_player TEXT NOT NULL,
  offered_cash INTEGER DEFAULT 0,
  requested_cash INTEGER DEFAULT 0,
  offered_properties INTEGER[] DEFAULT '{}',
  requested_properties INTEGER[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  username TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT NOT NULL,
  wallet TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','resolved','dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Leaderboard (materialized view style table)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet TEXT UNIQUE NOT NULL,
  username TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  bankruptcies INTEGER DEFAULT 0,
  total_net_worth BIGINT DEFAULT 0,
  total_rent_collected BIGINT DEFAULT 0,
  auctions_won INTEGER DEFAULT 0,
  trades_completed INTEGER DEFAULT 0,
  fair_play_score INTEGER DEFAULT 100,
  games_played INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT,
  wallet TEXT NOT NULL,
  action TEXT NOT NULL,
  tx_hash TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, owner can update
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (wallet = current_setting('app.wallet', TRUE));

-- Rooms: public rooms readable
CREATE POLICY "rooms_read" ON rooms FOR SELECT USING (is_public = TRUE OR creator_wallet = current_setting('app.wallet', TRUE));
CREATE POLICY "rooms_insert" ON rooms FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "rooms_update" ON rooms FOR UPDATE USING (TRUE);

-- Room players
CREATE POLICY "room_players_read" ON room_players FOR SELECT USING (TRUE);
CREATE POLICY "room_players_insert" ON room_players FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "room_players_update" ON room_players FOR UPDATE USING (wallet = current_setting('app.wallet', TRUE));

-- Chat: anyone in the room can read/send
CREATE POLICY "chat_read" ON chat_messages FOR SELECT USING (TRUE);
CREATE POLICY "chat_insert" ON chat_messages FOR INSERT WITH CHECK (TRUE);

-- Games
CREATE POLICY "games_read" ON games FOR SELECT USING (TRUE);
CREATE POLICY "games_upsert" ON games FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "games_update" ON games FOR UPDATE USING (TRUE);

-- Board properties
CREATE POLICY "board_props_read" ON board_properties FOR SELECT USING (TRUE);
CREATE POLICY "board_props_write" ON board_properties FOR ALL USING (TRUE);

-- Moves
CREATE POLICY "moves_read" ON moves FOR SELECT USING (TRUE);
CREATE POLICY "moves_insert" ON moves FOR INSERT WITH CHECK (TRUE);

-- Leaderboard
CREATE POLICY "leaderboard_read" ON leaderboard FOR SELECT USING (TRUE);
CREATE POLICY "leaderboard_write" ON leaderboard FOR ALL USING (TRUE);

-- Transactions: users see own
CREATE POLICY "transactions_read" ON transactions FOR SELECT USING (wallet = current_setting('app.wallet', TRUE));
CREATE POLICY "transactions_insert" ON transactions FOR INSERT WITH CHECK (TRUE);

-- Notifications: users see own
CREATE POLICY "notifications_read" ON notifications FOR SELECT USING (wallet = current_setting('app.wallet', TRUE));
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (TRUE);

-- Disputes
CREATE POLICY "disputes_read" ON disputes FOR SELECT USING (TRUE);
CREATE POLICY "disputes_insert" ON disputes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "disputes_update" ON disputes FOR UPDATE USING (TRUE);

-- Auctions
CREATE POLICY "auctions_read" ON auctions FOR SELECT USING (TRUE);
CREATE POLICY "auctions_write" ON auctions FOR ALL USING (TRUE);

-- Trades
CREATE POLICY "trades_read" ON trades FOR SELECT USING (TRUE);
CREATE POLICY "trades_write" ON trades FOR ALL USING (TRUE);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE room_players;
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE board_properties;
ALTER PUBLICATION supabase_realtime ADD TABLE moves;
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE disputes;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_players_room ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_games_genlayer ON games(genlayer_game_id);
CREATE INDEX IF NOT EXISTS idx_moves_game ON moves(game_id);
CREATE INDEX IF NOT EXISTS idx_notifications_wallet ON notifications(wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet);
CREATE INDEX IF NOT EXISTS idx_leaderboard_wins ON leaderboard(wins DESC);
