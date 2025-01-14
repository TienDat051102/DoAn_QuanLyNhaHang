import {Entity, model, property} from '@loopback/repository';

@model()
export class MenuItems extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string; // Tên món ăn

  @property({
    type: 'string',
  })
  description: string; // Mô tả món ăn

  @property({
    type: 'string',
  })
  image: string; // Ảnh món ăn

  @property({
    type: 'number',
    postgresql: {
      dataType: 'decimal',
    },
  })
  price: number; // Giá món ăn

  @property({
    type: 'string',
  })
  instructions: string; // Hướng dẫn chế biến món ăn

  @property({
    type: 'number',
  })
  preparation_time: number; // Thời gian chuẩn bị (phút)

  @property({
    type: 'array',
    itemType: 'object',
    postgresql: {
      dataType: 'jsonb',
    },
  })
  ingredients: {
    id: number; // ID của nguyên liệu
    quantity: number; // Số lượng cần thiết
    unit: string; // Đơn vị đo lường (kg, g, liters, ...)
  }[];

  //trạng thái món ăn có được bán hay không
  @property({
    type: 'boolean',
    default: false,
  })
  status?: boolean;

  @property({
    type: 'number',
  })
  category_id: number;

  constructor(data?: Partial<MenuItems>) {
    super(data);
  }
}

export interface MenuItemsRelations {}

export type MenuItemsWithRelations = MenuItems & MenuItemsRelations;
