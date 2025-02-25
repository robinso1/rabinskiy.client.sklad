// Report routes

import express, { Request, Response } from 'express';
import Order from '../models/order.model';
import WorkTime from '../models/workTime.model';
import User from '../models/user.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Отчет по заработной плате за период
router.get('/salary', auth, async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Необходимо указать начальную и конечную даты периода' });
    }

    // Проверка прав доступа: админ может видеть отчеты всех пользователей, 
    // обычный пользователь - только свой
    if (userId && req.userRole !== 'admin' && userId !== req.userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Определение пользователя для отчета
    const targetUserId = userId || req.userId;

    // Получение пользователя
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Преобразование дат
    const periodStart = new Date(startDate as string);
    const periodEnd = new Date(endDate as string);

    // Получение выполненных операций за период
    const completedOperations = await Order.aggregate([
      {
        $match: {
          'operations.assignedTo': user._id,
          'operations.status': 'completed',
          'operations.completionDate': { $gte: periodStart, $lte: periodEnd }
        }
      },
      { $unwind: '$operations' },
      {
        $match: {
          'operations.assignedTo': user._id,
          'operations.status': 'completed',
          'operations.completionDate': { $gte: periodStart, $lte: periodEnd }
        }
      },
      {
        $lookup: {
          from: 'operations',
          localField: 'operations.operation',
          foreignField: '_id',
          as: 'operationDetails'
        }
      },
      { $unwind: '$operationDetails' },
      {
        $project: {
          orderNumber: 1,
          articleNumber: 1,
          operationId: '$operations.operation',
          operationName: '$operationDetails.name',
          quantity: '$operations.completedQuantity',
          rate: '$operations.rate',
          total: { $multiply: ['$operations.completedQuantity', '$operations.rate'] },
          completionDate: '$operations.completionDate'
        }
      }
    ]);

    // Получение записей учета рабочего времени за период
    const workTimes = await WorkTime.find({
      user: user._id,
      date: { $gte: periodStart, $lte: periodEnd },
      approved: true
    }).populate('order', 'orderNumber');

    // Расчет сумм
    const pieceworkSalary = completedOperations.reduce((sum, op) => sum + op.total, 0);
    const hourlySalary = workTimes.reduce((sum, wt) => sum + (wt.hours * wt.hourlyRate), 0);
    const totalSalary = pieceworkSalary + hourlySalary;

    // Группировка операций по типам для отчета
    const operationsByType = completedOperations.reduce((acc: any, op) => {
      const key = op.operationId.toString();
      if (!acc[key]) {
        acc[key] = {
          operationId: op.operationId,
          operationName: op.operationName,
          quantity: 0,
          rate: op.rate,
          total: 0
        };
      }
      acc[key].quantity += op.quantity;
      acc[key].total += op.total;
      return acc;
    }, {});

    // Формирование отчета
    const report = {
      userId: user._id,
      userName: user.fullName,
      period: {
        startDate: periodStart,
        endDate: periodEnd
      },
      pieceworkSalary,
      hourlySalary,
      totalSalary,
      operations: Object.values(operationsByType),
      workTime: workTimes.map(wt => ({
        date: wt.date,
        hours: wt.hours,
        rate: wt.hourlyRate,
        total: wt.hours * wt.hourlyRate,
        description: wt.description,
        orderNumber: wt.order ? (wt.order as any).orderNumber : null
      }))
    };

    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета по заработной плате:', error);
    res.status(500).json({ message: 'Ошибка сервера при формировании отчета по заработной плате' });
  }
});

// Отчет по выполненным заказам за период
router.get('/orders', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Необходимо указать начальную и конечную даты периода' });
    }

    // Преобразование дат
    const periodStart = new Date(startDate as string);
    const periodEnd = new Date(endDate as string);

    // Формирование фильтра
    const filter: any = {
      startDate: { $gte: periodStart, $lte: periodEnd }
    };

    if (status) {
      filter.status = status;
    }

    // Получение заказов за период
    const orders = await Order.find(filter)
      .populate('operations.operation')
      .populate('operations.assignedTo', 'username fullName')
      .populate('materials.material')
      .sort({ startDate: -1 });

    // Расчет статистики
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const inProgressOrders = orders.filter(order => order.status === 'in_progress').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

    // Расчет общего количества изделий
    const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);
    
    // Расчет общей стоимости материалов (если есть цены)
    let totalMaterialCost = 0;
    orders.forEach(order => {
      order.materials.forEach((material: any) => {
        if (material.material.price) {
          totalMaterialCost += material.quantity * material.material.price;
        }
      });
    });

    // Расчет общей стоимости работ
    let totalWorkCost = 0;
    orders.forEach(order => {
      order.operations.forEach((operation: any) => {
        if (operation.status === 'completed') {
          totalWorkCost += operation.completedQuantity * operation.rate;
        }
      });
    });

    // Формирование отчета
    const report = {
      period: {
        startDate: periodStart,
        endDate: periodEnd
      },
      statistics: {
        totalOrders,
        completedOrders,
        inProgressOrders,
        cancelledOrders,
        totalQuantity,
        totalMaterialCost,
        totalWorkCost,
        totalCost: totalMaterialCost + totalWorkCost
      },
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        articleNumber: order.articleNumber,
        quantity: order.quantity,
        status: order.status,
        startDate: order.startDate,
        endDate: order.endDate,
        completionPercentage: calculateCompletionPercentage(order)
      }))
    };

    res.json(report);
  } catch (error) {
    console.error('Ошибка при формировании отчета по заказам:', error);
    res.status(500).json({ message: 'Ошибка сервера при формировании отчета по заказам' });
  }
});

// Вспомогательная функция для расчета процента выполнения заказа
function calculateCompletionPercentage(order: any): number {
  if (order.status === 'completed') return 100;
  if (order.status === 'cancelled') return 0;
  if (!order.operations || order.operations.length === 0) return 0;

  const totalQuantity = order.operations.reduce((sum: number, op: any) => sum + op.quantity, 0);
  const completedQuantity = order.operations.reduce((sum: number, op: any) => sum + op.completedQuantity, 0);

  return totalQuantity > 0 ? Math.round((completedQuantity / totalQuantity) * 100) : 0;
}

export default router;
