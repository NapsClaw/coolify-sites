# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: range requests (obrigatório iOS), gzip, SPA fallback
RUN printf '\
server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Vídeos: sem cache Cloudflare para Range requests funcionar no iOS/Safari\n\
    location ~* \\.(mp4|webm|ogg|mov)$ {\n\
        add_header Accept-Ranges bytes always;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0" always;\n\
        add_header Pragma "no-cache" always;\n\
        add_header Expires "0" always;\n\
        try_files $uri =404;\n\
    }\n\
\n\
    # SPA fallback\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;\n\
}\n\
' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
