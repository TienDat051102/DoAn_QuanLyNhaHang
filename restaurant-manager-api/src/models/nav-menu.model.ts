import {Entity, hasMany, model, property} from '@loopback/repository';
import {NavMenuItems} from './nav-menu-items.model'; // Giả sử bạn có model cho các mục menu con

@model()
export class NavMenu extends Entity {
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
  title: string; // Tiêu đề của mục menu

  @property({
    type: 'string',
  })
  path: string; // Đường dẫn đến trang tương ứng

  @property({
    type: 'string',
  })
  icon?: string; // Biểu tượng cho mục menu (nếu cần)

  @property({
    type: 'boolean',
    default: true,
  })
  is_visible?: boolean; // Trạng thái hiển thị của mục menu

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created_at?: string; // Ngày tạo

  @property({
    type: 'date',
  })
  updated_at?: string; // Ngày cập nhật

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['admin', 'customer', 'staff'], // Các giá trị có thể chấp nhận
    },
    required: true,
    default: 'customer',
  })
  static?: string; // xuất hiện ở màn hình nào

  @hasMany(() => NavMenuItems, {keyTo: 'navMenuId'}) // Khóa ngoại là navMenuId
  navmenuitems: NavMenuItems[];

  constructor(data?: Partial<NavMenu>) {
    super(data);
  }
}

export interface NavMenuRelations {}

export type NavMenuWithRelations = NavMenu & NavMenuRelations;
