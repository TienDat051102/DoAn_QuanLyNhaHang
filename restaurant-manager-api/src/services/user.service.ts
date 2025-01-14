import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {repository} from '@loopback/repository';
import {Users} from '../models';
import {UsersRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {injectable, BindingScope} from '@loopback/core';
import {compare} from 'bcryptjs';

@injectable({scope: BindingScope.TRANSIENT})
export class MyUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository)
    public userRepository: UsersRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Users> {
    const foundUser = await this.userRepository.findOne({
      where: {username: credentials.username},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const passwordMatched = await compare(credentials.password, foundUser.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    return foundUser;
  }

  convertToUserProfile(user: Users): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      name: user.username,
      id: user.id,
    };
  }
}

export interface Credentials {
  username: string;
  password: string;
}
