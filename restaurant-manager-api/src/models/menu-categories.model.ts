import {Entity, hasMany, model, property} from '@loopback/repository';
import {MenuItems} from './menu-items.model';

@model()
export class MenuCategories extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string; // Tên của danh mục món ăn

  @hasMany(() => MenuItems, {keyTo: 'category_id'})
  menuitems: MenuItems[];

  constructor(data?: Partial<MenuCategories>) {
    super(data);
  }
}

export interface MenucategoriesRelations {}

export type MenuCategoriesWithRelations = MenuCategories &
  MenucategoriesRelations;
