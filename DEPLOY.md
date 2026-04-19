# Production Deployment Guide - Ubuntu Server

Complete step-by-step guide for deploying kys-frontend (React + Vite) and kys-backend (Node.js + Express) on Ubuntu.

**Architecture**: Client → Nginx → `/` (Frontend Static) | `/api` (Backend) → PostgreSQL

---

## 1. System Setup

### 1.1 Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:
```bash
node --version  # Should show v20.x.x
npm --version
```

### 1.3 Install Nginx
```bash
sudo apt install -y nginx
```

Verify Nginx is running:
```bash
sudo systemctl status nginx
```

### 1.4 Install PM2 Globally
```bash
sudo npm install -g pm2
```

Verify PM2:
```bash
pm2 --version
```

### 1.5 Install Git (if not installed)
```bash
sudo apt install -y git
```

---

## 2. Project Setup

### 2.1 Clone Repository
```bash
cd /home/$USER
git clone <your-repo-url> kys-app
cd kys-app
```

Replace `<your-repo-url>` with your actual Git repository URL.

### 2.2 Install Backend Dependencies
```bash
cd kys-backend
npm install
```

### 2.3 Install Frontend Dependencies
```bash
cd ../kys-frontend
npm install
```

---

## 3. Environment Configuration

### 3.1 Backend Environment (.env)

Create production environment file:
```bash
cd /home/$USER/kys-app/kys-backend
nano .env
```

Add the following (replace placeholders with actual values):
```env
# Server Configuration
PORT=5002
NODE_ENV=production

# Database (use your PostgreSQL server IP)
DATABASE_URL=postgresql://username:password@192.168.1.100:5432/sky_db

# Security Keys (CHANGE THESE!)
SECRET_KEY=your-super-secret-key-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key-min-32-chars

# CORS Configuration (use your server IP)
ALLOWED_ORIGINS=http://192.168.1.50,http://192.168.1.50:80
ALLOW_LOCAL_DEV_ORIGINS=false
FORCE_HTTPS=false

# Database Pool
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=5

# Logging
LOG_LEVEL=info

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Service (Groq)
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
```

**Important Notes**:
- Replace `192.168.1.100` with your PostgreSQL server IP
- Replace `192.168.1.50` with your Ubuntu server IP
- Generate strong secrets for `SECRET_KEY` and `JWT_SECRET_KEY`
- Set `NODE_ENV=production` for production deployment

Save and exit (Ctrl+X, then Y, then Enter).

### 3.2 Frontend Environment (Optional)

Vite uses environment variables prefixed with `VITE_`. If your frontend needs API URL configuration:

```bash
cd /home/$USER/kys-app/kys-frontend
nano .env.production
```

Add (if needed):
```env
VITE_API_URL=/api
```

Most likely you don't need this since the frontend will use relative paths (`/api`).

### 3.3 Run Database Migrations

```bash
cd /home/$USER/kys-app/kys-backend
npm run migrate
```

This will set up your database schema.

---

## 4. Build Frontend

### 4.1 Build Production Bundle
```bash
cd /home/$USER/kys-app/kys-frontend
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 4.2 Verify Build Output
```bash
ls -la dist/
```

You should see:
- `index.html` - Main HTML file
- `assets/` - JavaScript, CSS, and other static assets

---

## 5. Backend Setup with PM2

### 5.1 Start Backend with PM2
```bash
cd /home/$USER/kys-app/kys-backend
pm2 start server.js --name kys-backend
```

### 5.2 Verify Backend is Running
```bash
pm2 status
pm2 logs kys-backend --lines 50
```

Check if backend is responding:
```bash
curl http://localhost:5002/health
```

Should return: `{"status":"healthy","timestamp":"..."}`

### 5.3 Configure PM2 Startup

Save PM2 process list:
```bash
pm2 save
```

Generate startup script:
```bash
pm2 startup
```

This will output a command like:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
```

Copy and run that command. This ensures PM2 starts on system reboot.

### 5.4 Useful PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs kys-backend        # View logs
pm2 restart kys-backend     # Restart backend
pm2 stop kys-backend        # Stop backend
pm2 delete kys-backend      # Remove from PM2
pm2 monit                   # Monitor CPU/Memory
```

---

## 6. Nginx Configuration

### 6.1 Create Nginx Configuration File
```bash
sudo nano /etc/nginx/sites-available/kys-app
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name _;  # Accepts any hostname/IP

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - Serve static files
    location / {
        root /home/$USER/kys-app/kys-frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Proxy to Node.js
    location /api {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        
        # Proxy headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Disable cache for API
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5002/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Increase max body size for file uploads
    client_max_body_size 50M;
}
```

**Replace `$USER`** with your actual username:
```bash
whoami  # This shows your username
```

Then edit the config and replace `/home/$USER/` with `/home/yourusername/`.

### 6.2 Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/kys-app /etc/nginx/sites-enabled/
```

### 6.3 Remove Default Site (Optional)
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 6.4 Test Nginx Configuration
```bash
sudo nginx -t
```

Should output: `syntax is ok` and `test is successful`.

### 6.5 Restart Nginx
```bash
sudo systemctl restart nginx
```

### 6.6 Enable Nginx on Boot
```bash
sudo systemctl enable nginx
```

---

## 7. Verify Deployment

### 7.1 Check Backend
```bash
curl http://localhost:5002/health
```

### 7.2 Check Frontend via Nginx
```bash
curl http://localhost/
```

Should return HTML content.

### 7.3 Check API via Nginx
```bash
curl http://localhost/api/health/live
```

Should return: `{"status":"ok"}`

### 7.4 Access from Browser

Open browser and navigate to:
```
http://<your-server-ip>
```

Replace `<your-server-ip>` with your Ubuntu server's IP address (e.g., `http://192.168.1.50`).

---

## 8. Update Workflow (After Code Changes)

When you push new code to Git, follow these steps on the server:

### 8.1 Pull Latest Code
```bash
cd /home/$USER/kys-app
git pull origin main
```

### 8.2 Update Backend
```bash
cd kys-backend
npm install  # Install any new dependencies
npm run migrate  # Run new migrations (if any)
pm2 restart kys-backend
```

### 8.3 Update Frontend
```bash
cd ../kys-frontend
npm install  # Install any new dependencies
npm run build  # Rebuild production bundle
```

### 8.4 Verify Changes
```bash
pm2 logs kys-backend --lines 50
curl http://localhost/health
```

No need to restart Nginx unless you changed Nginx config.

---

## 9. Debugging & Troubleshooting

### 9.1 Backend Issues

**Check PM2 logs**:
```bash
pm2 logs kys-backend --lines 100
```

**Check if backend is running**:
```bash
pm2 status
curl http://localhost:5002/health
```

**Restart backend**:
```bash
pm2 restart kys-backend
```

**Check environment variables**:
```bash
cd /home/$USER/kys-app/kys-backend
cat .env
```

### 9.2 Frontend Issues

**Check if build exists**:
```bash
ls -la /home/$USER/kys-app/kys-frontend/dist/
```

**Rebuild frontend**:
```bash
cd /home/$USER/kys-app/kys-frontend
npm run build
```

**Check Nginx is serving files**:
```bash
curl http://localhost/
```

### 9.3 Nginx Issues

**Check Nginx status**:
```bash
sudo systemctl status nginx
```

**Check Nginx error logs**:
```bash
sudo tail -f /var/log/nginx/error.log
```

**Check Nginx access logs**:
```bash
sudo tail -f /var/log/nginx/access.log
```

**Test Nginx config**:
```bash
sudo nginx -t
```

**Restart Nginx**:
```bash
sudo systemctl restart nginx
```

### 9.4 Common Errors

**502 Bad Gateway**:
- Backend is not running → Check `pm2 status`
- Backend crashed → Check `pm2 logs kys-backend`
- Wrong port in Nginx config → Verify `proxy_pass http://localhost:5002`

**CORS Errors**:
- Check `ALLOWED_ORIGINS` in backend `.env`
- Should include your server IP: `http://192.168.1.50`
- Restart backend after changing: `pm2 restart kys-backend`

**404 on Frontend Routes**:
- Missing `try_files $uri $uri/ /index.html;` in Nginx config
- Rebuild frontend: `npm run build`

**Database Connection Failed**:
- Check `DATABASE_URL` in backend `.env`
- Verify PostgreSQL is accessible from server
- Test connection: `psql -h 192.168.1.100 -U username -d sky_db`

**Build Fails**:
- Check Node version: `node --version` (should be 20.x)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check disk space: `df -h`

### 9.5 Log Locations

**PM2 Logs**:
```bash
~/.pm2/logs/kys-backend-out.log  # stdout
~/.pm2/logs/kys-backend-error.log  # stderr
```

**Nginx Logs**:
```bash
/var/log/nginx/access.log  # Access logs
/var/log/nginx/error.log   # Error logs
```

**Application Logs** (if using Winston):
```bash
/home/$USER/kys-app/kys-backend/logs/
```

---

## 10. Security Checklist

- [ ] Changed `SECRET_KEY` and `JWT_SECRET_KEY` in `.env`
- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Set `ALLOW_LOCAL_DEV_ORIGINS=false` in backend `.env`
- [ ] Configured `ALLOWED_ORIGINS` with server IP only
- [ ] PostgreSQL uses strong password
- [ ] Firewall configured (allow ports 80, 443, 22 only)
- [ ] Regular system updates: `sudo apt update && sudo apt upgrade`
- [ ] PM2 startup configured for auto-restart
- [ ] Nginx security headers enabled (already in config)

---

## 11. Performance Optimization

### 11.1 Enable Gzip in Nginx

Add to `/etc/nginx/nginx.conf` inside `http` block:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### 11.2 PM2 Cluster Mode (Optional)

For better CPU utilization:
```bash
pm2 delete kys-backend
pm2 start server.js --name kys-backend -i max
pm2 save
```

This runs multiple instances based on CPU cores.

---

## 12. Backup Strategy

### 12.1 Database Backup
```bash
pg_dump -h 192.168.1.100 -U username -d sky_db > backup_$(date +%Y%m%d).sql
```

### 12.2 Application Backup
```bash
cd /home/$USER
tar -czf kys-app-backup-$(date +%Y%m%d).tar.gz kys-app/
```

---

## Quick Reference Commands

```bash
# Backend
pm2 status                    # Check status
pm2 logs kys-backend          # View logs
pm2 restart kys-backend       # Restart
pm2 monit                     # Monitor resources

# Nginx
sudo systemctl status nginx   # Check status
sudo nginx -t                 # Test config
sudo systemctl restart nginx  # Restart
sudo tail -f /var/log/nginx/error.log  # View errors

# Update deployment
cd /home/$USER/kys-app
git pull
cd kys-backend && npm install && npm run migrate && pm2 restart kys-backend
cd ../kys-frontend && npm install && npm run build

# Health checks
curl http://localhost:5002/health      # Backend direct
curl http://localhost/api/health/live  # Backend via Nginx
curl http://localhost/                 # Frontend
```

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs kys-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify services: `pm2 status` and `sudo systemctl status nginx`
4. Test connectivity: `curl http://localhost:5002/health`
