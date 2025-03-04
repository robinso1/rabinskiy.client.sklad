import mongoose from 'mongoose';

// Опции подключения к MongoDB
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Таймаут выбора сервера: 10 секунд
  socketTimeoutMS: 45000, // Таймаут сокета: 45 секунд
  family: 4, // Использовать IPv4, избегать проблем с IPv6
  retryWrites: true,
  w: 'majority',
  ssl: true,
};

// Функция для подключения к MongoDB с повторными попытками
export const connectToDatabase = async (uri: string, maxRetries = 5, retryDelay = 5000): Promise<void> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`Попытка подключения к MongoDB (${retries + 1}/${maxRetries})...`);
      
      await mongoose.connect(uri);
      
      console.log('Успешное подключение к MongoDB!');
      return;
    } catch (error) {
      retries++;
      
      if (error instanceof Error) {
        console.error(`Ошибка подключения к MongoDB: ${error.message}`);
      } else {
        console.error('Неизвестная ошибка при подключении к MongoDB');
      }
      
      if (retries >= maxRetries) {
        console.error(`Превышено максимальное количество попыток (${maxRetries}). Подключение не удалось.`);
        throw error;
      }
      
      console.log(`Повторная попытка через ${retryDelay / 1000} секунд...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Обработчики событий соединения
mongoose.connection.on('connected', () => {
  console.log('Mongoose подключен к MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Ошибка соединения Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose отключен от MongoDB');
});

// Корректное закрытие соединения при завершении процесса
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Соединение с MongoDB закрыто из-за завершения приложения');
  process.exit(0);
});

export default mongoose;
