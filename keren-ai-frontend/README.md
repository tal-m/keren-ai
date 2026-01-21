# Connect Frontend

A modern, responsive web frontend for the Connect travel-based social platform. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features
- Modern UI/UX
- Responsive design
- Easy to extend for social, auth, and travel features
- Microservice architecture, self-contained and deployable

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm

### Development
```bash
npm install
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```
The static site will be output to the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

### Docker Deployment
Build and run the Docker container:
```bash
docker build -t connect-frontend .
docker run -p 4173:4173 connect-frontend
```

## Project Structure
- `src/` - React source code
- `index.html` - Main HTML entry
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration

---
© {year} Connect. All rights reserved. 