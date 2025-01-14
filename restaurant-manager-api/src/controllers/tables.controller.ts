import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {ReservationsRepository, TablesRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class TablesController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(TablesRepository) private tablesrepo: TablesRepository,
    @repository(ReservationsRepository)
    private reservationsrepo: ReservationsRepository,
  ) {}
  @get('/tables/emptytable')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async emptytable(): Promise<any> {
    try {
      let dataReservations = await this.reservationsrepo.find({
        where: {
          status: 'confirmed',
        },
      });
      const reservedTableIds = dataReservations.map(
        reservation => reservation.tableId,
      );
      let data = await this.tablesrepo.find({
        where: {is_available: true, id: {nin: reservedTableIds}},
      });
      return {
        message: `Dữ liệu được xuất thành công`,
        data: data,
      };
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @get('/tables/listtables')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async listtables(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('search') search: string,
  ): Promise<any> {
    let searchWord = (search || '').toLowerCase();
    const filter: any = {
      skip: skip >= 0 ? skip : undefined,
      limit: limit >= 0 ? limit : undefined,
      where: {name: {ilike: `%${searchWord}%`}},
    };
    try {
      let data = await this.tablesrepo.find(filter);
      let datacount = await this.tablesrepo.count({
        name: {ilike: `%${searchWord}%`},
      });
      return {
        message: `Dữ liệu được xuất thành công`,
        data: data,
        count: datacount.count,
      };
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/tables/createtables')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async createtables(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.string('param') body: any,
  ): Promise<any> {
    const {name, capacity, location, is_available} = body;
    try {
      let payload = {
        name: name,
        capacity: capacity,
        location: location,
        is_available: is_available,
      };
      let data = await this.tablesrepo.create(payload);
      return {message: 'Tạo bàn thành công!', data: data};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/tables/updatetables')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async updatetables(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any,
  ): Promise<any> {
    const {id, name, capacity, location, is_available} = body;
    try {
      if (!id) {
        const payload = {
          name,
          capacity,
          location,
          is_available,
        };
        const ktdata = await this.tablesrepo.findOne({where: {name: name}});
        if (ktdata) {
          return {message: 'Tên bàn này đã xuất hiện vui lòng chọn chỉnh sửa!'};
        } else {
          await this.tablesrepo.create(payload);
          return {message: 'Tạo bàn thành công!'};
        }
      } else {
        const ktdata = await this.tablesrepo.findById(id);
        if (!ktdata) {
          return {message: 'Bàn không tồn tại'};
        }
        let payload = {
          name: name,
          capacity: capacity,
          location: location,
          is_available: is_available,
        };
        await this.tablesrepo.updateById(id, payload);
        return {message: 'Update bàn thành công'};
      }
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/tables/updatestatus')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async updatestatus(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {id, is_available} = body;
    try {
      let ktdata = await this.tablesrepo.findById(id);
      ktdata.is_available = is_available;
      await this.tablesrepo.updateById(id, ktdata);
      return {message: 'Update trạng thái thành công'};
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/tables/deletetables')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async deletetables(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any,
  ): Promise<any> {
    const {id} = body;
    try {
      let ktdata = await this.tablesrepo.findById(id);
      if (!ktdata) {
        return {message: 'Bàn không tồn tại'};
      }
      await this.tablesrepo.deleteById(id);
      return {message: 'Xóa bàn thành công'};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
