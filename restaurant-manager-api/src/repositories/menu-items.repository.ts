import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {MenuItems, MenuItemsRelations} from '../models';

export class MenuItemsRepository extends DefaultCrudRepository<
  MenuItems,
  typeof MenuItems.prototype.id,
  MenuItemsRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(MenuItems, dataSource);
  }
}
