FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Установка зависимостей для корневого проекта
RUN npm install

# Копирование исходного кода
COPY . .

# Установка зависимостей и сборка клиента
WORKDIR /app/client
RUN npm install
RUN npm run build

# Установка зависимостей и сборка сервера
WORKDIR /app/server
RUN npm install
RUN npm run build

# Создание директорий для логов и данных
WORKDIR /app
RUN mkdir -p logs data

# Установка переменных окружения
ENV PORT=10000
ENV NODE_ENV=production

# Открытие порта
EXPOSE 10000

# Проверка здоровья приложения
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:10000/api/health || exit 1

# Запуск сервера
CMD ["node", "server/dist/index.js"] 