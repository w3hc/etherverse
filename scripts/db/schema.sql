CREATE TABLE IF NOT EXISTS walkaway_reports (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  project TEXT NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS walkaway_reports_created_at_idx ON walkaway_reports (created_at DESC);
