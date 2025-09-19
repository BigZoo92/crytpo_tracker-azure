# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /workspace
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Runtime (Azure Functions) ----------
FROM mcr.microsoft.com/azure-functions/node:4-node20
WORKDIR /home/site/wwwroot

COPY --from=build /workspace/dist/ ./
COPY --from=build /workspace/node_modules ./node_modules

EXPOSE 80
