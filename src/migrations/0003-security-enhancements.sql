/*
# Améliorations de Sécurité Finales

1. Nouveaux Modèles
- `failed_login_attempts` : Suivi des tentatives échouées
- `password_history` : Historique des mots de passe

2. Sécurité
- Politiques de verrouillage compte
- Prévention réutilisation mot de passe
*/

CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ip_address VARCHAR(45) NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  password_hash TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION check_password_reuse()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM password_history 
    WHERE user_id = NEW.user_id 
    AND password_hash = NEW.password_hash
  ) THEN
    RAISE EXCEPTION 'Password reuse not allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_password_reuse
BEFORE INSERT ON password_history
FOR EACH ROW EXECUTE FUNCTION check_password_reuse();
