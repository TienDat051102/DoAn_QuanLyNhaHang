import {Entity, model, property} from '@loopback/repository';

@model()
export class NavMenuItems extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  navMenuId?: number; // Đây là foreign key

  @property({
    type: 'string',
    required: true,
  })
  title: string; // Tiêu đề của mục con

  @property({
    type: 'string',
  })
  path: string; // Đường dẫn đến trang tương ứng

  @property({
    type: 'boolean',
    default: true,
  })
  is_visible?: boolean; // Trạng thái hiển thị của mục con

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: string; // Ngày tạo

  @property({
    type: 'date',
  })
  updated_at?: string; // Ngày cập nhật

  constructor(data?: Partial<NavMenuItems>) {
    super(data);
  }
}

export interface NavMenuItemsRelations {}

export type NavMenuItemsWithRelations = NavMenuItems & NavMenuItemsRelations;
