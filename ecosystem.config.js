module.exports = {
    apps: [
        {
            name: "kys-backend",
            cwd: "/var/www/kys.stvincentngp.edu.in/kys-backend",
            script: "server.js",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            env: {
                NODE_ENV: "production",
                PORT: 5002
            }
        },
        {
            name: "kys-frontend",
            script: "serve",
            cwd: "/var/www/kys.stvincentngp.edu.in/kys-frontend",
            env: {
                PM2_SERVE_PATH: "dist",
                PM2_SERVE_PORT: 4173,
                PM2_SERVE_SPA: "true",
                PM2_SERVE_HOMEPAGE: "/index.html"
            }
        }
    ]
};
