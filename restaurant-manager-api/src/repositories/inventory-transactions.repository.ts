import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {InventoryTransactions, InventoryTransactionsRelations} from '../models';

export class InventoryTransactionsRepository extends DefaultCrudRepository<
  InventoryTransactions,
  typeof InventoryTransactions.prototype.id,
  InventoryTransactionsRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(InventoryTransactions, dataSource);
  }
}
