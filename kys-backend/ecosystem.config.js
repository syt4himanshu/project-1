module.exports = {
  apps: [
    {
      name: 'kys-backend',
      cwd: '/var/www/kys.stvincentngp.edu.in/kys-backend',
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: 5002,
      },
    },
  ],
}
