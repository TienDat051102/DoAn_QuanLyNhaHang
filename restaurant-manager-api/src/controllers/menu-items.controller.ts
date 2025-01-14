import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {MenuItemsRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class MenuItemController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(MenuItemsRepository) private menuRepo: MenuItemsRepository,
  ) {}
  @get('/menuitem/getmenuitems')
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
  async getmenuitems(
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
      let data = await this.menuRepo.find(filter);
      let dataCount = await this.menuRepo.count({
        name: {ilike: `%${searchWord}%`},
      });
      return {
        message: `Dữ liệu được xuất thành công`,
        data: data,
        count: dataCount.count,
      };
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }
  @post('/menuitem/updatemenuitems')
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
  async updatemenuitems(@requestBody() body: any = {}): Promise<any> {
    const {
      id,
      name,
      description,
      price,
      instructions,
      preparation_time,
      status,
      category_id,
      ingredients,
      image,
    } = body;
    try {
      if (!id) {
        let payload: any = {
          name: name,
          description: description,
          image: image,
          price: price,
          instructions: instructions,
          preparation_time: preparation_time,
          ingredients: ingredients,
          status: status,
          category_id: category_id,
        };
        const ktdata = await this.menuRepo.findOne({
          where: {name: name},
        });
        if (ktdata) {
          return {message: 'Nguyên Liệu này đã có vui lòng chọn chỉnh sửa!'};
        }
        let data = await this.menuRepo.create(payload);
        return {message: `Success`};
      } else {
        const ktdata = await this.menuRepo.findById(id);
        if (!ktdata) {
          return {message: `Không có món ăn bạn đã chọn`};
        }
        let payload: any = {
          name: name,
          description: description,
          image: image,
          price: price,
          instructions: instructions,
          preparation_time: preparation_time,
          ingredients: ingredients,
          status: status,
          category_id: category_id,
        };
        let data = await this.menuRepo.updateById(id, payload);
        return {message: 'Success'};
      }
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`};
    }
  }
}
