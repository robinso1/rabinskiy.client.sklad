// Конфигурация для Render

/**
 * Проверяет, запущено ли приложение на платформе Render
 * @returns true, если приложение запущено на Render
 */
export const isRunningOnRender = (): boolean => {
  return process.env.RENDER === 'true';
};

/**
 * Получает URL сервиса на Render
 * @returns URL сервиса или undefined, если не запущено на Render
 */
export const getRenderServiceUrl = (): string | undefined => {
  return process.env.RENDER_EXTERNAL_URL;
};

/**
 * Получает имя сервиса на Render
 * @returns Имя сервиса или undefined, если не запущено на Render
 */
export const getRenderServiceName = (): string | undefined => {
  return process.env.RENDER_SERVICE_NAME;
};

/**
 * Получает ID сервиса на Render
 * @returns ID сервиса или undefined, если не запущено на Render
 */
export const getRenderServiceId = (): string | undefined => {
  return process.env.RENDER_SERVICE_ID;
};

/**
 * Получает информацию о среде выполнения на Render
 * @returns Объект с информацией о среде выполнения
 */
export const getRenderEnvironmentInfo = () => {
  return {
    isRender: isRunningOnRender(),
    serviceUrl: getRenderServiceUrl(),
    serviceName: getRenderServiceName(),
    serviceId: getRenderServiceId(),
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  };
};

export default {
  isRunningOnRender,
  getRenderServiceUrl,
  getRenderServiceName,
  getRenderServiceId,
  getRenderEnvironmentInfo
}; 