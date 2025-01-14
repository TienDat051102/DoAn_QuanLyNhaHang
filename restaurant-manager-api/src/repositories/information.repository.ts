import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Information, InformationRelations} from '../models';

export class InformationRepository extends DefaultCrudRepository<
  Information,
  typeof Information.prototype.id,
  InformationRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(Information, dataSource);
  }
}
