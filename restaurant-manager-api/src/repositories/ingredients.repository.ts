import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Ingredients, IngredientsRelations} from '../models';

export class IngredientsRepository extends DefaultCrudRepository<
  Ingredients,
  typeof Ingredients.prototype.id,
  IngredientsRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(Ingredients, dataSource);
  }
}
