import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {CustomersRepository, DiscountsRepository} from '../repositories';
import {EmailService} from '../services/email.service';
import {JWTService} from '../services/jwt.service';

export class DiscountsController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(DiscountsRepository) private discountsrepo: DiscountsRepository,
    @repository(CustomersRepository) private customersrepo: CustomersRepository,
    @inject('services.EmailService') private emailService: EmailService,
  ) {}

  @get('/discounts/listdiscounts')
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
  async listdiscounts(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('search') search: string,
  ): Promise<any> {
    let searchWord = (search || '').toLowerCase();
    const filter: any = {
      skip: skip >= 0 ? skip : undefined,
      limit: limit >= 0 ? limit : undefined,
      where: {code: {ilike: `%${searchWord}%`}},
    };
    try {
      let data = await this.discountsrepo.find(filter);
      let dataCount = await this.discountsrepo.count({
        code: {ilike: `%${searchWord}%`},
      });
      return {
        message: `Dữ liệu được xuất thành công`,
        data: data,
        count: dataCount,
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @get('/discounts/getActiveDiscounts')
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
  async getActiveDiscounts(): Promise<any> {
    const now = new Date();
    try {
      const activeDiscounts = await this.discountsrepo.find({
        where: {
          and: [
            {valid_from: {lte: now}},
            {valid_to: {gte: now}},
            {is_active: true},
          ],
        },
      });
      return {message: 'Xuất dữ liệu thành công', data: activeDiscounts};
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`};
    }
  }

  @get('/discounts/listdiscountscount')
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
  async listdiscountscount(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.string('search') search: string,
  ): Promise<any> {
    const filter: any = {
      order: 'id',
    };
    try {
      let data = await this.discountsrepo.find(filter);
      let result: any = [];
      if (search && search != '') {
        let searchWord = search.toLowerCase();
        data.forEach((d: any) => {
          d = d.toJSON();
          if (d && d.name.toLowerCase().indexOf(searchWord) > -1) {
            result.push(d);
          }
        });
      } else {
        result = data;
      }
      return {
        message: `List portal contact Count is Success`,
        data: {count: result.length},
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`};
    }
  }

  // @post('/discounts/creatediscounts')
  // @authenticate('jwt')
  // @response(200, {
  //   description: 'Protected resource',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // async creatediscounts(
  //   // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
  //   @param.query.string('param') body: any,
  // ): Promise<any> {
  //   const {
  //     code,
  //     discount_percentage,
  //     max_discount_amount,
  //     valid_from,
  //     valid_to,
  //     is_active,
  //   } = body;
  //   if (
  //     !code ||
  //     !discount_percentage ||
  //     !discount_percentage ||
  //     !max_discount_amount
  //   ) {
  //     return {message: 'Vui lòng nhập đủ các trường bắt buộc'};
  //   }
  //   let payload = {
  //     code: code,
  //     discount_percentage: discount_percentage,
  //     max_discount_amount: max_discount_amount,
  //     valid_from: valid_from ? valid_from : Date.now(),
  //     valid_to: valid_to,
  //     is_active: is_active ? is_active : false,
  //     created_at: Date.now(),
  //   };
  //   try {
  //     let ktdata = await this.discountsrepo.findOne({where: {code: code}});
  //     if (ktdata) {
  //       return {message: 'Mã giảm giá đã có trong trường không thể thêm'};
  //     } else {
  //       let data = await this.discountsrepo.create(payload);
  //       return {message: 'Thêm mã giảm giá thành công', data: data};
  //     }
  //   } catch (e) {
  //     return {message: `Internal server Error Occurred, Please try again`, e};
  //   }
  // }

  @post('/discounts/updatediscounts')
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
  async updatediscounts(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {
      id,
      code,
      discountPercentage,
      maxDiscountAmount,
      validFrom,
      validTo,
      isActive,
    } = body;

    try {
      if (!id) {
        let payload = {
          code: code,
          discount_percentage: discountPercentage,
          max_discount_amount: maxDiscountAmount,
          valid_from: validFrom ? validFrom : Date.now(),
          valid_to: validTo,
          is_active: isActive ? isActive : false,
          created_at: Date.now(),
        };
        let ktdata = await this.discountsrepo.findOne({where: {code: code}});
        if (ktdata) {
          return {error: 'Mã giảm giá đã có trong trường không thể thêm'};
        } else {
          let data = await this.discountsrepo.create(payload);
          if (data.is_active === true) {
            const emailSubject = 'Thông báo từ nhà hàng Tiến Đạt';
            const emailBody = `
            Kính gửi Quý Khách hàng,

            Chúng tôi rất vui được thông báo rằng nhà hàng Tiến Đạt vừa ra mắt mã giảm giá đặc biệt dành cho bạn!

            - **Mã giảm giá**: ${data.code}
            - **Siêu giảm giá**: ${data.discount_percentage} %
            - **Thời gian áp dụng**: từ ${data.valid_from.toLocaleDateString()} đến ${data.valid_to.toLocaleDateString()}

            Hãy đến ngay Nhà hàng Tiến Đạt để tận hưởng những món ăn ngon và sử dụng ưu đãi tuyệt vời này.

            Thân mến,
            Đội ngũ Nhà hàng Tiến Đạt
          `;
            let customers = await this.customersrepo.find();
            await Promise.all(
              customers.map(async customer => {
                await this.emailService.sendEmail(
                  customer.email,
                  emailSubject,
                  emailBody,
                );
              }),
            );
          }
          return {message: 'Thêm mã giảm giá thành công', data: data};
        }
      } else {
        let ktdata = await this.discountsrepo.findById(id);
        if (ktdata) {
          let payload = {
            code: code,
            discount_percentage: discountPercentage,
            max_discount_amount: maxDiscountAmount,
            valid_from: validFrom ? validFrom : Date.now(),
            valid_to: validTo,
            is_active: isActive ? isActive : false,
            updated_at: Date.now(),
          };
          let data = await this.discountsrepo.updateById(id, payload);
          return {message: 'update mã giảm giá thành công', data: data};
        } else {
          return {error: 'Mã giảm giá không tồn tại'};
        }
      }
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/discounts/deletediscounts')
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
  async deletediscounts(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {id} = body;
    try {
      let ktdata = await this.discountsrepo.findById(id);
      if (!ktdata) {
        return {message: 'Mã giảm giá không tồn tại'};
      }
      await this.discountsrepo.deleteById(id);
      return {message: 'Xóa mã giảm giá thành công!'};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
