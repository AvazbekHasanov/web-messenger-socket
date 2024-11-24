module.exports = {
  apps: [
    {
      name: "your-app-name",
      cwd: "/path/to/your/project", // Ensure PM2 knows the project directory
      script: "npm",
      args: "run socket",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
