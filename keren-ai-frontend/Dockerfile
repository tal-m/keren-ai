# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts postcss.config.js tailwind.config.js ./
COPY index.html ./
COPY src ./src
COPY public ./public
RUN npm install && npm run build

# Stage 2: Serve
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"] 