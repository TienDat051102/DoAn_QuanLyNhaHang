import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {InformationRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class InformationController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(InformationRepository)
    private repo: InformationRepository,
  ) {}

  @get('/information/listinformation')
  async listinformation(@param.query.number('id') id: number): Promise<any> {
    try {
      let data = await this.repo.findById(id);
      if (!data) {
        return {message: `Internal server Error Occurred, Please try again`};
      }
      return {message: 'Xuất dữ liệu thành công', data: data.menu};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
