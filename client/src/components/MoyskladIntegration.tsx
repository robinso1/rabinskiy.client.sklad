import React, { useState } from 'react';
import MoyskladService from '../services/moysklad.service';
import { 
  MoyskladProduct, 
  SyncResult 
} from '../types/moysklad.types';

// Тип для состояния загрузки
type LoadingState = {
  connection: boolean;
  products: boolean;
  import: boolean;
  sync: boolean;
};

/**
 * Компонент для интеграции с МойСклад
 */
const MoyskladIntegration: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [products, setProducts] = useState<MoyskladProduct[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    connection: false,
    products: false,
    import: false,
    sync: false
  });
  const [error, setError] = useState<string | null>(null);

  // Проверка соединения с МойСклад API
  const checkConnection = async () => {
    setLoading((prev: LoadingState) => ({ ...prev, connection: true }));
    setError(null);
    
    try {
      const response = await MoyskladService.checkConnection();
      setConnectionStatus({
        success: response.success,
        message: response.message
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при проверке соединения с МойСклад');
      setConnectionStatus({
        success: false,
        message: 'Не удалось подключиться к МойСклад API'
      });
    } finally {
      setLoading((prev: LoadingState) => ({ ...prev, connection: false }));
    }
  };

  // Получение списка товаров из МойСклад
  const getProducts = async () => {
    setLoading((prev: LoadingState) => ({ ...prev, products: true }));
    setError(null);
    
    try {
      const response = await MoyskladService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Ошибка при получении товаров');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при получении товаров из МойСклад');
    } finally {
      setLoading((prev: LoadingState) => ({ ...prev, products: false }));
    }
  };

  // Импорт товаров из МойСклад в локальную базу данных
  const importProducts = async () => {
    setLoading((prev: LoadingState) => ({ ...prev, import: true }));
    setError(null);
    
    try {
      const response = await MoyskladService.importProducts();
      if (response.success && response.data) {
        setSyncResult(response.data);
      } else {
        setError(response.message || 'Ошибка при импорте товаров');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при импорте товаров из МойСклад');
    } finally {
      setLoading((prev: LoadingState) => ({ ...prev, import: false }));
    }
  };

  // Синхронизация остатков материалов с МойСклад
  const syncStock = async () => {
    setLoading((prev: LoadingState) => ({ ...prev, sync: true }));
    setError(null);
    
    try {
      const response = await MoyskladService.syncStock();
      if (response.success && response.data) {
        setSyncResult(response.data);
      } else {
        setError(response.message || 'Ошибка при синхронизации остатков');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при синхронизации остатков с МойСклад');
    } finally {
      setLoading((prev: LoadingState) => ({ ...prev, sync: false }));
    }
  };

  return (
    <div className="moysklad-integration">
      <h2>Интеграция с МойСклад</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header">
          <h3>Статус соединения</h3>
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3" 
            onClick={checkConnection}
            disabled={loading.connection}
          >
            {loading.connection ? 'Проверка...' : 'Проверить соединение'}
          </button>
          
          {connectionStatus && (
            <div className={`alert ${connectionStatus.success ? 'alert-success' : 'alert-danger'}`}>
              {connectionStatus.message}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h3>Управление товарами</h3>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <button 
              className="btn btn-primary" 
              onClick={getProducts}
              disabled={loading.products}
            >
              {loading.products ? 'Загрузка...' : 'Получить товары'}
            </button>
            
            <button 
              className="btn btn-success" 
              onClick={importProducts}
              disabled={loading.import}
            >
              {loading.import ? 'Импорт...' : 'Импортировать товары'}
            </button>
            
            <button 
              className="btn btn-info" 
              onClick={syncStock}
              disabled={loading.sync}
            >
              {loading.sync ? 'Синхронизация...' : 'Синхронизировать остатки'}
            </button>
          </div>
          
          {syncResult && (
            <div className="alert alert-info">
              <h4>Результат синхронизации:</h4>
              <ul>
                <li>Всего обработано: {syncResult.total}</li>
                <li>Создано: {syncResult.created}</li>
                <li>Обновлено: {syncResult.updated}</li>
                <li>Ошибок: {syncResult.errors}</li>
              </ul>
              {syncResult.details && syncResult.details.length > 0 && (
                <>
                  <h5>Детали:</h5>
                  <ul>
                    {syncResult.details.map((detail: string, index: number) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          
          {products.length > 0 && (
            <div className="mt-4">
              <h4>Список товаров из МойСклад ({products.length})</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Код</th>
                      <th>Артикул</th>
                      <th>Цена</th>
                      <th>Единица</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: MoyskladProduct) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.code || '-'}</td>
                        <td>{product.article || '-'}</td>
                        <td>{product.price || 0}</td>
                        <td>{product.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoyskladIntegration; 