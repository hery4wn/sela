# Google AI Studio / Gemini

Set `GEMINI_API_KEY` as a secret server environment variable in Vercel Production and in local `.env.local`. Never use a NEXT_PUBLIC prefix or commit the key. Redeploy after changing environment variables.

When configured, Gemini handles vocabulary enrichment, pronunciation, Pixabay search keywords and progress questions. `GEMINI_TEXT_MODEL` optionally overrides the default. OpenRouter continues to handle optional paid images; Pixabay and Supabase are unchanged. Without a Gemini key, text retains the previous OpenRouter configuration. A failed Gemini call is not silently retried against a paid provider.

Requests retain authentication, daily quotas, idempotent cached results and schema validation. Google calls time out after 45 seconds with a draft-safe error. Speed depends on the provider and output length; no fixed latency is guaranteed.
