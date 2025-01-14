import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {MenuItemsRepository, NavMenuRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class NavMenuController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(NavMenuRepository)
    private navmenurepo: NavMenuRepository,
    @repository(MenuItemsRepository)
    private menuitemrepo: MenuItemsRepository,
  ) {}

  @get('/navmenu/listnavmenu')
  async listnavmenu(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('search') search: string,
  ): Promise<any> {
    let searchWord = (search || '').toLowerCase();
    const filter: any = {
      skip: skip >= 0 ? skip : undefined,
      limit: limit >= 0 ? limit : undefined,
      where: {title: {ilike: `%${searchWord}%`}, is_visible: true},
      include: [
        {
          relation: 'navmenuitems',
          scope: {
            where: {is_visible: true},
          },
        },
      ],
    };
    try {
      let data = await this.navmenurepo.find(filter);
      const adminData = data.filter(item => item.static !== 'customer');
      const customerData = data.filter(item => item.static === 'customer');
      return {
        message: 'Xuất dữ liệu thành công',
        adminData: adminData,
        customerData: customerData,
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
