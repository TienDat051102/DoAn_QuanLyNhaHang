import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {OrderItems, Orders, OrdersRelations, OrderStatuses} from '../models';
import {OrderitemsRepository} from './order-items.repository';
import {OrderstatusesRepository} from './order-statuses.repository';

export class OrdersRepository extends DefaultCrudRepository<
  Orders,
  typeof Orders.prototype.id,
  OrdersRelations
> {
  public readonly orderItems: HasManyRepositoryFactory<
    OrderItems,
    typeof Orders.prototype.id
  >;
  public readonly orderStatuses: HasManyRepositoryFactory<
    OrderStatuses,
    typeof Orders.prototype.id
  >;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('OrderitemsRepository')
    protected orderItemsRepositoryGetter: Getter<OrderitemsRepository>,
    @repository.getter('OrderstatusesRepository')
    protected orderStatusesRepositoryGetter: Getter<OrderstatusesRepository>,
  ) {
    super(Orders, dataSource);

    this.orderItems = this.createHasManyRepositoryFactoryFor(
      'orderItems',
      orderItemsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'orderItems',
      this.orderItems.inclusionResolver,
    );

    this.orderStatuses = this.createHasManyRepositoryFactoryFor(
      'orderStatuses',
      orderStatusesRepositoryGetter,
    );
    this.registerInclusionResolver(
      'orderStatuses',
      this.orderStatuses.inclusionResolver,
    );
  }
}
