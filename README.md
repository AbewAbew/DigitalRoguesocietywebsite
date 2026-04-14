<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1IZkrbMS_BeGaI-vCsn1s1XVl1MjrPwj_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. For the blog CMS, add these Supabase variables to `.env.local`:
   `VITE_SUPABASE_URL=...`
   `VITE_SUPABASE_ANON_KEY=...`
   `VITE_SUPABASE_BLOG_TABLE=blog_posts`
   `VITE_SUPABASE_BLOG_BUCKET=blog-images`
4. Run the SQL in [supabase/blog_schema.sql](supabase/blog_schema.sql) inside your Supabase SQL editor.
5. If you already ran the earlier open-access blog SQL, run [supabase/blog_admin_auth.sql](supabase/blog_admin_auth.sql) to lock the admin route down to allowlisted email accounts.
6. In Supabase Auth, disable public email signups if you want admin access to be approval-only.
7. Create or invite approved admin users manually in Supabase Auth, then add those email addresses to `public.admin_emails`.
8. To keep the free Supabase project active, add GitHub repository secrets named `SUPABASE_URL` and `SUPABASE_ANON_KEY`. The workflow in [.github/workflows/supabase-keepalive.yml](.github/workflows/supabase-keepalive.yml) pings the project every 3 days.
9. Run the app:
   `npm run dev`
