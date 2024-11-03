import { DataTypes, ModelAttributes } from 'sequelize';
import { db } from '../utils/db';

const attributes: ModelAttributes = {
  LinkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const ContentTaxonomyModel = db.define('ContentTaxonomy', attributes, {
  timestamps: false,
  tableName: 'ContentTaxonomy',
});

export { ContentTaxonomyModel };
