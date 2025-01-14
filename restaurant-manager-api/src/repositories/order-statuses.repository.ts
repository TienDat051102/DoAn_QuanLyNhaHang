import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {OrderStatuses, OrderstatusesRelations} from '../models';

export class OrderstatusesRepository extends DefaultCrudRepository<
OrderStatuses,
  typeof OrderStatuses.prototype.id,
  OrderstatusesRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(OrderStatuses, dataSource);
  }
}
