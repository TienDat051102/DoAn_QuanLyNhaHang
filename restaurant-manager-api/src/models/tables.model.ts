import {Entity, model, property} from '@loopback/repository';

@model()
export class Tables extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'number',
  })
  capacity: number; // số người có thể chứa

  @property({
    type: 'string',
  })
  location: string;

  @property({
    type: 'boolean',
    default: true,
  })
  is_available: boolean;

  constructor(data?: Partial<Tables>) {
    super(data);
  }
}

export interface TablesRelations {}

export type TablesWithRelations = Tables & TablesRelations;
