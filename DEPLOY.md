# Deployment Guide (Postgres Edition)

Follow these steps to deploy GlamGenius to production using **Vercel** and **Neon**.

## 1. Cloud Database Setup
1.  Go to [Vercel Storage](https://vercel.com/dashboard/storage).
2.  Create a new **Postgres** database (Neon).
3.  Region: Pick closest to you (e.g. `fra1`, `iad1`).
4.  Name: `glamgenius-db`.
5.  **Copy the Environment Variables**: specifically `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.

## 2. Local Environment Setup
Since we switched `schema.prisma` to Postgres, you **must code against Postgres locally too**.

1.  Create/Update `.env` in your project root:
    ```env
    POSTGRES_PRISMA_URL="postgres://..."
    POSTGRES_URL_NON_POOLING="postgres://..."
    ```
2.  Run migration locally to set up the remote DB schema:
    ```bash
    npx prisma migrate dev --name init
    ```
3.  Seed the remote DB with initial data:
    ```bash
    npx prisma db seed
    ```
4.  Verify local app works:
    ```bash
    npm run dev
    ```

## 3. Deployment
1.  Push code to **GitHub**.
2.  Import repository to **Vercel**.
3.  **Configure Project**:
    -   **Environment Variables**: Add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` from Step 1.
    -   **Build Command**: `npx prisma generate && npx prisma migrate deploy && next build` (Already in `vercel.json`).
4.  **Deploy**.

## 4. Post-Deployment Check
Your database was seeded in Step 2 (against the *same* Neon DB).
If you used a *different* DB for production, run seeding again:
```bash
# Locally, pointing to prod DB
npx prisma db seed
```

## 5. Share
Your live URL will be `https://glamgenius.vercel.app`.
Add this to your resume and LinkedIn!
