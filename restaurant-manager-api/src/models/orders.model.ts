import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Customers} from './customers.model';
import {OrderItems} from './order-items.model';
import {OrderStatuses} from './order-statuses.model';
import {Tables} from './tables.model';

@model()
export class Orders extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Customers)
  customerId: number; // Liên kết với bảng Customers thông qua `belongsTo`

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: string;

  @belongsTo(() => Tables)
  tableId: number; // Liên kết với bảng Customers thông qua `belongsTo`

  @hasMany(() => OrderStatuses, {keyTo: 'orderId'})
  orderStatuses: OrderStatuses[];

  @hasMany(() => OrderItems, {keyTo: 'orderId'})
  orderItems: OrderItems[];

  constructor(data?: Partial<Orders>) {
    super(data);
  }
}

export interface OrdersRelations {}

export type OrdersWithRelations = Orders & OrdersRelations;
