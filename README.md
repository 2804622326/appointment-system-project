# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Docker Deployment

A Dockerfile and compose configuration are provided for containerized builds.

### Build the image

```bash
docker compose build
```

### Run the container

```bash
docker compose up -d
```

The application will be available on [http://localhost:3000](http://localhost:3000).
