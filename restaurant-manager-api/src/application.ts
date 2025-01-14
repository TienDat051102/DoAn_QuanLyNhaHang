import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import path from 'path';
import {EmailController} from './controllers';
import {TokenServiceBindings} from './keys';
import {MySequence} from './sequence';
import {EmailService} from './services/email.service';
import {JWTService} from './services/jwt.service';
import {JWTStrategy} from './strategies/jwt.strategy';
dotenv.config();

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');
const pkg: PackageInfo = require('../package.json');

export {ApplicationConfig};

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.controller(EmailController);
    // Cấu hình tiền tố cho tất cả các routes
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent);
    this.bind('services.EmailService').toClass(EmailService);
    this.sequence(MySequence);

    // thiết lập trang chính
    this.static('/', path.join(__dirname, '../public'));
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        // Tùy chỉnh các quy tắc ControllerBooter
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    // Đăng ký dịch vụ JWT
    this.bind('services.JWTService').toClass(JWTService);

    // Đăng ký chiến lược JWT
    this.bind('authentication.strategies.jwt').toClass(JWTStrategy);
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);
    //
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env.JWT_EXPIRY_TIME || '21600',
    );
  }
}
