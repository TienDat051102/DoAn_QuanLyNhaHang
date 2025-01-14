import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import * as bcrypt from 'bcryptjs';
import {UsersRepository} from '../repositories';
import {EmailService} from '../services/email.service';
import {JWTService} from '../services/jwt.service';

export class UserController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(UsersRepository) private userrepo: UsersRepository,
    @inject('services.EmailService') private emailService: EmailService,
  ) {}

  @post('/user/login')
  async login(@requestBody() body: any): Promise<any> {
    const {username, password} = body;

    try {
      const data = await this.userrepo.findOne({where: {username: username}});
      if (data) {
        const isPasswordValid = await bcrypt.compare(password, data.password);

        if (isPasswordValid) {
          const payload = {
            id: data.id,
            username: data.username,
          };
          const token = await this.jwtService.generateToken(payload);
          console.log('token', token);
          await this.userrepo.updateById(data.id, {token: token});
          return {message: 'Đăng nhập thành công', token: token, data: data};
        } else {
          return {message: 'Tài khoản hoặc mật khẩu không chính xác'};
        }
      } else {
        return {message: 'Tài khoản hoặc mật khẩu không chính xác'};
      }
    } catch (error) {
      return {
        message: 'Internal Server Error Occurred, Please try again.',
        error,
      };
    }
  }

  @get('/user/getuserlist')
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
  async getuserlist(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('search') search: string,
  ): Promise<any> {
    try {
      let searchWord = (search || '').toLowerCase();
      const filter: any = {
        skip: skip >= 0 ? skip : undefined,
        limit: limit >= 0 ? limit : undefined,
        where: {username: {ilike: `%${searchWord}%`}},
      };
      const data = await this.userrepo.find(filter);
      let dataCount = await this.userrepo.count({
        username: {ilike: `%${searchWord}%`},
      });
      return {message: 'Thành công', data: data, count: dataCount};
    } catch (error) {
      return {
        error: 'Internal Server Error Occurred, Please try again.',
      };
    }
  }

  @get('/user/getuserlistcount')
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
  async getuserlistcount(
    @param.query.string('param') param: any,
  ): Promise<any> {
    try {
      const data = await this.userrepo.find();
      const count = data.length;
      return {message: 'Thành công', count: count};
    } catch (error) {
      return {
        message: 'Internal Server Error Occurred, Please try again.',
        error,
      };
    }
  }

  @post('/user/createuser')
  // @authenticate('jwt')
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
  async createuser(@requestBody() body: any = {}): Promise<any> {
    const {username, password, email, first_name, last_name, role} = body;
    if (!username || !password || !email) {
      return {message: 'Vui lòng không để trống trường thông tin'};
    }
    const ktdata = await this.userrepo.findOne({
      where: {or: [{username: username}, {email: email}]},
    });
    if (ktdata) {
      return {message: 'Tài khoản đã tồn tại'};
    } else {
      try {
        let payload = {
          username: username,
          password: await bcrypt.hash(password, 10),
          email: email,
          first_name: first_name,
          last_name: last_name,
          role: role ? role : 'staff',
        };
        await this.userrepo.create(payload);
        return {message: 'Đăng ký tài khoản thành công vui lòng đăng nhập'};
      } catch (e) {
        return {
          message: 'Internal Server Error Occurred, Please try again.',
          e,
        };
      }
    }
  }

  @post('/user/updateusers')
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
  async updateusers(@requestBody() body: any): Promise<any> {
    const {id, username, password, email, firstName, lastName, role} = body;
    if (!id) {
      const ktdata = await this.userrepo.findOne({
        where: {username: username, email: email},
      });
      if (ktdata) {
        return {error: 'Có tài khoản đã xử dụng thông tin này'};
      } else {
        try {
          let payload = {
            username: username,
            password: await bcrypt.hash(password, 10),
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: role ? role : 'staff',
          };
          await this.userrepo.create(payload);
          return {message: 'Đăng ký tài khoản thành công'};
        } catch (e) {
          return {
            error: 'Internal Server Error Occurred, Please try again.',
            e,
          };
        }
      }
    }
    let ktdata = await this.userrepo.findById(id);
    if (!ktdata) {
      return {error: 'Không thể tìm thấy tài khoản bạn mong muốn'};
    } else {
      try {
        let payload = {
          username: username,
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: role ? role : 'staff',
          updated_at: new Date().toISOString(),
        };
        let data = await this.userrepo.updateById(id, payload);
        return {message: 'Update User thành công.', data: data};
      } catch (e) {
        return {
          message: 'Internal Server Error Occurred, Please try again.',
          e,
        };
      }
    }
  }

  @post('/user/deleteusers')
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
  async deleteusers(@requestBody() body: any): Promise<any> {
    const {id} = body;
    try {
      const data = await this.userrepo.findById(id);
      if (!data) {
        return {message: 'Không tìm thấy user mong muốn.'};
      } else {
        await this.userrepo.deleteById(id);
        return {message: 'Xóa User thành công'};
      }
    } catch (e) {
      return {message: 'Internal Server Error Occurred, Please try again.', e};
    }
  }

  @post('/user/changpassword')
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
  async changpassword(@requestBody() body: any): Promise<any> {
    const {username, oldpassword, newpassword} = body;
    try {
      let data = await this.userrepo.findOne({where: {username: username}});
      if (data) {
        const isPasswordValid = await bcrypt.compare(
          oldpassword,
          data.password,
        );
        if (isPasswordValid) {
          data.password = await bcrypt.hash(newpassword, 10);
          data.updated_at = new Date().toISOString();
          await this.userrepo.updateById(data.id, data);
          return {message: 'Success'};
        } else {
          return {message: 'Mật khẩu hiện tại bạn nhập vào không đúng!'};
        }
      } else {
        return {message: 'Tài khoản này không tồn tại!'};
      }
    } catch (e) {
      return {error: 'Internal Server Error Occurred, Please try again.', e};
    }
  }
  @post('/user/forgotpassword')
  // @authenticate('jwt')
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
  async forgotpassword(@requestBody() body: any = {}): Promise<any> {
    const {email} = body;
    try {
      let checkData = await this.userrepo.findOne({where: {email: email}});
      if (checkData) {
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        checkData.password = hashedPassword;
        checkData.updated_at = new Date().toISOString();
        await this.userrepo.updateById(checkData.id, checkData);
        const emailSubject = 'Khôi phục mật khẩu';
        const emailBody = `
          Xin chào ${checkData.first_name + ' ' + checkData.last_name || ' bạn'},
          Mật khẩu mới của bạn là: ${newPassword}
          Hãy đăng nhập và đổi mật khẩu ngay để đảm bảo an toàn cho tài khoản.
          Trân trọng,
          Đội ngũ hỗ trợ
        `;
        await this.emailService.sendEmail(email, emailSubject, emailBody);
        return {
          message:
            'Mật khẩu mới đã được gửi đến gmail của bạn vui lòng kiểm tra!',
        };
      } else {
        return {
          message: `${email} này không tồn tại trong hệ thống vui lòng kiểm tra lại!`,
        };
      }
    } catch (e) {
      return {message: 'Xuất hiện lỗi', e};
    }
  }
}
