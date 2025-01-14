import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Ingredients} from './ingredients.model';

@model()
export class InventoryTransactions extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Ingredients)
  ingredientId: number;

  @property({
    type: 'number',
  })
  quantity: number;

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['add', 'remove'],
    },
    required: true,
    default: 'add',
  })
  transaction_type: string; //

  @property({
    type: 'date',
    default: () => new Date(),
  })
  transaction_date?: string; // Ngày giao dịch

  @property({
    type: 'date',
  })
  new_expiration_date: string;

  @property({
    type: 'string',
  })
  notes?: string; // Ghi chú thêm cho giao dịch

  constructor(data?: Partial<InventoryTransactions>) {
    super(data);
  }
}
export interface InventoryTransactionsRelations {}

export type InventoryTransactionsWithRelations = InventoryTransactions &
  InventoryTransactionsRelations;
