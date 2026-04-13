# KYS Production Deployment

Target: Ubuntu 24.04 — IP 117.239.42.27

## Prerequisites

```bash
sudo apt update && sudo apt install -y nginx nodejs npm postgresql
npm install -g pm2
sudo ufw allow 8080/tcp
sudo ufw allow 8081/tcp
sudo ufw allow 8082/tcp
```

Do not open ports 3000 or 3001 — they are already in use by other applications. Do not expose port 5002 publicly; Nginx proxies to the backend on localhost.

## 1. Install dependencies

```bash
cd kys-backend && npm ci
cd ../kys-student && npm ci
cd ../kys-faculty && npm ci
cd ../kys-admin && npm ci
```

## 2. Build frontends (Vite reads `.env.production` automatically)

```bash
cd kys-student && npm run build
cd ../kys-faculty && npm run build
cd ../kys-admin && npm run build
```

## 3. Deploy static files

```bash
sudo mkdir -p /var/www/kys-student /var/www/kys-faculty /var/www/kys-admin
sudo cp -r kys-student/dist/* /var/www/kys-student/
sudo cp -r kys-faculty/dist/* /var/www/kys-faculty/
sudo cp -r kys-admin/dist/*   /var/www/kys-admin/
```

## 4. Configure Nginx

```bash
sudo cp nginx/prod.conf /etc/nginx/sites-available/kys
sudo ln -sf /etc/nginx/sites-available/kys /etc/nginx/sites-enabled/kys
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Configure backend environment

```bash
cp kys-backend/.env.example kys-backend/.env
```

Edit `kys-backend/.env` and set at least:

- `DATABASE_URL`, `JWT_SECRET_KEY`, `GROQ_API_KEY`, `REDIS_URL` (if used)
- `NODE_ENV=production`
- `ALLOWED_ORIGINS=http://117.239.42.27:8080,http://117.239.42.27:8081,http://117.239.42.27:8082`
- `PORT=5002`

## 6. Run database migrations

```bash
cd kys-backend && npx sequelize-cli db:migrate
```

## 7. Start backend with PM2

```bash
cd kys-backend
NODE_ENV=production pm2 start server.js --name kys-backend
pm2 save
pm2 startup
```

Run the command that `pm2 startup` prints to enable PM2 on boot.

## 8. Verify deployment

```bash
curl -I http://117.239.42.27:8080
curl -I http://117.239.42.27:8081
curl -I http://117.239.42.27:8082
curl http://117.239.42.27:8080/api/health/live
```

Expect HTTP 200 on the first three commands and `{"status":"ok"}` from the health endpoint.

## Troubleshooting

- `pm2 logs kys-backend` — backend application logs
- `sudo nginx -t` — validate Nginx configuration
- `sudo tail -f /var/log/nginx/error.log` — Nginx errors
- `sudo systemctl status nginx` — Nginx service status
