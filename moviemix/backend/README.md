# MovieMix Backend

NestJS + Prisma backend for the MovieMix legal/licensed streaming platform.

## Quick Start

```bash
cd moviemix/backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run start:dev
```

## API Docs

OpenAPI/Swagger UI is available at `/docs` when the server is running.

## Modules

- `auth` — register/login/JWT
- `users` — profile management
- `movies` / `series` / `genres` — catalog
- `watchlist` / `history` — user library
- `playback` — signed HLS URL generation
- `search` — title search
- `admin` — content and user management
