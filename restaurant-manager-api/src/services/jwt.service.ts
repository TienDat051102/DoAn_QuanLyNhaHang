import {injectable,inject} from '@loopback/core';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {keys, TokenServiceBindings} from '../keys'; // Import keys

@injectable()
export class JWTService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  private jwtSecret: string;
  private readonly jwtExpiresIn: string = keys.jwtExpiresIn;

  async generateToken(userProfile: object): Promise<string> {
    if (!userProfile) {
      throw new Error('Error generating token');
    }
    console.log('userProfile',userProfile)
    const token = await this.signAsync(userProfile, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      algorithm: 'HS256', 
    });
    return token;
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload; 
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error); // Log lỗi
      return null; 
    }
  }

  private signAsync(payload: object, secret: string, options: jwt.SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      });
    });
  }
}
