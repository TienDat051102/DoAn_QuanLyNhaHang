import {Entity, model, property} from '@loopback/repository';

@model()
export class Information extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'object',
    postgresql: {
      dataType: 'jsonb',
    },
  })
  menu: object;
}
export interface InformationRelations {}

export type InformationWithRelations = Information & InformationRelations;
