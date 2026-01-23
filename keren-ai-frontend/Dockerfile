# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Vite embeds VITE_* variables at build time, so we must pass this during the image build.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json tsconfig.json vite.config.ts postcss.config.js tailwind.config.js ./
COPY index.html ./
COPY embed.html ./
COPY public ./public
COPY src ./src
RUN npm install && npm run build

# Stage 2: Serve (with CORS headers)
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4173