import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {
  CustomersRepository,
  ReservationsRepository,
  TablesRepository,
} from '../repositories';
import {EmailService} from '../services/email.service';
import {JWTService} from '../services/jwt.service';

export class ReservationsController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(ReservationsRepository)
    private reservationsrepo: ReservationsRepository,
    @repository(CustomersRepository)
    private customersrepo: CustomersRepository,
    @repository(TablesRepository)
    private tablesrepo: TablesRepository,
    @inject('services.EmailService') private emailService: EmailService,
  ) {}

  @post('/reservations/createreservations')
  async createreservations(@requestBody() body: any = {}): Promise<any> {
    const {name, email, phone, time, people, note} = body;
    let excludedIds: any = [];
    try {
      if (!email || !people || !time) {
        return {
          message: `Bạn không thể để trống các trường email, số người và thời gian`,
        };
      }

      let kttable = await this.tablesrepo.findOne({
        where: {
          capacity: {gte: people},
          is_available: true,
        },
        order: ['capacity ASC'],
      });

      while (kttable) {
        const isAvailable = await this.isTableAvailable(kttable.id, time);
        if (isAvailable) {
          const ktcustormer = await this.customersrepo.findOne({
            where: {or: [{email}, {phone_number: phone}]},
          });
          let payload: any = {
            customerId: ktcustormer ? ktcustormer.id : null,
            tableId: kttable.id,
            reservation_time: time,
            status: 'pending',
            of_people: people,
            note: note,
          };

          if (!ktcustormer) {
            if (!name || !phone) {
              return {message: 'Cần cung cấp đầy đủ thông tin khách hàng'};
            }
            const createcustomer = await this.customersrepo.create({
              name,
              email,
              phone_number: phone,
            });
            payload.customerId = createcustomer.id;
          }
          const data = await this.reservationsrepo.create(payload);
          return {
            message: 'Bạn đã đặt bàn thành công',
            data,
          };
        } else {
          excludedIds.push(kttable.id);
          kttable = await this.findAvailableTable(people, excludedIds);
        }
      }

      return {
        message: `Xin lỗi quý khách, nhà hàng chúng tôi đã hết bàn trống`,
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return {
        message: `Internal server Error Occurred, Please try again`,
        error: error.message || error,
      };
    }
  }

  async isTableAvailable(
    tableId: any,
    reservationTime: string,
  ): Promise<boolean> {
    const existingReservation = await this.reservationsrepo.findOne({
      where: {
        tableId: tableId,
        reservation_time: reservationTime,
        status: {inq: ['pending', 'confirmed']},
      },
    });
    return !existingReservation;
  }
  async findAvailableTable(people: number, excludedIds: number[]) {
    let kttable = await this.tablesrepo.findOne({
      where: {
        capacity: {gte: people},
        is_available: true,
        id: {nin: excludedIds}, // Sử dụng nin để loại trừ danh sách ID
      },
      order: ['capacity ASC'],
    });
    return kttable;
  }

  @get('/reservations/listreservations')
  @authenticate('jwt')
  @response(200, {
    description: 'Danh sách đặt bàn',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {type: 'number'},
                  reservation_time: {type: 'string'},
                  status: {type: 'string'},
                  of_people: {type: 'number'},
                  customerId: {type: 'number'},
                  tableId: {type: 'number'},
                  note: {type: 'string'},
                },
              },
            },
            count: {type: 'number'},
          },
        },
      },
    },
  })
  async listreservations(
    @param.query.string('date') date?: string,
  ): Promise<{data: any[]; count: number} | {error: string}> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filterDate = date || today;
      const startOfDay = new Date(`${filterDate}T00:00:00+07:00`).toISOString();
      const endOfDay = new Date(`${filterDate}T23:59:59+07:00`).toISOString();

      const filter: any = {
        where: {
          reservation_time: {
            between: [startOfDay, endOfDay],
          },
          status: {inq: ['confirmed']},
        },
        order: 'reservation_time ASC',
      };
      const data = await this.reservationsrepo.find(filter);
      const count = await this.reservationsrepo.count(filter.where);
      return {data, count: count.count};
    } catch (e) {
      console.error('Error fetching reservations:', e);
      return {error: 'Internal server error occurred, please try again later'};
    }
  }
  @get('/reservations/getreservations')
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
  async getreservations(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<any> {
    const filter: any = {
      include: [{relation: 'customerInfo'}, {relation: 'tableInfo'}],
      skip: skip >= 0 ? skip : undefined,
      limit: limit >= 0 ? limit : undefined,
      order: 'status DESC',
    };
    try {
      let data = await this.reservationsrepo.find(filter);
      let datacount = await this.reservationsrepo.count();
      return {
        message: `Dữ liệu được xuất thành công`,
        data: data,
        count: datacount.count,
      };
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/reservations/updatereservations')
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
  async updatereservations(@requestBody() body: any = {}): Promise<any> {
    const {id, status, tableId} = body;
    if (!id) {
      return {error: 'Không thể để trống'};
    }
    try {
      if (tableId) {
        let checkData = await this.reservationsrepo.findById(id);
        checkData.status = status;
        checkData.tableId = tableId;
        let data = await this.reservationsrepo.updateById(id, checkData);
        return {message: 'Update trạng thái đặt bàn thành công', data: data};
      } else {
        let checkData = await this.reservationsrepo.findById(id);
        checkData.status = status;
        let data = await this.reservationsrepo.updateById(id, checkData);
        return {message: 'Update trạng thái đặt bàn thành công', data: data};
      }
    } catch (e) {
      return {error: 'Internal server error occurred, please try again later'};
    }
  }

  @post('/reservations/acceptreservations')
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
  async acceptreservations(@requestBody() body: any = {}): Promise<any> {
    const {id, status} = body;
    try {
      let checkData = await this.reservationsrepo.findById(id, {
        include: [{relation: 'customerInfo'}, {relation: 'tableInfo'}],
      });
      console.log('checkData', checkData);
      if (!checkData) {
        return {message: 'Không tìm thấy đặt bàn bạn chọn!'};
      } else {
        const email =
          checkData.customerInfo?.email || 'tiendat0000155@gmail.com';
        console.log('email', email);
        const emailSubject = 'Yêu Cầu Đặt Bàn';
        if (status === 'accept') {
          const emailBody = `
          Xin chào ${checkData.customerInfo?.name || 'Bạn'}
          Bạn có đặt bàn tại nhà hàng Tiến Đạt vào lúc ${checkData.reservation_time.toLocaleString()}
          Chúng tôi gửi thông báo này cho bạn để xác nhận yêu cầu đặt bàn của bạn đã được chấp nhận
          Và bàn của bạn là ${checkData.tableInfo?.name}
          Mong bạn đến đúng thời gian đã đặt, nếu quá 30 phút giờ hẹn bàn của bạn sẽ tự động hủy
          Xin chân thành cảm ơn bạn đã tin tưởng nhà hàng của chúng tôi chúc bạn 1 ngày tốt lành!`;
          checkData.status = 'confirmed';
          await this.reservationsrepo.updateById(id, {
            status: 'confirmed',
          });
          await this.emailService.sendEmail(email, emailSubject, emailBody);
          return {message: 'Chấp nhận đặt bàn thành công!'};
        } else {
          const emailBody = `
          Xin chào ${checkData.customerInfo?.name || 'Bạn'}
          Bạn có đặt bàn tại nhà hàng Tiến Đạt vào lúc ${checkData.reservation_time.toLocaleString()}
          Chúng tôi vô cùng xin lỗi vì nhà hàng tôi trong thời gian bạn đặt hiện đang bận
          Mong bạn thông cảm cho sự bất tiện này
          Xin chân thành cảm ơn bạn đã tin tưởng nhà hàng của chúng tôi chúc bạn 1 ngày tốt lành!`;
          await this.reservationsrepo.updateById(id, {
            status: 'canceled',
          });
          await this.emailService.sendEmail(email, emailSubject, emailBody);
          return {message: 'Hủy đặt bàn thành công!'};
        }
      }
    } catch (e) {
      return {error: 'Internal server error occurred, please try again later'};
    }
  }
}
