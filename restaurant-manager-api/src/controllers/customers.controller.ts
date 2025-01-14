import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {CustomersRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class CustomerController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(CustomersRepository) private customerrepo: CustomersRepository,
  ) {}
  @get('/customer/listcustomer')
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
  async listcustomer(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('phone_number') phone_number: string,
  ): Promise<any> {
    try {
      let sdt = (phone_number || '').toLowerCase();
      const filter: any = {
        skip: skip >= 0 ? skip : undefined,
        limit: limit >= 0 ? limit : undefined,
        where: {phone_number: {ilike: `%${sdt}%`}},
      };
      let data = await this.customerrepo.find(filter);
      let dataCount = await this.customerrepo.count(filter.where);
      return {
        message: 'Dữ liệu khách hàng được xuất thành công',
        data: data,
        count: dataCount,
      };
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/customer/updatecustomer')
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
  async updatecustomer(@requestBody() body: any): Promise<any> {
    const {id, name, email, phone_number} = body;
    try {
      if (!id) {
        const ktdata = await this.customerrepo.findOne({
          where: {
            or: [{email: email}, {phone_number: phone_number}],
          },
        });
        if (ktdata) {
          return {
            message: 'Thông tin khách hàng bị trùng lặp vui lòng kiểm tra!',
          };
        } else {
          const payload = {
            name,
            email,
            phone_number,
          };
          await this.customerrepo.create(payload);
          return {message: `Thêm thông tin khách hàng ${name} thành công`};
        }
      } else {
        const ktdata = await this.customerrepo.findById(id);
        if (!ktdata) {
          return {message: 'Không có thông tin khách hàng mà bạn muốn tìm'};
        } else {
          const payload = {
            name: name,
            email: email,
            phone_number: phone_number,
          };
          await this.customerrepo.updateById(id, payload);
          return {message: `Chỉnh sửa thông tin khách hàng ${name} thành công`};
        }
      }
    } catch (e) {
      return {error: 'Lỗi'};
    }
  }
}
