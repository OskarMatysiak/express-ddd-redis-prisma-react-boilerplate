FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend-express/package.json ./backend-express/package.json
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm install --ignore-scripts

COPY backend-express ./backend-express

RUN npm run db:generate -w backend-express
RUN npm run build -w backend-express

EXPOSE 3000

CMD ["node", "backend-express/dist/server.js"]
