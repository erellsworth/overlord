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
import { attachImage, attachImages } from '../utils/media.helper';
import { Taxonomy, TaxonomyModel } from './Taxonomy';
import { Revision, RevisionModel } from './Revision';

const attributes: ModelAttributes<ContentInstance> = {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'draft',
  },
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
  seo: {
    type: DataTypes.JSON,
  },
  image: {
    type: DataTypes.VIRTUAL,
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

const ContentModel = db.define<ContentInstance>('Content', attributes);

const Content = {
  prepareForSave: async (
    preparedContent: ContentCreation,
  ): Promise<{
    preparedContent: ContentCreation;
    tagIds: number[];
  }> => {
    const newTaxonomies = preparedContent.newTaxonomies || [];
    delete preparedContent.newTaxonomies;
    delete preparedContent.createdAt;
    delete preparedContent.updatedAt;

    if (!preparedContent.Taxonomies) {
      preparedContent.Taxonomies = [];
    }

    if (newTaxonomies.length) {
      const newTags = await Taxonomy.bulkCreate(newTaxonomies);
      preparedContent.Taxonomies = preparedContent.Taxonomies.concat(newTags);
    }

    const tagIds = preparedContent.Taxonomies.map(
      (tag: TaxonomyInterface) => tag.id as number,
    );

    return {
      preparedContent,
      tagIds,
    };
  },
  create: async (newContent: ContentCreation): Promise<ContentInstance> => {
    const { preparedContent, tagIds } =
      await Content.prepareForSave(newContent);

    delete preparedContent.id;

    const content = await ContentModel.create(preparedContent);

    // @ts-ignore
    content.addTaxonomies(tagIds);

    return content;
  },
  update: async (contentUpdate: ContentCreation) => {
    const { preparedContent, tagIds } =
      await Content.prepareForSave(contentUpdate);

    console.log('update', preparedContent.text);

    const content = await Content.findById(contentUpdate.id as number);

    const updatedContent = await content.update(preparedContent);

    // @ts-ignore
    updatedContent.addTaxonomies(tagIds);

    const ContentId = contentUpdate.id as number;
    delete contentUpdate.id;
    await Revision.create({
      ...contentUpdate,
      ...{
        ContentId,
      },
    });

    return updatedContent;
  },
  findAll: async (
    query: ContentQueryParams,
  ): Promise<PaginatedResults<ContentInstance>> => {
    const page = query.page ? query.page : 1;

    const options: FindAndCountOptions = {
      where: {},
      include: TaxonomyModel,
      order: [['createdAt', 'DESC']],
      logging: false,
      distinct: true,
    };

    if (!query.noPagination) {
      options.limit = query.limit ? query.limit : 10;
      options.offset = (parseInt(page.toString()) - 1) * options.limit;
    }

    if (query.type) {
      options.where = {
        type: query.type,
      };
    }

    const { count, rows } = await ContentModel.findAndCountAll(options);

    const contents = (await attachImages(rows)) as ContentInstance[];

    return {
      contents,
      total: count,
      page,
    };
  },
  findById: async (id: number): Promise<ContentInstance> => {
    const content = (await ContentModel.findOne({
      where: {
        id,
      },
      include: TaxonomyModel,
      logging: false,
    })) as unknown as ContentInterface;

    return (await attachImage(content)) as ContentInstance;
  },
  findBySlug: async (slug: string): Promise<ContentInstance> => {
    const content = (await ContentModel.findOne({
      where: {
        slug,
      },
      include: [TaxonomyModel, RevisionModel],
      logging: false,
    })) as unknown as ContentInterface;

    return (await attachImage(content)) as ContentInstance;
  },
  findByTaxonomy: async (
    query: TaxonomyQuery,
  ): Promise<PaginatedResults<ContentInstance>> => {
    const { slug, limit, page } = query;
    const offset = (parseInt(page.toString()) - 1) * limit;

    const { count, rows } = await ContentModel.findAndCountAll({
      where: {
        status: 'published',
        '$Taxonomies.slug$': slug,
      },
      include: [
        {
          model: TaxonomyModel,
          duplicating: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      logging: false,
      distinct: true,
      offset,
    });

    const contents = (await attachImages(rows)) as ContentInstance[];

    return {
      contents,
      total: count,
      page,
    };
  },
};

export { Content, ContentModel };
