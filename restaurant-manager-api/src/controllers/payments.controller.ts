import {authenticate} from '@loopback/authentication';
import {JWTService} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {
  MenuItemsRepository,
  OrderitemsRepository,
  OrdersRepository,
  OrderstatusesRepository,
  PaymentsRepository,
  TablesRepository,
} from '../repositories';

export class PaymentsController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(OrdersRepository) private orderRepo: OrdersRepository,
    @repository(OrderitemsRepository)
    private orderItemRepo: OrderitemsRepository,
    @repository(OrderstatusesRepository)
    private orderStatusRepo: OrderstatusesRepository,
    @repository(TablesRepository)
    private tableRepo: TablesRepository,
    @repository(PaymentsRepository)
    private paymentsRepo: PaymentsRepository,
    @repository(MenuItemsRepository)
    private menuItemsRepo: MenuItemsRepository,
  ) {}
  @post('/payments/createpayments')
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
    const {orderId, payment_method, amount, transaction_id} = body;
    try {
      const checkOrder = await this.orderRepo.findById(orderId, {
        include: [{relation: 'orderItems'}],
      });
      console.log('checkOrder ', checkOrder);
      if (checkOrder !== null) {
        if (payment_method === 'cash') {
          const payload = {
            orderId: orderId,
            amount: amount,
            payment_method: 'cash',
            status: 'completed',
          };
          const data = await this.paymentsRepo.create(payload);
          return {message: 'Thanh toán thành công'};
        } else {
          const payload = {
            orderId: orderId,
            amount: amount,
            payment_method: 'online',
            status: 'pending',
            transaction_id: transaction_id,
          };
          const data = await this.paymentsRepo.create(payload);
          return {
            message: 'Tạo thanh toán thành công vui lòng kiểm tra ngân hàng',
          };
        }
      }
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
