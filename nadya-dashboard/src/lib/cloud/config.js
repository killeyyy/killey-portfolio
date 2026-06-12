// Supabase project config. The publishable key is exactly that — publishable:
// it grants nothing beyond what Row Level Security allows, and every kv row
// is locked to its owner (see migration kv_store_with_rls_and_lww).
// Real secrets never ship in this bundle.
export const SUPABASE_URL = "https://vuyexsgqemslttivlzoy.supabase.co";
export const SUPABASE_KEY = "sb_publishable_8SyYr9EgaaWneUl7ZombGw_tGKSvWdp";
