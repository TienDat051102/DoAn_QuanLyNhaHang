import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {
  IngredientsRepository,
  InventoryTransactionsRepository,
  MenuItemsRepository,
} from '../repositories';
import {JWTService} from '../services/jwt.service';

export class IngredientsController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(IngredientsRepository)
    private ingredientsrepo: IngredientsRepository,
    @repository(MenuItemsRepository)
    private menuItemsRepository: MenuItemsRepository,
    @repository(InventoryTransactionsRepository)
    private inventoryTransactionsRepository: InventoryTransactionsRepository,
  ) {}

  @get('/ingredients/listingredients')
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
  async listingredients(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.string('search') search: string,
  ): Promise<any> {
    let searchWord = (search || '').toLowerCase();
    const filter: any = {
      skip: skip >= 0 ? skip : undefined,
      limit: limit >= 0 ? limit : undefined,
      where: {name: {ilike: `%${searchWord}%`}},
    };
    try {
      let data = await this.ingredientsrepo.find(filter);
      let dataCount = await this.ingredientsrepo.count({
        name: {ilike: `%${searchWord}%`},
      });
      return {
        message: `Dữ liệu được xuất thành công`,
        data: data,
        count: dataCount,
      };
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @get('/ingredients/listingredientscount')
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
  async listingredientscount(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.string('search') search: string,
  ): Promise<any> {
    const filter: any = {
      order: 'id',
    };
    try {
      let data = await this.ingredientsrepo.find(filter);
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
        message: `Xuất số lượng dữ liệu thành công`,
        data: {count: result.length},
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`};
    }
  }

  @post('/ingredients/createingredients')
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
  async createingredients(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.string('param') body: any,
  ): Promise<any> {
    const {name, quantity, unit, expiration_date} = body;
    try {
      if (!name) {
        return {message: `Bắt buộc phải có trường tên`};
      }
      let payload: any = {
        name: name,
        quantity: quantity ? quantity : 0,
        unit: unit,
        expiration_date: expiration_date,
        created_at: Date.now(),
      };
      let data = await this.ingredientsrepo.create(payload);
      return {message: `Thêm dữ liệu thành công`, data: data};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`};
    }
  }

  @post('/ingredients/updateingredients')
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
  async updateingredients(
    // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @requestBody() body: any = {},
  ): Promise<any> {
    const {id, name, quantity, unit, expiration_date, isActive} = body;
    try {
      if (!id) {
        let payload: any = {
          name: name,
          quantity: quantity ? quantity : 0,
          unit: unit,
          expiration_date: expiration_date,
          created_at: Date.now(),
          is_active: isActive,
        };
        const ktdata = await this.ingredientsrepo.findOne({
          where: {name: name},
        });
        if (ktdata) {
          return {error: 'Nguyên Liệu này đã có vui lòng chọn chỉnh sửa!'};
        }
        let data = await this.ingredientsrepo.create(payload);
        return {message: `Thêm dữ liệu thành công`, data: data};
      }
      const ktdata = await this.ingredientsrepo.findById(id);
      if (!ktdata) {
        return {error: `Không có nguyên liệu bạn chọn`};
      }
      let payload: any = {
        name: name,
        quantity: quantity ? quantity : 0,
        unit: unit,
        expiration_date: expiration_date,
        is_active: isActive,
      };
      let data = await this.ingredientsrepo.updateById(id, payload);
      return {message: 'Update nguyên liệu thành công', data: data};
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`};
    }
  }

  @post('/ingredients/deleteingredients')
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
  async deleteingredients(@requestBody() body: any = {}): Promise<any> {
    const {id} = body;
    try {
      const ktdata = await this.ingredientsrepo.findById(id);
      if (!ktdata) {
        return {error: `Không có nguyên liệu bạn chọn`};
      }
      await this.ingredientsrepo.deleteById(id);
      const affectedMenuItems: any = await this.menuItemsRepository.execute(
        `SELECT * FROM menuitems WHERE ingredients @> '[{"id": ${id}}]'`,
      );
      for (let menuItem of affectedMenuItems) {
        menuItem.status = false;
        await this.menuItemsRepository.updateById(menuItem.id, menuItem);
      }
      return {message: 'Xóa nguyên liệu thành công'};
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @get('/ingredients/checkAndUpdateIngredients')
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
  async checkAndUpdateIngredients(): Promise<any> {
    try {
      const ingredients = await this.ingredientsrepo.find({
        where: {is_active: true},
      });
      const currentDate = new Date();

      const expiredIngredients = ingredients.filter(
        ingredient =>
          ingredient.expiration_date !== null &&
          new Date(ingredient.expiration_date) < currentDate,
      );
      await Promise.all(
        expiredIngredients.map(async ingredient => {
          const payload = {
            ingredientId: ingredient.id,
            quantity: Math.round(ingredient.quantity),
            transaction_type: 'remove',
            notes: 'Bỏ nguyên liệu do hết hạn',
          };
          await this.inventoryTransactionsRepository.create(payload);

          ingredient.quantity = 0;
          ingredient.is_active = false;
          await this.ingredientsrepo.updateById(ingredient.id, ingredient);
          const affectedMenuItems: any = await this.menuItemsRepository.execute(
            `SELECT * FROM menuitems WHERE ingredients @> '[{"id": ${ingredient.id}}]'`,
          );

          await Promise.all(
            affectedMenuItems.map(async (menuItem: any) => {
              menuItem.status = false;
              await this.menuItemsRepository.updateById(menuItem.id, menuItem);
            }),
          );
        }),
      );
      return {
        message: 'Kiểm tra nguyên liệu thành công!',
        data: expiredIngredients,
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @get('/ingredients/checkingredients')
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
  async checkingredients(): Promise<any> {
    try {
      const data = await this.ingredientsrepo.find();
      return {
        message: 'Các nguyên liệu hiện đang hết!',
        data: data,
      };
    } catch (e) {
      return {message: `Internal server Error Occurred, Please try again`, e};
    }
  }

  @post('/ingredients/addvalidateingredients')
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
  async addvalidateingredients(@requestBody() body: any = {}): Promise<any> {
    const {ingredientId, quantity, new_expiration_date} = body;
    try {
      console.log('body', body);
      let checkIngredient = await this.ingredientsrepo.findById(ingredientId);
      console.log('checkIngredient', checkIngredient);
      if (checkIngredient) {
        const payloadInventory = {
          ingredientId: ingredientId,
          quantity: Number(quantity),
          new_expiration_date: new Date(new_expiration_date).toISOString(),
          transaction_type: 'add',
        };
        console.log('payloadInventory', payloadInventory);
        await this.inventoryTransactionsRepository.create(payloadInventory);
        console.log('test1');
        (checkIngredient.quantity =
          Number(checkIngredient.quantity) + Number(quantity)),
          (checkIngredient.expiration_date = new_expiration_date),
          (checkIngredient.is_active = true);
        console.log('checkIngredient', checkIngredient);
        await this.ingredientsrepo.updateById(ingredientId, checkIngredient);
        console.log('test2');
        const affectedMenuItems: any = await this.menuItemsRepository.execute(
          `SELECT * FROM menuitems WHERE ingredients @> '[{"id": ${ingredientId}}]'`,
        );

        await Promise.all(
          affectedMenuItems.map(async (menuItem: any) => {
            console.log('menuItem', menuItem);
            const allIngredientsSufficient = await Promise.all(
              menuItem.ingredients.map(async (ingredientId: any) => {
                console.log('ingredientId', ingredientId);
                const ingredient = await this.ingredientsrepo.findById(
                  ingredientId.id,
                );
                console.log('ingredient');
                return ingredient.quantity > 0;
              }),
            );
            console.log('test3');
            if (allIngredientsSufficient.every(sufficient => sufficient)) {
              menuItem.status = true;
              await this.menuItemsRepository.updateById(menuItem.id, menuItem);
            }
          }),
        );
        return {message: 'Success'};
      } else {
        return {message: `Không tìm thấy nguyên liệu`};
      }
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }
}
