import { DataTypes, FindAndCountOptions, ModelAttributes } from 'sequelize';
import { PaginatedResults } from '../../interfaces/misc';
import { TaxonomyInterface, TaxonomyQuery } from '../../interfaces/taxonomy';
import {
  ContentCreation,
  ContentInstance,
  ContentInterface,
  ContentQueryParams,
} from '../../interfaces/content';
import { db } from '../utils';
import { Taxonomy, TaxonomyModel } from './Taxonomy';
import { RevisionInstance, RevisionInterface } from '../../interfaces/revision';

const attributes: ModelAttributes<RevisionInstance> = {
  content: {
    type: DataTypes.JSONB,
  },
  text: {
    type: DataTypes.TEXT,
  },
  html: {
    type: DataTypes.TEXT,
  },
  metaData: {
    type: DataTypes.JSONB,
  },
  // standard attributes:
  createdAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue('createdAt');
      return new Date(rawValue as string).toDateString();
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue('updatedAt');
      return new Date(rawValue as string).toDateString();
    },
  },
};

const RevisionModel = db.define<RevisionInstance>('Revision', attributes);

const Revision = {
  create: async (revision: RevisionInterface): Promise<RevisionInstance> => {
    delete revision.id;
    delete revision.createdAt;
    delete revision.updatedAt;

    const content = await RevisionModel.create(revision);

    return content;
  },
};

export { Revision, RevisionModel };
