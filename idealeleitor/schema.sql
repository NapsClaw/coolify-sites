-- Idealeleitor Schema

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'coordinator', -- 'admin' | 'coordinator'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coordinator_id UUID NOT NULL REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  birth_date DATE,
  phone VARCHAR(20),
  street VARCHAR(255),
  number VARCHAR(20),
  neighborhood VARCHAR(100),
  city VARCHAR(100),
  zone VARCHAR(20),
  section VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voters_coordinator ON voters(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_voters_cpf ON voters(cpf);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
