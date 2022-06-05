import { DataTypes, ModelAttributes } from "sequelize";
import { PaginatedResults } from "~/interfaces/misc";
import { TaxonomyQuery } from "~/interfaces/taxonomy";
import { ContentInstance, ContentInterface, ContentQuery } from "../../interfaces/content";
import { db } from "../utils";
import { attachImage, attachImages } from "../utils/media.helper";
import { TaxonomyModel } from "./Taxonomy";

const attributes: ModelAttributes<ContentInstance, ContentInterface> = {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
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
        type: DataTypes.JSONB
    },
    seo: {
        type: DataTypes.JSON
    },
    image: {
        type: DataTypes.VIRTUAL
    },
    // standard attributes:
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
    },
    createdAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('createdAt');
            return new Date(rawValue).toDateString();
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('updatedAt');
            return new Date(rawValue).toDateString();
        }
    }
}

const ContentModel = db.define<ContentInstance>('Content', attributes);

const Content = {
    findAll: async (query: ContentQuery): Promise<PaginatedResults<ContentInstance>> => {
        const { type, limit, page } = query;
        const offset = (parseInt(page.toString()) - 1) * limit;

        const { count, rows } = await ContentModel.findAndCountAll({
            where: {
                status: 'published',
                type
            },
            include: TaxonomyModel,
            order: [['createdAt', 'DESC']],
            limit,
            logging: false,
            distinct: true,
            offset
        });

        const contents = await attachImages(rows) as ContentInstance[];

        return {
            contents: contents,
            total: count,
            page: page
        };

    },
    findBySlug: async (slug: string): Promise<ContentInstance> => {
        const content = await ContentModel.findOne({
            where: {
                status: 'published',
                slug,
            },
            include: TaxonomyModel,
            logging: false
        }) as unknown as ContentInterface;

        return await attachImage(content) as ContentInstance;
    },
    findByTaxonomy: async (query: TaxonomyQuery): Promise<PaginatedResults<ContentInstance>> => {
        const { slug, limit, page } = query;
        const offset = (parseInt(page.toString()) - 1) * limit;

        const { count, rows } = await ContentModel.findAndCountAll({
            where: {
                status: 'published',
                '$Taxonomies.slug$': slug
            },
            include: [{
                model: TaxonomyModel,
                duplicating: false
            }],
            order: [['createdAt', 'DESC']],
            limit,
            logging: false,
            distinct: true,
            offset
        });

        const contents = await attachImages(rows) as ContentInstance[];

        return {
            contents,
            total: count,
            page
        };
    }
};

export {
    Content,
    ContentModel
}
