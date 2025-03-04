# Rabinskiy Sklad API

Серверная часть приложения для учета рабочего времени и управления складом.

## Требования

- Node.js 18 или выше
- MongoDB 6.0 или выше
- Docker и Docker Compose (опционально)

## Установка и запуск

### Локальная разработка

1. Клонировать репозиторий:
```bash
git clone https://github.com/dipene6006/skladdd.git
cd skladdd/server
```

2. Установить зависимости:
```bash
npm install
```

3. Создать файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Отредактировать файл `.env` и указать необходимые параметры.

5. Инициализировать базу данных (при первом запуске):
```bash
npm run init-db
```

6. Запустить сервер в режиме разработки:
```bash
npm run dev
```

### Запуск с использованием Docker

1. Клонировать репозиторий:
```bash
git clone https://github.com/dipene6006/skladdd.git
cd skladdd/server
```

2. Запустить приложение с помощью Docker Compose:
```bash
docker-compose up -d
```

Приложение будет доступно по адресу: http://localhost:10000

## Структура проекта

```
server/
├── src/                  # Исходный код
│   ├── controllers/      # Контроллеры
│   ├── middleware/       # Промежуточные обработчики
│   ├── models/           # Модели данных
│   ├── routes/           # Маршруты API
│   ├── scripts/          # Скрипты для инициализации и тестирования
│   ├── types/            # TypeScript типы
│   └── index.ts          # Точка входа
├── dist/                 # Скомпилированный код
├── logs/                 # Логи приложения
├── data/                 # Данные приложения
├── .env                  # Переменные окружения
├── .env.example          # Пример файла переменных окружения
├── Dockerfile            # Файл для сборки Docker образа
├── docker-compose.yml    # Конфигурация Docker Compose
├── package.json          # Зависимости и скрипты
└── tsconfig.json         # Конфигурация TypeScript
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация нового пользователя
- `GET /api/auth/me` - Получение информации о текущем пользователе

### Пользователи
- `GET /api/users` - Получение списка пользователей
- `GET /api/users/:id` - Получение информации о пользователе
- `PUT /api/users/:id` - Обновление информации о пользователе
- `DELETE /api/users/:id` - Удаление пользователя

### Операции
- `GET /api/operations` - Получение списка операций
- `POST /api/operations` - Создание новой операции
- `GET /api/operations/:id` - Получение информации об операции
- `PUT /api/operations/:id` - Обновление информации об операции
- `DELETE /api/operations/:id` - Удаление операции

### Материалы
- `GET /api/materials` - Получение списка материалов
- `POST /api/materials` - Создание нового материала
- `GET /api/materials/:id` - Получение информации о материале
- `PUT /api/materials/:id` - Обновление информации о материале
- `DELETE /api/materials/:id` - Удаление материала

### Заказы
- `GET /api/orders` - Получение списка заказов
- `POST /api/orders` - Создание нового заказа
- `GET /api/orders/:id` - Получение информации о заказе
- `PUT /api/orders/:id` - Обновление информации о заказе
- `DELETE /api/orders/:id` - Удаление заказа

### Учет рабочего времени
- `GET /api/worktime` - Получение записей учета рабочего времени
- `POST /api/worktime` - Создание новой записи учета рабочего времени
- `GET /api/worktime/:id` - Получение информации о записи учета рабочего времени
- `PUT /api/worktime/:id` - Обновление информации о записи учета рабочего времени
- `DELETE /api/worktime/:id` - Удаление записи учета рабочего времени
- `PATCH /api/worktime/:id/approve` - Утверждение записи учета рабочего времени
- `PATCH /api/worktime/:id/unapprove` - Отмена утверждения записи учета рабочего времени

### Отчеты
- `GET /api/reports/salary` - Получение отчета по зарплате
- `GET /api/reports/orders` - Получение отчета по заказам

### Интеграция с МойСклад
- `GET /api/moysklad/check` - Проверка подключения к МойСклад
- `GET /api/moysklad/products` - Получение списка товаров из МойСклад
- `POST /api/moysklad/import` - Импорт товаров из МойСклад
- `POST /api/moysklad/sync` - Синхронизация остатков с МойСклад

### Проверка работоспособности
- `GET /health` - Проверка работоспособности сервера
- `GET /health/db` - Проверка подключения к базе данных
- `GET /health/env` - Проверка переменных окружения

## Деплой

Для деплоя на Render.com смотрите инструкции в файле [RENDER_DEPLOY.md](./RENDER_DEPLOY.md).

## Лицензия

MIT 