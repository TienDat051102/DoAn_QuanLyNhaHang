import {Entity, hasMany, model, property} from '@loopback/repository';
import {Orders} from './orders.model';
import {Reservations} from './reservations.model';

@model()
export class Customers extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  phone_number: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: String;

  @hasMany(() => Orders, {keyTo: 'customer_id'})
  orders: Orders[];

  @hasMany(() => Reservations, {keyTo: 'customer_id'})
  reservations: Reservations[];

  constructor(data?: Partial<Customers>) {
    super(data);
  }
}

export interface CustomersRelations {}

export type CustomersWithRelations = Customers & CustomersRelations;
