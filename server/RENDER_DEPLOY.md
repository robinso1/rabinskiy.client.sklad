# Инструкция по деплою на Render

## Подготовка MongoDB Atlas

1. Создайте бесплатный кластер на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Настройте доступ к базе данных:
   - Создайте пользователя базы данных с правами чтения и записи
   - Добавьте ваш IP-адрес в список разрешенных или разрешите доступ с любого IP (0.0.0.0/0)
3. Получите строку подключения MongoDB URI, которая будет выглядеть примерно так:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/rabinskiy-sklad?retryWrites=true&w=majority
   ```

## Создание веб-сервиса на Render

1. Зарегистрируйтесь или войдите в [Render](https://render.com/)
2. Нажмите "New" -> "Web Service"
3. Подключите свой GitHub репозиторий
4. Настройте следующие параметры:
   - **Name**: rabinskiy-sklad-api (или любое другое имя)
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: npm install && npm run build
   - **Start Command**: npm start
   - **Plan**: Free (или выберите другой план при необходимости)

## Настройка переменных окружения

Добавьте следующие переменные окружения в разделе "Environment Variables":

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=24
MONGODB_URI=your_mongodb_connection_string
MOYSKLAD_LOGIN=demo
MOYSKLAD_PASSWORD=demo
MOYSKLAD_API_URL=https://api.moysklad.ru/api/remap/1.2
INIT_DB=true
```

Замените `your_random_secret_key` на случайную строку для JWT токенов и `your_mongodb_connection_string` на строку подключения MongoDB, полученную на предыдущем шаге.

## Настройка Health Check

В разделе "Health Check" настройте следующие параметры:
- **Path**: /health
- **Status**: 200

## После деплоя

1. После успешного деплоя вы получите URL для доступа к вашему API
2. Проверьте работоспособность API, перейдя по URL
3. Используйте учетные данные по умолчанию для входа:
   - Username: admin
   - Password: admin123
4. После первого успешного деплоя измените переменную окружения `INIT_DB` на `false`, чтобы предотвратить повторную инициализацию базы данных при последующих деплоях

## Решение проблем

### Проблема: Сервер не запускается

**Решение:**
- Проверьте логи в разделе "Logs" на Render
- Убедитесь, что все переменные окружения настроены правильно
- Проверьте подключение к MongoDB

### Проблема: Ошибка подключения к MongoDB

**Решение:**
- Убедитесь, что строка подключения MONGODB_URI указана правильно
- Проверьте, что пользователь MongoDB имеет правильные права доступа
- Проверьте, что ваш IP-адрес или IP-адрес Render добавлен в список разрешенных в MongoDB Atlas 