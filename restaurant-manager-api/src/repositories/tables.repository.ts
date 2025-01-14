import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Tables, TablesRelations} from '../models';

export class TablesRepository extends DefaultCrudRepository<
  Tables,
  typeof Tables.prototype.id,
  TablesRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(Tables, dataSource);
  }
}
