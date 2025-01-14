export const keys = {
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
    jwtExpiresIn: '1h',
  };

  
import { TokenService, UserService } from '@loopback/authentication';
import { BindingKey } from '@loopback/context';

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expires.in.seconds');
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.authentication.jwt.tokenservice');
}


  