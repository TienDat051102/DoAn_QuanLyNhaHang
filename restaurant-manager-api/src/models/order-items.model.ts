import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderItems extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  orderId?: number;

  @property({
    type: 'object', // Lưu thêm các thông tin như số lượng, giá món ăn trong JSONB
    postgresql: {
      dataType: 'jsonb',
    },
  })
  menu_items: object; // JSONB lưu trữ thông tin món ăn, số lượng, giá

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: string;

  constructor(data?: Partial<OrderItems>) {
    super(data);
  }
}

export interface OrderitemsRelations {}

export type OrderItemsWithRelations = OrderItems & OrderitemsRelations;
