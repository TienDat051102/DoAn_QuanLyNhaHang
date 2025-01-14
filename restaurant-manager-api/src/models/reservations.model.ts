import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customers, CustomersWithRelations} from './customers.model';
import {Tables, TablesWithRelations} from './tables.model';

@model()
export class Reservations extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Customers, {name: 'customerInfo'})
  customerId: number;

  @belongsTo(() => Tables, {name: 'tableInfo'})
  tableId: number;

  @property({
    type: 'date',
  })
  reservation_time: string;

  @property({
    type: 'number',
  })
  of_people: number;

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['pending', 'confirmed', 'completed', 'canceled'], // Các giá trị có thể chấp nhận
    },
    required: true,
    default: 'pending',
  })
  status: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: string;

  @property({
    type: 'string',
  })
  note: string;

  constructor(data?: Partial<Reservations>) {
    super(data);
  }
}

export interface ReservationsRelations {
  customerInfo?: CustomersWithRelations;
  tableInfo?: TablesWithRelations;
}

export type ReservationsWithRelations = Reservations & ReservationsRelations;
