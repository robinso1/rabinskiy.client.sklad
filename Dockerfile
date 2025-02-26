FROM node:18-alpine

WORKDIR /app

# Копирование файлов проекта
COPY . .

# Установка зависимостей для корневого проекта
RUN npm install

# Установка зависимостей и сборка клиента
WORKDIR /app/client
RUN npm install
RUN npm run build

# Установка зависимостей и сборка сервера
WORKDIR /app/server
RUN npm install
RUN npm run build

# Создание директорий для логов и данных
RUN mkdir -p /app/server/logs
RUN mkdir -p /app/server/data

# Возврат в корневую директорию
WORKDIR /app

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