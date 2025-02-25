#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Запуск приложения Склад ===${NC}"

# Проверка наличия .env файла
if [ ! -f "./server/.env" ]; then
  echo -e "${YELLOW}Файл .env не найден. Создаем файл с настройками по умолчанию...${NC}"
  cat > ./server/.env << EOL
# Порт для запуска сервера
PORT=5001

# URI для подключения к MongoDB
MONGODB_URI=mongodb://localhost:27017/rabinskiy-sklad

# Секретный ключ для JWT
JWT_SECRET=rabinskiy_sklad_secret_key_2023

# Время жизни токена (в часах)
JWT_EXPIRES_IN=24

# Данные для подключения к МойСклад API
MOYSKLAD_LOGIN=
MOYSKLAD_PASSWORD=
MOYSKLAD_API_URL=https://api.moysklad.ru/api/remap/1.2
EOL
  echo -e "${GREEN}Файл .env создан.${NC}"
fi

# Переход в директорию сервера
cd server

# Установка зависимостей
echo -e "${GREEN}Установка зависимостей...${NC}"
npm install

# Проверка успешности установки
if [ $? -ne 0 ]; then
  echo -e "${RED}Ошибка при установке зависимостей.${NC}"
  exit 1
fi

# Инициализация базы данных
echo -e "${GREEN}Инициализация базы данных тестовыми данными...${NC}"
npm run init-db

# Проверка успешности инициализации
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Предупреждение: Возникли проблемы при инициализации базы данных.${NC}"
  echo -e "${YELLOW}Приложение может работать некорректно.${NC}"
else
  echo -e "${GREEN}База данных успешно инициализирована.${NC}"
fi

# Запуск сервера
echo -e "${GREEN}Запуск сервера...${NC}"
echo -e "${GREEN}Сервер будет доступен по адресу: http://localhost:5001${NC}"
echo -e "${YELLOW}Для остановки сервера нажмите Ctrl+C${NC}"

# Запуск через npx для избежания проблем с глобальной установкой nodemon
npx nodemon src/index.ts 