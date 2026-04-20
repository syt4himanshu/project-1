module.exports = {
    apps: [
        {
            name: "kys-backend",
            cwd: "/var/www/kys.stvincentngp.edu.in/kys-backend",
            script: "server.js",
            env_file: ".env",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            max_memory_restart: "400M",
            min_uptime: "10s",
            max_restarts: 10,
            restart_delay: 5000,
            time: true,
            env: {
                NODE_ENV: "production",
                HOST: "0.0.0.0",
                PORT: 5002
            }
        }
    ]
};
