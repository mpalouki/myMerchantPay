# ---- deps: install once, reused by dev and build stages ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- dev: Vite dev server with hot reload ----
FROM deps AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- build: production bundle ----
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# ---- production: static bundle served by nginx ----
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
