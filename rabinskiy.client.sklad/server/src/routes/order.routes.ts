// Order routes

import express, { Request, Response } from 'express';
import Order from '../models/order.model';
import TechProcess from '../models/techProcess.model';
import UserRate from '../models/operations/userRate.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка всех заказов с возможностью фильтрации
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const { userId, orderNumber, articleNumber, status, startDate, endDate } = req.query;
    
    // Формирование фильтра
    const filter: any = {};
    
    if (orderNumber) filter.orderNumber = orderNumber;
    if (articleNumber) filter.articleNumber = articleNumber;
    if (status) filter.status = status;
    
    // Фильтр по дате
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate as string);
      if (endDate) filter.startDate.$lte = new Date(endDate as string);
    }
    
    // Фильтр по исполнителю (только для админов или для самого исполнителя)
    if (userId) {
      if (req.userRole === 'admin' || req.userId === userId) {
        filter['operations.assignedTo'] = userId;
      } else {
        return res.status(403).json({ message: 'Доступ запрещен' });
      }
    } else if (req.userRole !== 'admin') {
      // Обычные пользователи видят только свои заказы
      filter['operations.assignedTo'] = req.userId;
    }

    const orders = await Order.find(filter)
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material')
      .populate('parentOrder', 'orderNumber')
      .sort({ startDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении списка заказов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка заказов' });
  }
});

// Создание нового заказа (только для админов)
router.post('/', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { 
      orderNumber, 
      articleNumber, 
      quantity, 
      operations, 
      materials, 
      status, 
      comments,
      parentOrder
    } = req.body;

    // Проверка, существует ли заказ с таким номером
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      return res.status(400).json({ message: 'Заказ с таким номером уже существует' });
    }

    // Если не указаны операции, попробуем получить их из техпроцесса
    let orderOperations = operations;
    let orderMaterials = materials;

    if ((!orderOperations || orderOperations.length === 0) && articleNumber) {
      const techProcess = await TechProcess.findOne({ articleNumber })
        .populate('operations.operation')
        .populate('materials.material');
      
      if (techProcess) {
        // Преобразование операций из техпроцесса в операции заказа
        orderOperations = techProcess.operations.map(tpOp => ({
          operation: tpOp.operation._id,
          quantity: quantity,
          completedQuantity: 0,
          rate: (tpOp.operation as any).defaultRate,
          status: 'pending'
        }));

        // Преобразование материалов из техпроцесса в материалы заказа
        orderMaterials = techProcess.materials.map(tpMat => ({
          material: tpMat.material._id,
          quantity: quantity * (tpMat as any).quantity,
          unit: (tpMat.material as any).unit
        }));
      }
    }

    // Создание нового заказа
    const newOrder = new Order({
      orderNumber,
      articleNumber,
      quantity,
      operations: orderOperations || [],
      materials: orderMaterials || [],
      status: status || 'created',
      startDate: new Date(),
      comments,
      parentOrder
    });

    await newOrder.save();

    // Получение полных данных с заполненными ссылками
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material')
      .populate('parentOrder', 'orderNumber');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании заказа' });
  }
});

// Получение информации о конкретном заказе
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material')
      .populate('parentOrder', 'orderNumber')
      .populate({
        path: 'childOrders.orderId',
        select: 'orderNumber articleNumber quantity status'
      });
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Проверка прав доступа: админ может видеть все заказы, 
    // обычный пользователь - только те, где он исполнитель
    if (req.userRole !== 'admin') {
      const isAssigned = order.operations.some(op => 
        op.assignedTo && op.assignedTo.toString() === req.userId
      );
      
      if (!isAssigned) {
        return res.status(403).json({ message: 'Доступ запрещен' });
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Ошибка при получении информации о заказе:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении информации о заказе' });
  }
});

// Обновление заказа (только для админов)
router.put('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { 
      orderNumber, 
      articleNumber, 
      quantity, 
      operations, 
      materials, 
      status, 
      endDate,
      comments 
    } = req.body;

    // Проверка, существует ли заказ с таким номером (кроме текущего)
    if (orderNumber) {
      const existingOrder = await Order.findOne({ 
        orderNumber, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingOrder) {
        return res.status(400).json({ message: 'Заказ с таким номером уже существует' });
      }
    }

    const updateData: any = {};
    if (orderNumber !== undefined) updateData.orderNumber = orderNumber;
    if (articleNumber !== undefined) updateData.articleNumber = articleNumber;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (operations !== undefined) updateData.operations = operations;
    if (materials !== undefined) updateData.materials = materials;
    if (status !== undefined) updateData.status = status;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (comments !== undefined) updateData.comments = comments;

    // Если статус изменен на "completed", устанавливаем дату завершения
    if (status === 'completed' && !endDate) {
      updateData.endDate = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material')
      .populate('parentOrder', 'orderNumber');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(order);
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении заказа' });
  }
});

// Удаление заказа (только для админов)
router.delete('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Проверка наличия дочерних заказов
    if (order.childOrders && order.childOrders.length > 0) {
      return res.status(400).json({ 
        message: 'Невозможно удалить заказ, имеющий дочерние заказы. Сначала удалите дочерние заказы.' 
      });
    }

    // Если это дочерний заказ, удаляем ссылку из родительского заказа
    if (order.parentOrder) {
      await Order.updateOne(
        { _id: order.parentOrder },
        { $pull: { childOrders: { orderId: order._id } } }
      );
    }

    await Order.deleteOne({ _id: order._id });

    res.json({ message: 'Заказ успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении заказа' });
  }
});

// Создание дочернего заказа (разветвление) (только для админов)
router.post('/:id/branch', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { orderNumber, quantity, reason, articleNumber } = req.body;

    // Проверка, существует ли заказ с таким номером
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      return res.status(400).json({ message: 'Заказ с таким номером уже существует' });
    }

    // Получение родительского заказа
    const parentOrder = await Order.findById(req.params.id)
      .populate('operations.operation')
      .populate('materials.material');
    
    if (!parentOrder) {
      return res.status(404).json({ message: 'Родительский заказ не найден' });
    }

    // Проверка, что количество не превышает оставшееся в родительском заказе
    const totalBranchedQuantity = parentOrder.childOrders
      ? parentOrder.childOrders.reduce((sum, child) => sum + child.quantity, 0)
      : 0;
    
    const availableQuantity = parentOrder.quantity - totalBranchedQuantity;
    
    if (quantity > availableQuantity) {
      return res.status(400).json({ 
        message: `Невозможно создать дочерний заказ с количеством ${quantity}. Доступно: ${availableQuantity}` 
      });
    }

    // Создание операций для дочернего заказа на основе родительского
    const operations = parentOrder.operations.map(op => ({
      operation: op.operation._id,
      quantity: quantity,
      completedQuantity: 0,
      rate: op.rate,
      status: 'pending'
    }));

    // Создание материалов для дочернего заказа на основе родительского
    const materials = parentOrder.materials.map(mat => ({
      material: mat.material._id,
      quantity: (mat.quantity / parentOrder.quantity) * quantity,
      unit: mat.unit
    }));

    // Создание дочернего заказа
    const newOrder = new Order({
      orderNumber,
      articleNumber: articleNumber || parentOrder.articleNumber,
      quantity,
      operations,
      materials,
      status: 'created',
      startDate: new Date(),
      parentOrder: parentOrder._id
    });

    await newOrder.save();

    // Добавление ссылки на дочерний заказ в родительский
    parentOrder.childOrders = parentOrder.childOrders || [];
    parentOrder.childOrders.push({
      orderId: newOrder._id,
      reason,
      quantity
    });

    await parentOrder.save();

    // Получение полных данных с заполненными ссылками
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('operations.operation')
      .populate('materials.material')
      .populate('parentOrder', 'orderNumber');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Ошибка при создании дочернего заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании дочернего заказа' });
  }
});

// Обновление статуса операции и выполненного количества (для исполнителей)
router.patch('/:id/operations/:operationId', auth, async (req: Request, res: Response) => {
  try {
    const { completedQuantity, comments } = req.body;
    const { id, operationId } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Поиск операции в заказе
    const operationIndex = order.operations.findIndex(op => op._id.toString() === operationId);
    if (operationIndex === -1) {
      return res.status(404).json({ message: 'Операция не найдена в заказе' });
    }

    const operation = order.operations[operationIndex];

    // Проверка прав: только назначенный исполнитель или админ может обновлять
    if (req.userRole !== 'admin' && 
        (!operation.assignedTo || operation.assignedTo.toString() !== req.userId)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Обновление данных операции
    if (completedQuantity !== undefined) {
      // Проверка, что выполненное количество не превышает общее
      if (completedQuantity > operation.quantity) {
        return res.status(400).json({ 
          message: `Выполненное количество не может превышать общее (${operation.quantity})` 
        });
      }

      operation.completedQuantity = completedQuantity;
      
      // Автоматическое обновление статуса
      if (completedQuantity === 0) {
        operation.status = 'pending';
      } else if (completedQuantity < operation.quantity) {
        operation.status = 'in_progress';
      } else {
        operation.status = 'completed';
        operation.completionDate = new Date();
      }
    }

    if (comments !== undefined) {
      operation.comments = comments;
    }

    // Обновление статуса всего заказа
    const allCompleted = order.operations.every(op => op.status === 'completed');
    if (allCompleted && order.status !== 'completed') {
      order.status = 'completed';
      order.endDate = new Date();
    } else if (!allCompleted && order.status === 'completed') {
      order.status = 'in_progress';
      order.endDate = undefined;
    } else if (order.status === 'created' && order.operations.some(op => op.status !== 'pending')) {
      order.status = 'in_progress';
    }

    await order.save();

    // Получение обновленного заказа с заполненными ссылками
    const updatedOrder = await Order.findById(id)
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении операции:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении операции' });
  }
});

// Назначение исполнителя на операцию (только для админов)
router.patch('/:id/operations/:operationId/assign', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { id, operationId } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Поиск операции в заказе
    const operationIndex = order.operations.findIndex(op => op._id.toString() === operationId);
    if (operationIndex === -1) {
      return res.status(404).json({ message: 'Операция не найдена в заказе' });
    }

    // Получение операции и пользователя
    const operation = order.operations[operationIndex];
    
    // Проверка наличия индивидуальной расценки
    if (userId) {
      const userRate = await UserRate.findOne({ 
        user: userId, 
        operation: operation.operation 
      });
      
      // Если есть индивидуальная расценка, используем её
      if (userRate) {
        operation.rate = userRate.rate;
      }
    }

    // Обновление назначенного исполнителя
    operation.assignedTo = userId || undefined;

    await order.save();

    // Получение обновленного заказа с заполненными ссылками
    const updatedOrder = await Order.findById(id)
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при назначении исполнителя:', error);
    res.status(500).json({ message: 'Ошибка сервера при назначении исполнителя' });
  }
});

export default router;
