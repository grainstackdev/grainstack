# Setup

0. Open this `readme.md`
1. `yarn`
2. `cp src/backend/secrets/.env.defaults src/backend/secrets/.env`
3. Add environment variables to `.env`
   1. Use `openssl rand -base64 32` to generate secrets.
4. `npm run clean-sql`
5. `npm start`
6. Mark `./build`, `./src/backend/build`, `./src/common/build`, `./src/web/build` as excluded from IDE analysis.
7. Mark `./src/build/secrets` as excluded from IDE analysis.
