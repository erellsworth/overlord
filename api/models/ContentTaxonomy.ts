import { DataTypes, ModelAttributes } from 'sequelize';
import { db } from '../utils/db';

const attributes: ModelAttributes = {
  TaxonomyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ContentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const ContentTaxonomyModel = db.define('ContentTaxonomy', attributes, {
  timestamps: false,
  tableName: 'ContentTaxonomy',
});

export { ContentTaxonomyModel };
