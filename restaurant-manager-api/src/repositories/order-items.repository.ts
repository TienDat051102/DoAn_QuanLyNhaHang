import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {OrderItems, OrderitemsRelations} from '../models';

export class OrderitemsRepository extends DefaultCrudRepository<
  OrderItems,
  typeof OrderItems.prototype.id,
  OrderitemsRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(OrderItems, dataSource);
  }
}
