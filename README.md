# Система управления складом "Рабинский Склад"

## Описание
Система управления складом позволяет вести учет материалов, заказов, технологических процессов и рабочего времени сотрудников. Интегрируется с системой "МойСклад" для синхронизации данных о материалах.

## Требования
- Node.js (версия 18 или выше)
- MongoDB (версия 4.4 или выше)
- npm (версия 6 или выше)
- Docker и Docker Compose (опционально)

## Структура проекта
- `/server` - серверная часть приложения (API)
- `/client` - клиентская часть приложения (в разработке)
- `/shared` - общие типы и утилиты для клиента и сервера

## Установка и запуск

### Локальная разработка

1. Клонируйте репозиторий:
```
git clone <URL репозитория>
cd sklad
```

2. Установите зависимости и запустите сервер:
```
cd server
npm install
cp .env.example .env  # Создайте и настройте файл .env
npm run dev
```

### Запуск с использованием Docker

```
cd server
docker-compose up -d
```

Сервер будет доступен по адресу: http://localhost:10000

## Деплой на Render

Для деплоя на платформу Render.com следуйте инструкциям в файле [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md).

### Переменные окружения для Render

```
PORT=10000
MONGODB_URI=<URI для подключения к MongoDB>
JWT_SECRET=<секретный ключ для JWT>
JWT_EXPIRES_IN=24
MOYSKLAD_LOGIN=demo
MOYSKLAD_PASSWORD=demo
MOYSKLAD_API_URL=https://api.moysklad.ru/api/remap/1.2
NODE_ENV=production
INIT_DB=true
```

## CI/CD

Проект настроен для непрерывной интеграции и доставки с использованием GitHub Actions. При каждом пуше в ветку `main` автоматически запускаются тесты и, в случае успеха, происходит деплой на Render.

## API Endpoints

Основные эндпоинты API:

- `/api/auth` - аутентификация и управление пользователями
- `/api/materials` - управление материалами
- `/api/operations` - управление операциями
- `/api/orders` - управление заказами
- `/api/workTime` - учет рабочего времени
- `/api/reports` - отчеты
- `/api/moysklad` - интеграция с МойСклад
- `/api/health` - проверка состояния приложения

## Лицензия

MIT

## Учетные данные для входа
- Администратор: 
  - Логин: admin
  - Пароль: password
- Работник:
  - Логин: worker1
  - Пароль: password

## Интеграция с МойСклад

Система поддерживает интеграцию с сервисом "МойСклад" для синхронизации данных о материалах и товарах.

### Настройка интеграции

1. Зарегистрируйтесь на сайте [МойСклад](https://www.moysklad.ru/) и получите доступ к API.
2. Заполните учетные данные в файле `.env`, который находится в директории `server`:

```
MOYSKLAD_LOGIN=ваш_email@example.com
MOYSKLAD_PASSWORD=ваш_пароль
MOYSKLAD_API_URL=https://api.moysklad.ru/api/remap/1.2
```

### Функции интеграции

После настройки интеграции вам будут доступны следующие возможности:

- Получение списка товаров из МойСклад
- Импорт товаров из МойСклад в локальную базу данных
- Синхронизация остатков материалов с МойСклад
- Проверка соединения с МойСклад API

### Примеры использования API

Ниже приведены примеры использования API для интеграции с МойСклад:

#### Получение списка товаров из МойСклад

```
curl -X GET http://localhost:5001/api/moysklad/products -H "Authorization: Bearer ваш_токен"
```

#### Импорт товаров из МойСклад в локальную базу данных

```
curl -X POST http://localhost:5001/api/moysklad/import/products -H "Authorization: Bearer ваш_токен"
```

#### Синхронизация остатков материалов с МойСклад

```
curl -X POST http://localhost:5001/api/moysklad/sync/stock -H "Authorization: Bearer ваш_токен"
```

### Проверка соединения

Для проверки соединения с МойСклад API выполните следующий запрос:

```
curl -X GET http://localhost:5001/api/moysklad/check-connection -H "Authorization: Bearer ваш_токен"
```

где `ваш_токен` - это JWT токен, полученный при авторизации в системе.

## Возможные проблемы и их решение

### Порт 5001 уже используется

Если при запуске вы видите ошибку `Error: listen EADDRINUSE: address already in use :::5001`, это означает, что порт 5001 уже занят другим процессом. Для решения:

1. Найдите процесс, использующий порт:
```
lsof -i :5001
```

2. Завершите процесс:
```
kill -9 <PID>
```
где <PID> - идентификатор процесса из предыдущей команды.

3. Или измените порт в файле `.env`:
```
PORT=5002
```

### Проблемы с nodemon

Если вы видите ошибку `sh: nodemon: command not found`, установите nodemon глобально:
```
npm install -g nodemon
```

## Функциональность

- Управление пользователями (администраторы и работники)
- Управление материалами
- Управление заказами
- Управление технологическими процессами
- Учет рабочего времени
- Интеграция с МойСклад (при наличии учетных данных)

## Контакты для поддержки

При возникновении вопросов или проблем обращайтесь по адресу: [ваш_email@example.com]
