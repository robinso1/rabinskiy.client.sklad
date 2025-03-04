// Конфигурация для MongoDB Atlas

/**
 * Создает URI для подключения к MongoDB Atlas
 * @param username Имя пользователя
 * @param password Пароль
 * @param cluster Имя кластера (например, cluster0.zvuor)
 * @param database Имя базы данных
 * @returns URI для подключения к MongoDB Atlas
 */
export const createMongoDBAtlasURI = (
  username: string,
  password: string,
  cluster: string,
  database: string
): string => {
  // Кодируем специальные символы в имени пользователя и пароле
  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);
  
  // Формируем URI для подключения
  return `mongodb+srv://${encodedUsername}:${encodedPassword}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority&ssl=true`;
};

/**
 * Проверяет, является ли URI строкой подключения к MongoDB Atlas
 * @param uri URI для проверки
 * @returns true, если URI является строкой подключения к MongoDB Atlas
 */
export const isMongoDBAtlasURI = (uri: string): boolean => {
  return uri.startsWith('mongodb+srv://');
};

/**
 * Извлекает имя кластера из URI MongoDB Atlas
 * @param uri URI MongoDB Atlas
 * @returns Имя кластера или null, если URI не является строкой подключения к MongoDB Atlas
 */
export const extractClusterName = (uri: string): string | null => {
  if (!isMongoDBAtlasURI(uri)) {
    return null;
  }
  
  try {
    // Извлекаем часть URI после @ и до .mongodb.net
    const match = uri.match(/@([^.]+\.[\w]+)/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

export default {
  createMongoDBAtlasURI,
  isMongoDBAtlasURI,
  extractClusterName
}; 