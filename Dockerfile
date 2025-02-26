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

# Открываем порт
EXPOSE 10000

# Запускаем сервер
CMD ["npm", "start"] 