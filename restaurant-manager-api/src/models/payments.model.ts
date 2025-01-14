import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Orders} from './orders.model'; // Giả sử bạn đã có model cho bảng Orders

@model()
export class Payments extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Orders)
  orderId: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number; // Số tiền thanh toán

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['cash', 'online'],
    },
    required: true,
  })
  payment_method: string; // Phương thức thanh toán (e.g., cash, card, online)

  @property({
    type: 'string',
  })
  transaction_id?: string; // Mã giao dịch (nếu thanh toán online)

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['pending', 'completed', 'failed'], // Các giá trị có thể chấp nhận
    },
    required: true,
    default: 'pending',
  })
  status: string; // Trạng thái thanh toán

  @property({
    type: 'date',
    default: () => new Date(),
  })
  payment_date?: string; // Ngày thanh toán

  constructor(data?: Partial<Payments>) {
    super(data);
  }
}
export interface PaymentsRelations {}

export type PaymentsWithRelations = Payments & PaymentsRelations;
