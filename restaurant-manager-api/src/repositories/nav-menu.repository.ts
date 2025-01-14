import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {NavMenu, NavMenuItems, NavMenuRelations} from '../models';
import {NavMenuItemsRepository} from './nav-menu-items.repository';

export class NavMenuRepository extends DefaultCrudRepository<
  NavMenu,
  typeof NavMenu.prototype.id,
  NavMenuRelations
> {
  public readonly navMenuItems: HasManyRepositoryFactory<
    NavMenuItems,
    typeof NavMenu.prototype.id
  >;
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('NavMenuItemsRepository')
    protected navMenuItemsRepositoryGetter: Getter<NavMenuItemsRepository>,
  ) {
    super(NavMenu, dataSource);

    this.navMenuItems = this.createHasManyRepositoryFactoryFor(
      'navmenuitems',
      navMenuItemsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'navmenuitems',
      this.navMenuItems.inclusionResolver,
    );
  }
}
