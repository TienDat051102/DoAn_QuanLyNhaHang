import {Entity, model, property} from '@loopback/repository';

@model()
export class Discounts extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string; // Mã giảm giá (coupon code)

  @property({
    type: 'number',
    required: true,
  })
  discount_percentage: number; // Phần trăm giảm giá

  @property({
    type: 'number',
  })
  max_discount_amount?: number; // Số tiền giảm tối đa

  @property({
    type: 'date',
    required: true,
  })
  valid_from: Date; // Ngày bắt đầu hiệu lực của mã giảm giá

  @property({
    type: 'date',
    required: true,
  })
  valid_to: Date; // Ngày kết thúc hiệu lực của mã giảm giá

  @property({
    type: 'boolean',
    default: true,
  })
  is_active: boolean; // Trạng thái hoạt động của mã giảm giá

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: Date; // Ngày tạo

  @property({
    type: 'date',
  })
  updated_at?: Date; // Ngày cập nhật

  @property({
    type: 'string',
  })
  describe: string;
  constructor(data?: Partial<Discounts>) {
    super(data);
  }
}
export interface DiscountsRelations {}

export type DiscountsWithRelations = Discounts & DiscountsRelations;
