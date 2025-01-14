import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Discounts, DiscountsRelations} from '../models';

export class DiscountsRepository extends DefaultCrudRepository<
  Discounts,
  typeof Discounts.prototype.id,
  DiscountsRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(Discounts, dataSource);
  }
}
