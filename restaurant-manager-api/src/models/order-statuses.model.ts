import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderStatuses extends Entity {
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
    type: 'string',
    jsonSchema: {
      enum: ['pending', 'preparing', 'delivered', 'complete', 'cancel'],
    },
    required: true,
    default: 'pending',
  })
  status: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updated_at?: string;

  constructor(data?: Partial<OrderStatuses>) {
    super(data);
  }
}

export interface OrderstatusesRelations {}

export type OrderStatusesWithRelations = OrderStatuses & OrderstatusesRelations;
