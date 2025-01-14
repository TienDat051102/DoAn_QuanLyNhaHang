import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {
  IngredientsRepository,
  MenuItemsRepository,
  OrderitemsRepository,
  OrdersRepository,
  OrderstatusesRepository,
  TablesRepository,
} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class OrdersController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(OrdersRepository) private orderRepo: OrdersRepository,
    @repository(OrderitemsRepository)
    private orderItemRepo: OrderitemsRepository,
    @repository(OrderstatusesRepository)
    private orderStatusRepo: OrderstatusesRepository,
    @repository(TablesRepository)
    private tableRepo: TablesRepository,
    @repository(IngredientsRepository)
    private ingredientsRepo: IngredientsRepository,
    @repository(MenuItemsRepository)
    private menuItemsRepo: MenuItemsRepository,
  ) {}
  @post('/order/createorders')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async createorders(@requestBody() body: any = {}): Promise<any> {
    const {ordersItem, table, customerId} = body;
    if (!ordersItem) {
      return {error: 'Không thể để trống!'};
    }
    try {
      console.log('body', body);
      let tableId = isNaN(table) || !table ? null : table;
      if (tableId !== null) {
        await this.tableRepo.updateById(tableId, {
          is_available: false,
        });
      }
      let orders = await this.orderRepo.create({
        tableId: tableId,
        customerId: customerId,
      });
      let ordersItems = await this.orderItemRepo.create({
        orderId: orders.id,
        menu_items: ordersItem,
      });
      let ordersStatus = await this.orderStatusRepo.create({
        orderId: orders.id,
        status: 'pending',
      });
      return {message: `Đơn hàng đã được đặt`};
    } catch (e) {
      return {error: e};
    }
  }
  @post('/order/updateorders')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async updateorders(@requestBody() body: any = {}): Promise<any> {
    const {ordersItem, orderId} = body;
    if (!ordersItem) {
      return {error: 'Không thể để trống!'};
    }
    console.log('body', body);
    try {
      if (!orderId) {
        return {error: 'Không thể để trống!'};
      }
      await this.orderItemRepo.create({
        orderId: orderId,
        menu_items: ordersItem,
      });
      return {message: `Success`};
    } catch (e) {
      return {error: e};
    }
  }

  @get('/order/listorders')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async listorders(): Promise<any> {
    try {
      const filter: any = {
        include: [
          {
            relation: 'orderItems',
          },
          {
            relation: 'orderStatuses',
            scope: {
              where: {
                status: {neq: 'complete'},
              },
              order: ['updated_at DESC'],
            },
          },
        ],
        where: {
          id: {
            nin: await this.getCompletedOrderIds(),
          },
        },
        order: ['created_at DESC'],
      };

      const data = await this.orderRepo.find(filter);
      let dataCount = await this.orderRepo.count(filter);
      return {message: 'thành công', data: data, count: dataCount.count};
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }
  async getCompletedOrderIds(): Promise<number[]> {
    const completedOrders = await this.orderStatusRepo.find({
      where: {or: [{status: 'complete'}, {status: 'cancel'}]},
      fields: {orderId: true},
    });
    return completedOrders
      .map(status => status.orderId)
      .filter((id): id is number => id !== undefined);
  }

  @get('/order/gettorderId/{id}')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async gettorderId(@param.path.number('id') id: number): Promise<any> {
    try {
      const data = await this.orderRepo.findById(id, {
        include: [
          {
            relation: 'orderItems',
          },
        ],
      });
      console.log('data', data);
      return {message: 'thành công', data: data};
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/order/updateorderstatus')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async updateorderstatus(@requestBody() body: any = {}): Promise<any> {
    const {orderId, status} = body;
    if (!orderId || !status) {
      return {error: 'Không thể update vì thiếu trường'};
    }
    try {
      const ktOrder = await this.orderRepo.findById(orderId);
      if (status === 'preparing') {
        const ktOrderStatus = await this.orderStatusRepo.findOne({
          where: {
            orderId: orderId,
            status: status,
          },
        });
        if (ktOrderStatus && ktOrder) {
          return {error: 'Đã có trạng thái này!'};
        } else {
          await this.orderStatusRepo.create({orderId: orderId, status: status});
          let orderItems = await this.orderItemRepo.findOne({
            where: {orderId: orderId},
          });
          if (orderItems?.menu_items && Array.isArray(orderItems.menu_items)) {
            await this.updateIngredients(orderItems.menu_items);
          } else {
            throw new Error('menu_items không hợp lệ hoặc không tồn tại!');
          }
          return {
            message: 'Update trạng thái đơn hàng thành công',
          };
        }
      } else {
        if (status === 'complete' || status === 'cancel') {
          if (ktOrder.tableId !== null) {
            await this.tableRepo.updateById(ktOrder.tableId, {
              is_available: true,
            });
          }
        }
        const ktOrderStatus = await this.orderStatusRepo.findOne({
          where: {
            orderId: orderId,
            status: status,
          },
        });
        if (ktOrderStatus && ktOrder) {
          return {error: 'Đã có trạng thái này!'};
        } else {
          await this.orderStatusRepo.create({orderId: orderId, status: status});
          return {
            message: 'Update trạng thái đơn hàng thành công',
          };
        }
      }
    } catch (e) {
      return {error: e};
    }
  }

  async updateIngredients(orderItems: Array<{id: number; quantity: number}>) {
    for (const orderItem of orderItems) {
      const menuItems = await this.menuItemsRepo.findById(orderItem.id);
      if (!menuItems) {
        throw new Error(`Danh mục món với id ${orderItem.id} không tìm thấy`);
      }
      for (const recipeIngredient of menuItems.ingredients) {
        let ingredient = await this.ingredientsRepo.findById(
          recipeIngredient.id,
        );
        const totalRequiredQuantity = convertUnit(
          recipeIngredient.quantity * orderItem.quantity,
          recipeIngredient.unit,
          ingredient.unit,
        );
        if (!ingredient) {
          throw new Error(
            `Nguyên liệu với id ${recipeIngredient.id} không tìm thấy`,
          );
        }

        if (ingredient.quantity < totalRequiredQuantity) {
          throw new Error(
            `Không đủ số lượng ${ingredient.name} (required: ${totalRequiredQuantity}, available: ${ingredient.quantity})`,
          );
        }
        ingredient.quantity -= totalRequiredQuantity;
        await this.ingredientsRepo.updateById(ingredient.id, ingredient);
      }
    }
  }
}
function convertUnit(
  quantity: number,
  fromUnit: string,
  toUnit: string,
): number {
  const unitConversion: any = {
    kg: 1000,
    g: 1,
    liters: 1000,
    ml: 1,
    piece: 1,
  };

  if (fromUnit === toUnit) {
    return quantity;
  }

  if (unitConversion[fromUnit] && unitConversion[toUnit]) {
    return (quantity * unitConversion[fromUnit]) / unitConversion[toUnit];
  }
  throw new Error(`Không thể chuyển đổi đại lượng: ${fromUnit} và ${toUnit}`);
}
