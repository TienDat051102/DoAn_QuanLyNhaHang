import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {
  Customers,
  Reservations,
  ReservationsRelations,
  Tables,
} from '../models';
import {CustomersRepository} from './customers.repository';
import {TablesRepository} from './tables.repository';

export class ReservationsRepository extends DefaultCrudRepository<
  Reservations,
  typeof Reservations.prototype.id,
  ReservationsRelations
> {
  public readonly customer: BelongsToAccessor<
    Customers,
    typeof Reservations.prototype.id
  >;
  public readonly table: BelongsToAccessor<
    Tables,
    typeof Reservations.prototype.id
  >;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('CustomersRepository')
    protected customersRepositoryGetter: Getter<CustomersRepository>,
    @repository.getter('TablesRepository')
    protected tablesRepositoryGetter: Getter<TablesRepository>,
  ) {
    super(Reservations, dataSource);

    this.customer = this.createBelongsToAccessorFor(
      'customerInfo',
      customersRepositoryGetter,
    );
    this.registerInclusionResolver(
      'customerInfo',
      this.customer.inclusionResolver,
    );
    this.table = this.createBelongsToAccessorFor(
      'tableInfo',
      tablesRepositoryGetter,
    );
    this.registerInclusionResolver('tableInfo', this.table.inclusionResolver);
  }
}
