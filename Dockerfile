# 1. 建立階段：build 前端專案
FROM node:20 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

# 2. 部署階段：用 nginx serve 靜態檔案
FROM nginx:alpine

# 複製 build 出來的靜態檔案到 nginx 預設目錄
COPY --from=build /app/dist /usr/share/nginx/html

# 可選：自訂 nginx 設定檔（如果有需要）
# COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
