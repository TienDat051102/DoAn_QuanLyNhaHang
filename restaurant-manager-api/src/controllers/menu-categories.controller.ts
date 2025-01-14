import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {MenucategoriesRepository, MenuItemsRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class MenuCategoriesController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(MenucategoriesRepository)
    private menucategoriesrepo: MenucategoriesRepository,
    @repository(MenuItemsRepository)
    private menuitemrepo: MenuItemsRepository,
  ) {}

  @get('/menucategories/listmenucategories')
  async listmenucategories(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('id') id: number,
  ): Promise<any> {
    const filter: any = {
      include: [
        {
          relation: 'menuitems',
          scope: {
            where: {status: true},
          },
        },
      ],
    };
    if (id) {
      filter.where = {
        id: id,
      };
    }
    try {
      let data = await this.menucategoriesrepo.find(filter);
      let datacount = await this.menucategoriesrepo.count(filter.where);
      return {
        message: `Xuất dữ liệu thành công`,
        data: data,
        datacount: datacount,
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @get('/menucategories/getmenucategories')
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
  async getmenucategories(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('search') search: string,
  ): Promise<any> {
    let searchWord = (search || '').toLowerCase();
    const filter: any = {
      skip: skip >= 0 ? skip : undefined,
      limit: limit >= 0 ? limit : undefined,
      include: [
        {
          relation: 'menuitems',
        },
      ],
      where: {name: {ilike: `%${searchWord}%`}},
    };
    try {
      let data = await this.menucategoriesrepo.find(filter);
      let datacount = await this.menucategoriesrepo.count(filter.where);
      return {
        message: `Xuất dữ liệu thành công`,
        data: data,
        datacount: datacount,
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/menucategories/createmenucategories')
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
  async createmenucategories(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {name} = body;
    try {
      let payload = {
        name: name,
      };
      let ktdata = await this.menucategoriesrepo.findOne({where: {name: name}});
      if (!ktdata) {
        return {message: 'Danh mục món ăn đã tồn tại'};
      }
      let data = await this.menucategoriesrepo.create(payload);
      return {message: 'Thêm danh mục món ăn thành công', data: data};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/menucategories/updatemenucategories')
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
  async updatemenucategories(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {id, name} = body;
    try {
      if (!id) {
        let ktdata = await this.menucategoriesrepo.find({where: {name: name}});
        if (!ktdata) {
          return {message: 'Tên danh mục món ăn đã tồn tại'};
        } else {
          let payload = {
            name: name,
          };
          let data = await this.menucategoriesrepo.create(payload);
          return {message: 'Success'};
        }
      } else {
        let ktdata = await this.menucategoriesrepo.find({where: {name: name}});
        if (!ktdata) {
          return {message: 'Tên danh mục món ăn đã tồn tại'};
        }
        let payload = {
          name: name,
        };
        let data = await this.menucategoriesrepo.updateById(id, payload);
        return {message: 'Success'};
      }
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/menucategories/deletemenucategories')
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
  async deletemenucategories(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {id} = body;
    try {
      let ktdata = await this.menucategoriesrepo.findById(id);
      if (!ktdata) {
        return {message: 'Danh mục món ăn bạn chọn không tồn tại'};
      }
      await this.menuitemrepo.updateAll({status: false}, {category_id: id});
      await this.menucategoriesrepo.deleteById(id);
      return {message: 'Success'};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
