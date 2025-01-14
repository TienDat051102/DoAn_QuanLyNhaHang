import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {MenuCategories, MenucategoriesRelations, MenuItems} from '../models';
import {MenuItemsRepository} from './menu-items.repository';

export class MenucategoriesRepository extends DefaultCrudRepository<
  MenuCategories,
  typeof MenuCategories.prototype.id,
  MenucategoriesRelations
> {
  public readonly menuitems: HasManyRepositoryFactory<
    MenuItems,
    typeof MenuCategories.prototype.id
  >;
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('MenuItemsRepository')
    protected menuitemsRepositoryGetter: Getter<MenuItemsRepository>,
  ) {
    super(MenuCategories, dataSource);

    this.menuitems = this.createHasManyRepositoryFactoryFor(
      'menuitems',
      menuitemsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'menuitems',
      this.menuitems.inclusionResolver,
    );
  }
}
