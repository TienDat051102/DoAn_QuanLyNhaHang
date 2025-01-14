import {AuthenticationStrategy} from '@loopback/authentication';
import {Provider, inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {JWTService} from '../services/jwt.service';
import {UserProfile, securityId} from '@loopback/security'; // Import UserProfile

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    console.log('Authorization Header:', request.headers.authorization); 
    console.log('test')
    const token = this.extractToken(request);
    console.log('token',token)
    if (!token) {
      throw new HttpErrors.Unauthorized('Token not found');
    }

    const decoded = this.jwtService.verifyToken(token);
    
    if (!decoded) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    const userProfile: UserProfile = {
      [securityId]: decoded.id, // id từ payload của token
      username: decoded.username, // username từ payload của token
      email: decoded.email, 
      roles: decoded.roles, 
    };

    return userProfile;
  }

  private extractToken(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    console.log('authorizationHeader',authorizationHeader)
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.substring(7); // Bỏ qua 'Bearer '
    }
    return undefined;
  }
}
