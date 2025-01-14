import {post, requestBody, get, param, response} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {JWTService} from '../services/jwt.service';
import {Users} from '../models';
import { repository } from '@loopback/repository';
import {  IngredientsRepository, InventoryTransactionsRepository, UsersRepository } from '../repositories';
import * as bcrypt from 'bcryptjs'; 

export class InventoryTransactionsController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(InventoryTransactionsRepository) private inventorytransactionsrepo: InventoryTransactionsRepository,
    @repository(IngredientsRepository) private ingredientsrepo: IngredientsRepository,
  ) {}

  @get('/inventorytransactions/listinventorytransactions')
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
  async listinventorytransactions(
   // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<any> {
    const filter: any = {
        skip: skip >= 0 ? skip : undefined,
        limit: limit >= 0 ? limit : undefined,
    }
    try{
        let data = await this.inventorytransactionsrepo.find(filter)
        return {message: 'Xuất dữ liệu thành công', data: data}
    }
    catch(e){
        return {message: `Internal server Error Occurred, Please try again`,e};
    }
  }

  @get('/inventorytransactions/listinventorytransactionscount')
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
  async listinventorytransactionscount(
   // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
    
  ): Promise<any> {
    try{
        let data = await this.inventorytransactionsrepo.find()
        return {message: 'Xuất dữ liệu thành công', data: data}
    }catch(e){
        return {message: `Internal server Error Occurred, Please try again`,e};
    }
  }

  @post('/inventorytransactions/createinventorytransactions')
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
  async createinventorytransactions(
   // @inject(RestBindings.Http.REQUEST) request: ClientRequest,
   @param.query.string('param') body: any,
  ): Promise<any> {
    const {ingredient_id, quantity, transaction_type, notes} = body
    if(!ingredient_id || !quantity || !transaction_type){
        return {message: 'Không thể tạo vì thiếu dữ liệu'}
    }
    try{
        let ktingredients = await this.ingredientsrepo.findById(ingredient_id)
        if(!ktingredients){
            return {message: 'không tìm thấy nguyên liệu bạn mong muốn'}
        }
        let payload:any = {
            ingredient_id: ingredient_id,
            quantity: quantity,
            transaction_type: transaction_type,
            transaction_date: Date.now(),
            notes: notes
        }
        if(transaction_type == 'add'){
            let sl = ktingredients.quantity + quantity
            await this.ingredientsrepo.updateById(ingredient_id,{quantity: sl})
            let data = await this.inventorytransactionsrepo.create(payload)
            return {message: 'Thêm thành công', data: data}
        }
        else if(transaction_type == 'remove'){
           if(ktingredients.quantity < quantity){
            return {message: 'Số lượng còn không đủ để xóa'}
           }
           else{
            let sl = ktingredients.quantity - quantity
            await this.ingredientsrepo.updateById(ingredient_id,{quantity: sl})
            let data = await this.inventorytransactionsrepo.create(payload)
            return {message: 'Thêm thành công',data: data}
           }
        }
        else{
            return {message: `Internal server Error Occurred, Please try again`};
        }
    }
    catch(e){
        return {message: `Internal server Error Occurred, Please try again`,e};
    }
  }
}