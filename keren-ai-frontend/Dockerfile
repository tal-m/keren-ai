# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Vite embeds VITE_* variables at build time, so we must pass this during the image build.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json tsconfig.json vite.config.ts postcss.config.js tailwind.config.js ./
COPY index.html ./
COPY src ./src
RUN npm install && npm run build

# Stage 2: Serve
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
