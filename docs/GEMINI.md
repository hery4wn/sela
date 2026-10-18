# Google AI Studio / Gemini

Set `GEMINI_API_KEY` as a secret server environment variable in Vercel Production and in local `.env.local`. Never use a NEXT_PUBLIC prefix or commit the key. Redeploy after changing environment variables.

When configured, Gemini handles vocabulary enrichment, pronunciation, Pixabay search keywords and progress questions. `GEMINI_TEXT_MODEL` optionally overrides the default. OpenRouter continues to handle optional paid images; Pixabay and Supabase are unchanged. Without a Gemini key, text retains the previous OpenRouter configuration. A failed Gemini call is not silently retried against a paid provider.

Requests retain authentication, daily quotas, idempotent cached results and schema validation. Google uses the native generateContent API with Gemini 3.5 Flash Lite by default and Gemini 3.8 Flash as fallback. Each attempt has a 20-second timeout. Only transient failures and unavailable models trigger a single fallback; invalid keys, permission failures and quota errors do not retry. Failure logs contain only model, HTTP status and duration, never keys or user text. Speed depends on the provider and output length; no fixed latency is guaranteed.
