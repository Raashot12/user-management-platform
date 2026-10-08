FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter @ump/api... --frozen-lockfile
COPY apps/api apps/api
RUN pnpm --filter @ump/api build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["sh", "-c", "pnpm --filter @ump/api migration:run && pnpm --filter @ump/api start"]
