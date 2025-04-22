UPDATE articles SET created_at = now() WHERE created_at IS NULL;
