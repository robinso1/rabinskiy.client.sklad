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

# Создаем директорию для логов
RUN mkdir -p /app/server/logs

# Устанавливаем переменные окружения по умолчанию
ENV PORT=10000
ENV NODE_ENV=production

# Открываем порт, который будет использоваться
EXPOSE 10000

# Проверка здоровья приложения
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/api/health || exit 1

# Запускаем сервер
CMD cd server && node dist/index.js 