FROM node:18-alpine

WORKDIR /app

# Копирование файлов проекта
COPY . .

# Установка зависимостей для клиента и сервера
RUN npm install
RUN cd server && npm install

# Сборка клиента
RUN npm run build

# Сборка сервера
RUN cd server && npm run build

# Создание директории для логов
RUN mkdir -p /app/server/logs
RUN mkdir -p /app/server/data

# Установка переменных окружения по умолчанию
ENV PORT=10000
ENV NODE_ENV=production

# Открытие порта
EXPOSE 10000

# Проверка работоспособности
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/api/health || exit 1

# Запуск сервера
CMD cd server && node dist/index.js 