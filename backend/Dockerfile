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
# code compilé + function.json + host.json
COPY --from=build /workspace/dist/ ./
# dépendances node nécessaires au runtime
COPY --from=build /workspace/node_modules ./node_modules
# Le runtime écoute sur le port 80 dans ce container
EXPOSE 80
