-- EsporteAção Portal de Notícias
-- Schema v1

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#1e3a5f',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  cover_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author VARCHAR(100) DEFAULT 'Redação EsporteAção',
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);

-- Seed: categorias iniciais
INSERT INTO categories (name, slug, color) VALUES
  ('Futebol', 'futebol', '#1e3a5f'),
  ('Atletismo', 'atletismo', '#2563eb'),
  ('Basquete', 'basquete', '#0ea5e9'),
  ('Vôlei', 'volei', '#0369a1'),
  ('Outros', 'outros', '#64748b')
ON CONFLICT DO NOTHING;
