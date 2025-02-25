FROM node:18-alpine

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./
COPY server/package*.json ./server/

# Устанавливаем зависимости
RUN npm install
RUN cd server && npm install

# Копируем исходный код
COPY . .

# Собираем серверную часть
RUN cd server && npm run build

# Открываем порт
EXPOSE 5001

# Запускаем сервер
CMD cd server && npm start 