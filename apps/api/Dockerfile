FROM node:20-alpine AS base
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @restomaster/api build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app .
EXPOSE 4000
CMD ["pnpm", "--filter", "@restomaster/api", "start"]
