-- Script para criar a tabela de apoiadores no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

CREATE TABLE IF NOT EXISTS supporters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'in-conversation', 'critical', 'undecided')),
    image TEXT,
    phone TEXT,
    email TEXT,
    zone TEXT,
    section TEXT,
    interests TEXT[], -- Array de interesses
    notes TEXT
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso total (apenas para demonstração/uso simplificado)
-- Em produção, você deve restringir isso!
CREATE POLICY "Allow all access" ON supporters
    FOR ALL
    USING (true)
    WITH CHECK (true);
