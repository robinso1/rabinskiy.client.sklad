FROM node:18-alpine

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Создаем директории для логов и данных
RUN mkdir -p logs data

# Собираем приложение
RUN npm run build

# Добавляем healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Открываем порт
EXPOSE ${PORT}

# Запускаем сервер
CMD ["npm", "start"] 