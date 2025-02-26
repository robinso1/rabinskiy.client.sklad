// Material controller

import { Request, Response } from 'express';
import Material from '../models/material.model';

// Получение списка материалов
export const getMaterials = async (req: Request, res: Response) => {
  try {
    // Параметры запроса
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;
    
    // Формирование фильтра
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Получение материалов из базы данных
    const materials = await Material.find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ name: 1 });
    
    // Получение общего количества материалов
    const total = await Material.countDocuments(filter);
    
    return res.json({
      success: true,
      message: 'Список материалов',
      data: materials,
      meta: {
        total,
        limit,
        offset
      }
    });
  } catch (error: any) {
    console.error('Ошибка получения списка материалов:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения списка материалов',
      errors: [error.message]
    });
  }
};

// Получение материала по ID
export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const materialId = req.params.id;
    
    // Получение материала из базы данных
    const material = await Material.findById(materialId);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Материал не найден',
        errors: ['Материал не найден']
      });
    }
    
    return res.json({
      success: true,
      message: 'Информация о материале',
      data: material
    });
  } catch (error: any) {
    console.error('Ошибка получения информации о материале:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения информации о материале',
      errors: [error.message]
    });
  }
};

// Создание нового материала
export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { name, code, unit, description, price, inStock, moyskladId, externalId } = req.body;
    
    // Проверка наличия обязательных полей
    if (!name || !code || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать название, код и единицу измерения материала',
        errors: ['Необходимо указать название, код и единицу измерения материала']
      });
    }
    
    // Проверка уникальности кода материала
    const existingMaterial = await Material.findOne({ code });
    
    if (existingMaterial) {
      return res.status(400).json({
        success: false,
        message: 'Материал с таким кодом уже существует',
        errors: ['Материал с таким кодом уже существует']
      });
    }
    
    // Создание нового материала
    const newMaterial = new Material({
      name,
      code,
      unit,
      description,
      price: price || 0,
      inStock: inStock || 0,
      moyskladId,
      externalId
    });
    
    // Сохранение материала в базе данных
    await newMaterial.save();
    
    return res.status(201).json({
      success: true,
      message: 'Материал успешно создан',
      data: newMaterial
    });
  } catch (error: any) {
    console.error('Ошибка создания материала:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка создания материала',
      errors: [error.message]
    });
  }
};

// Обновление материала
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const materialId = req.params.id;
    const { name, unit, description, price, inStock, moyskladId, externalId } = req.body;
    
    // Получение материала из базы данных
    const material = await Material.findById(materialId);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Материал не найден',
        errors: ['Материал не найден']
      });
    }
    
    // Обновление данных материала
    if (name) material.name = name;
    if (unit) material.unit = unit;
    if (description !== undefined) material.description = description;
    if (price !== undefined) material.price = price;
    if (inStock !== undefined) material.inStock = inStock;
    if (moyskladId !== undefined) material.moyskladId = moyskladId;
    if (externalId !== undefined) material.externalId = externalId;
    
    // Сохранение обновленного материала
    await material.save();
    
    return res.json({
      success: true,
      message: 'Материал успешно обновлен',
      data: material
    });
  } catch (error: any) {
    console.error('Ошибка обновления материала:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления материала',
      errors: [error.message]
    });
  }
};

// Удаление материала
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const materialId = req.params.id;
    
    // Получение материала из базы данных
    const material = await Material.findById(materialId);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Материал не найден',
        errors: ['Материал не найден']
      });
    }
    
    // Удаление материала
    await Material.findByIdAndDelete(materialId);
    
    return res.json({
      success: true,
      message: 'Материал успешно удален'
    });
  } catch (error: any) {
    console.error('Ошибка удаления материала:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка удаления материала',
      errors: [error.message]
    });
  }
}; 