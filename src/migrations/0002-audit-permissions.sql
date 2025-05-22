/*
# Migration pour les tables d'audit et permissions

1. Nouveaux Modèles
- `audit_logs` : Journalisation des actions
- `permission_assignments` : Assignation des permissions

2. Sécurité
- Activation RLS sur toutes les nouvelles tables
- Politiques d'accès pour les logs
*/

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all logs" 
  ON audit_logs FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM roles 
    WHERE user_id = auth.uid() 
    AND type IN ('SUPER_ADMIN', 'ADMIN')
  ));

CREATE TABLE IF NOT EXISTS permission_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

ALTER TABLE permission_assignments ENABLE ROW LEVEL SECURITY;
