FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend-express/package.json ./backend-express/package.json
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm install --ignore-scripts

COPY backend ./backend

RUN npm run db:generate -w backend
RUN npm run build -w backend

EXPOSE 3001

CMD ["node", "backend/dist/main.js"]
