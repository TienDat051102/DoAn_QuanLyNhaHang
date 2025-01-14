import {Entity, model, property} from '@loopback/repository';

@model()
export class Users extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  username: string; // Tên đăng nhập

  @property({
    type: 'string',
    required: true,
  })
  password: string; // Mật khẩu (nên được mã hóa)

  @property({
    type: 'string',
  })
  email?: string; // Địa chỉ email

  @property({
    type: 'string',
  })
  first_name?: string; // Tên

  @property({
    type: 'string',
  })
  last_name?: string; // Họ

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['admin', 'staff'],
    },
    required: true,
    default: 'staff',
  })
  role: string;

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
  })
  token?: string;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {}

export type UsersWithRelations = Users & UsersRelations;
