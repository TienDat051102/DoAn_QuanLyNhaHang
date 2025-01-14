import {Entity, model, property} from '@loopback/repository';

@model()
export class Ingredients extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string; // Tên của nguyên liệu

  @property({
    type: 'number',
    postgresql: {
      dataType: 'decimal',
    },
  })
  quantity: number; // Số lượng nguyên liệu hiện có

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['kg', 'g', 'liters', 'ml', 'piece'], // Các giá trị có thể chấp nhận
    },
    required: true,
    default: 'kg',
  })
  unit: string; //  Đơn vị đo lường (e.g., kg, g, liters)

  @property({
    type: 'date',
  })
  expiration_date: Date; // Ngày hết hạn của nguyên liệu

  @property({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: string;

  constructor(data?: Partial<Ingredients>) {
    super(data);
  }
}

export interface IngredientsRelations {}

export type IngredientsWithRelations = Ingredients & IngredientsRelations;
