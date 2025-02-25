import express, { Request, Response } from 'express';
import TechProcess from '../models/techProcess.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка всех технологических процессов
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const techProcesses = await TechProcess.find()
      .populate('operations.operation')
      .populate('materials.material');
    res.json(techProcesses);
  } catch (error) {
    console.error('Ошибка при получении списка технологических процессов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка технологических процессов' });
  }
});

// Создание нового технологического процесса (только для админов)
router.post('/', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, articleNumber, description, operations, materials, isActive } = req.body;

    // Проверка, существует ли техпроцесс с таким артикулом
    const existingTechProcess = await TechProcess.findOne({ articleNumber });
    if (existingTechProcess) {
      return res.status(400).json({ message: 'Технологический процесс с таким артикулом уже существует' });
    }

    // Создание нового технологического процесса
    const newTechProcess = new TechProcess({
      name,
      articleNumber,
      description,
      operations: operations || [],
      materials: materials || [],
      isActive: isActive !== undefined ? isActive : true
    });

    await newTechProcess.save();

    // Получение полных данных с заполненными ссылками
    const populatedTechProcess = await TechProcess.findById(newTechProcess._id)
      .populate('operations.operation')
      .populate('materials.material');

    res.status(201).json(populatedTechProcess);
  } catch (error) {
    console.error('Ошибка при создании технологического процесса:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании технологического процесса' });
  }
});

// Получение информации о конкретном технологическом процессе
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const techProcess = await TechProcess.findById(req.params.id)
      .populate('operations.operation')
      .populate('materials.material');
    
    if (!techProcess) {
      return res.status(404).json({ message: 'Технологический процесс не найден' });
    }

    res.json(techProcess);
  } catch (error) {
    console.error('Ошибка при получении информации о технологическом процессе:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении информации о технологическом процессе' });
  }
});

// Обновление технологического процесса (только для админов)
router.put('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, articleNumber, description, operations, materials, isActive } = req.body;

    // Проверка, существует ли техпроцесс с таким артикулом (кроме текущего)
    if (articleNumber) {
      const existingTechProcess = await TechProcess.findOne({ 
        articleNumber, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingTechProcess) {
        return res.status(400).json({ message: 'Технологический процесс с таким артикулом уже существует' });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (articleNumber !== undefined) updateData.articleNumber = articleNumber;
    if (description !== undefined) updateData.description = description;
    if (operations !== undefined) updateData.operations = operations;
    if (materials !== undefined) updateData.materials = materials;
    if (isActive !== undefined) updateData.isActive = isActive;

    const techProcess = await TechProcess.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate('operations.operation')
      .populate('materials.material');

    if (!techProcess) {
      return res.status(404).json({ message: 'Технологический процесс не найден' });
    }

    res.json(techProcess);
  } catch (error) {
    console.error('Ошибка при обновлении технологического процесса:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении технологического процесса' });
  }
});

// Удаление технологического процесса (только для админов)
router.delete('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const techProcess = await TechProcess.findByIdAndDelete(req.params.id);
    
    if (!techProcess) {
      return res.status(404).json({ message: 'Технологический процесс не найден' });
    }

    res.json({ message: 'Технологический процесс успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении технологического процесса:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении технологического процесса' });
  }
});

// Получение технологического процесса по артикулу
router.get('/article/:articleNumber', auth, async (req: Request, res: Response) => {
  try {
    const techProcess = await TechProcess.findOne({ articleNumber: req.params.articleNumber })
      .populate('operations.operation')
      .populate('materials.material');
    
    if (!techProcess) {
      return res.status(404).json({ message: 'Технологический процесс не найден' });
    }

    res.json(techProcess);
  } catch (error) {
    console.error('Ошибка при получении технологического процесса по артикулу:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении технологического процесса по артикулу' });
  }
});

export default router; 