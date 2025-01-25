import { DataTypes, ModelAttributes } from 'sequelize';
import { db } from '../utils/db';
import { SettingInstance, SettingInterface } from '../../interfaces/setting';

const attributes: ModelAttributes<SettingInstance, SettingInterface> = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,
  },
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
};

const SettingModel = db.define<SettingInstance>('Setting', attributes, {
  timestamps: false,
});

export { SettingModel };
