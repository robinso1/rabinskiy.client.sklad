FROM node:18-alpine

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Копируем файлы package.json и package-lock.json сервера
COPY server/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код сервера
COPY server/ ./

# Устанавливаем TypeScript глобально
RUN npm install -g typescript

# Собираем приложение
RUN npm run build

# Создаем директории для логов и данных
RUN mkdir -p logs data

# Открываем порт
EXPOSE 10000

# Проверка здоровья приложения
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:10000/api/health || exit 1

# Запускаем сервер
CMD ["npm", "start"] 