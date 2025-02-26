// MoySklad Controller

import axios from 'axios';
import { Request, Response } from 'express';
import Material from '../models/material.model';
import { MoyskladProductsResponse, MoyskladStockResponse, SyncResult } from '../types/api';

// Получение заголовков авторизации для МойСклад API
const getMoyskladAuthHeaders = () => {
  const login = process.env.MOYSKLAD_LOGIN || '';
  const password = process.env.MOYSKLAD_PASSWORD || '';
  const base64Auth = Buffer.from(`${login}:${password}`).toString('base64');
  
  return {
    'Authorization': `Basic ${base64Auth}`,
    'Content-Type': 'application/json'
  };
};

// Проверка соединения с МойСклад API
export const checkConnection = async (req: Request, res: Response) => {
  try {
    const apiUrl = process.env.MOYSKLAD_API_URL || '';
    const headers = getMoyskladAuthHeaders();
    
    // Делаем тестовый запрос к API
    const response = await axios.get(`${apiUrl}/entity/organization`, { headers });
    
    if (response.status === 200) {
      return res.json({
        success: true,
        message: 'Connection to МойСклад API successful'
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: `Connection failed with status: ${response.status}`
      });
    }
  } catch (error: any) {
    console.error('Error checking МойСклад connection:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to МойСклад API',
      errors: [error.message]
    });
  }
};

// Получение списка товаров из МойСклад
export const getProducts = async (req: Request, res: Response) => {
  try {
    const apiUrl = process.env.MOYSKLAD_API_URL || '';
    const headers = getMoyskladAuthHeaders();
    
    // Получаем параметры запроса
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    // Делаем запрос к API
    const response = await axios.get<MoyskladProductsResponse>(
      `${apiUrl}/entity/product`, 
      { 
        headers,
        params: { limit, offset }
      }
    );
    
    // Преобразуем данные в нужный формат
    const products = response.data.rows.map(product => ({
      id: product.id,
      name: product.name,
      code: product.code || '',
      article: product.article || '',
      description: product.description || '',
      price: product.price || 0,
      unit: product.uom ? product.uom.name : 'шт'
    }));
    
    return res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      meta: response.data.meta
    });
  } catch (error: any) {
    console.error('Error getting products from МойСклад:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get products from МойСклад',
      errors: [error.message]
    });
  }
};

// Импорт товаров из МойСклад в локальную базу данных
export const importProducts = async (req: Request, res: Response) => {
  try {
    const apiUrl = process.env.MOYSKLAD_API_URL || '';
    const headers = getMoyskladAuthHeaders();
    
    // Получаем все товары из МойСклад
    const response = await axios.get<MoyskladProductsResponse>(
      `${apiUrl}/entity/product`, 
      { headers, params: { limit: 1000 } }
    );
    
    const result: SyncResult = {
      total: response.data.rows.length,
      created: 0,
      updated: 0,
      errors: 0,
      details: []
    };
    
    // Обрабатываем каждый товар
    for (const product of response.data.rows) {
      try {
        // Проверяем, существует ли материал с таким moyskladId
        let material = await Material.findOne({ moyskladId: product.id });
        
        // Подготавливаем данные для материала
        const materialData = {
          name: product.name,
          code: product.code || product.id.substring(0, 10),
          unit: product.uom ? product.uom.name : 'шт',
          description: product.description || '',
          price: product.price || 0,
          moyskladId: product.id,
          quantity: product.quantity || 0
        };
        
        if (material) {
          // Обновляем существующий материал
          await Material.updateOne({ _id: material._id }, materialData);
          result.updated++;
        } else {
          // Создаем новый материал
          await Material.create(materialData);
          result.created++;
        }
      } catch (error: any) {
        result.errors++;
        result.details?.push(`Error processing product ${product.name}: ${error.message}`);
      }
    }
    
    return res.json({
      success: true,
      message: 'Products imported successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error importing products from МойСклад:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to import products from МойСклад',
      errors: [error.message]
    });
  }
};

// Синхронизация остатков материалов с МойСклад
export const syncStock = async (req: Request, res: Response) => {
  try {
    const apiUrl = process.env.MOYSKLAD_API_URL || '';
    const headers = getMoyskladAuthHeaders();
    
    // Получаем остатки товаров из МойСклад
    const response = await axios.get<MoyskladStockResponse>(
      `${apiUrl}/report/stock/all`, 
      { headers }
    );
    
    const result: SyncResult = {
      total: response.data.rows.length,
      updated: 0,
      created: 0,
      errors: 0,
      details: []
    };
    
    // Обрабатываем каждый товар
    for (const item of response.data.rows) {
      try {
        // Обновляем количество материала
        const updateResult = await Material.updateOne(
          { moyskladId: item.id },
          { $set: { quantity: item.stock, inStock: item.stock } }
        );
        
        if (updateResult.modifiedCount > 0) {
          result.updated++;
        } else {
          result.details?.push(`Material with moyskladId ${item.id} not found`);
        }
      } catch (error: any) {
        result.errors++;
        result.details?.push(`Error updating stock for product ${item.name}: ${error.message}`);
      }
    }
    
    return res.json({
      success: true,
      message: 'Stock synchronized successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error synchronizing stock with МойСклад:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to synchronize stock with МойСклад',
      errors: [error.message]
    });
  }
};
