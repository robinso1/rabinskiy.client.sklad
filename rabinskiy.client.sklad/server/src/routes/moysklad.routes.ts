// MoySklad routes

import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import { IMaterial } from '../models/material.model';
import { auth } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';
import { MoyskladProductsResponse, MoyskladStockResponse, SyncResult } from '../types/api';

const router = express.Router();
const Material = mongoose.model<IMaterial>('Material');

// Функция для получения заголовков авторизации для МойСклад API
const getMoyskladAuthHeaders = () => {
  const login = process.env.MOYSKLAD_LOGIN;
  const password = process.env.MOYSKLAD_PASSWORD;
  
  if (!login || !password) {
    throw new Error('МойСклад credentials not found in environment variables');
  }
  
  const auth = Buffer.from(`${login}:${password}`).toString('base64');
  return {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json'
  };
};

// Получить список товаров из МойСклад
router.get('/products', auth, async (req, res) => {
  try {
    const response = await axios.get<MoyskladProductsResponse>(
      `${process.env.MOYSKLAD_API_URL}/entity/product`,
      { headers: getMoyskladAuthHeaders() }
    );
    
    return res.json({
      success: true,
      data: response.data.rows.map(product => ({
        id: product.id,
        name: product.name,
        code: product.code,
        article: product.article,
        description: product.description,
        price: product.price,
        uom: product.uom
      }))
    });
  } catch (error) {
    console.error('Error fetching products from МойСклад:', error);
    return res.status(500).json({
      success: false,
      errors: ['Failed to fetch products from МойСклад']
    });
  }
});

// Импортировать товары из МойСклад в локальную базу данных
router.post('/import/products', auth, admin, async (req, res) => {
  try {
    const response = await axios.get<MoyskladProductsResponse>(
      `${process.env.MOYSKLAD_API_URL}/entity/product`,
      { headers: getMoyskladAuthHeaders() }
    );
    
    const products = response.data.rows;
    const result: SyncResult = {
      total: products.length,
      created: 0,
      updated: 0,
      errors: 0,
      details: []
    };
    
    for (const product of products) {
      try {
        // Проверяем, существует ли материал с таким внешним ID
        let material = await Material.findOne({ externalId: product.id });
        
        if (material) {
          // Обновляем существующий материал
          material.name = product.name;
          material.code = product.code || '';
          material.description = product.description || '';
          material.price = product.price || 0;
          material.unit = product.uom || 'шт';
          
          await material.save();
          result.updated++;
        } else {
          // Создаем новый материал
          material = new Material({
            name: product.name,
            code: product.code || '',
            description: product.description || '',
            price: product.price || 0,
            unit: product.uom || 'шт',
            externalId: product.id,
            quantity: 0
          });
          
          await material.save();
          result.created++;
        }
      } catch (error: any) {
        console.error(`Error processing product ${product.name}:`, error);
        result.errors++;
        if (result.details) {
          result.details.push(`Error processing ${product.name}: ${error.message}`);
        }
      }
    }
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error importing products from МойСклад:', error);
    return res.status(500).json({
      success: false,
      errors: ['Failed to import products from МойСклад']
    });
  }
});

// Синхронизировать остатки материалов с МойСклад
router.post('/sync/stock', auth, admin, async (req, res) => {
  try {
    // Получаем остатки из МойСклад
    const response = await axios.get<MoyskladStockResponse>(
      `${process.env.MOYSKLAD_API_URL}/report/stock/all`,
      { headers: getMoyskladAuthHeaders() }
    );
    
    const stockItems = response.data.rows;
    const result: SyncResult = {
      total: stockItems.length,
      updated: 0,
      created: 0,
      errors: 0,
      details: []
    };
    
    for (const item of stockItems) {
      try {
        // Находим материал по внешнему ID
        const material = await Material.findOne({ externalId: item.id });
        
        if (material) {
          // Обновляем количество
          material.inStock = item.stock || 0;
          material.quantity = item.stock || 0;
          await material.save();
          result.updated++;
        } else {
          result.errors++;
          if (result.details) {
            result.details.push(`Material with external ID ${item.id} not found`);
          }
        }
      } catch (error: any) {
        console.error(`Error syncing stock for item ${item.name}:`, error);
        result.errors++;
        if (result.details) {
          result.details.push(`Error syncing stock for ${item.name}: ${error.message}`);
        }
      }
    }
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error syncing stock with МойСклад:', error);
    return res.status(500).json({
      success: false,
      errors: ['Failed to sync stock with МойСклад']
    });
  }
});

// Проверить соединение с МойСклад API
router.get('/check-connection', auth, admin, async (req, res) => {
  try {
    await axios.get(
      `${process.env.MOYSKLAD_API_URL}/entity/organization`,
      { headers: getMoyskladAuthHeaders() }
    );
    
    return res.json({
      success: true,
      message: 'Connection to МойСклад API successful'
    });
  } catch (error) {
    console.error('Error connecting to МойСклад API:', error);
    return res.status(500).json({
      success: false,
      errors: ['Failed to connect to МойСклад API']
    });
  }
});

export default router;
