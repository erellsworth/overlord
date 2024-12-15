import { Model, Optional } from 'sequelize/types';

export interface SettingInterface<T = object> {
  id?: number;
  name: string;
  data: T;
}

export interface SettingCreationAttributes
  extends Optional<SettingInterface, 'id'> {}

export interface SettingInstance
  extends Model<SettingInterface, SettingCreationAttributes>,
    SettingInterface {}
