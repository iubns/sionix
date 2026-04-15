ALTER TABLE users
  ADD COLUMN IF NOT EXISTS service_integrations JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE users
SET service_integrations = jsonb_set(
  COALESCE(service_integrations, '{}'::jsonb),
  '{openclaw}',
  jsonb_build_object('url', openclaw_url, 'enabled', TRUE),
  TRUE
)
WHERE openclaw_url IS NOT NULL
  AND (
    service_integrations->'openclaw' IS NULL
    OR COALESCE(service_integrations->'openclaw'->>'url', '') = ''
  );
