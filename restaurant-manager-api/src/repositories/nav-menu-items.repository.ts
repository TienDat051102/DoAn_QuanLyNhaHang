import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {NavMenuItems, NavMenuItemsRelations} from '../models';

export class NavMenuItemsRepository extends DefaultCrudRepository<
  NavMenuItems,
  typeof NavMenuItems.prototype.id,
  NavMenuItemsRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(NavMenuItems, dataSource);
  }
}
