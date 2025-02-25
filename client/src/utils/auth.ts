/**
 * Утилиты для работы с аутентификацией
 */

// Ключ для хранения токена в localStorage
const TOKEN_KEY = 'auth_token';

/**
 * Получение токена аутентификации из localStorage
 * @returns {string|null} Токен аутентификации или null, если токен не найден
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Сохранение токена аутентификации в localStorage
 * @param {string} token - Токен аутентификации
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Удаление токена аутентификации из localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Проверка наличия токена аутентификации
 * @returns {boolean} true, если токен существует, иначе false
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Получение данных пользователя из токена JWT
 * @returns {any} Данные пользователя или null, если токен не найден или невалиден
 */
export const getUserFromToken = (): any => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Декодирование JWT токена
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 