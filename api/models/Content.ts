import { DataTypes, Model, ModelAttributes, ModelCtor, Optional } from "sequelize";
import { MediaInterface } from "~/interfaces/media";
import { PaginatedResults } from "~/interfaces/misc";
import { TaxonomyQuery } from "~/interfaces/taxonomy";
import { ContentInterface, ContentQuery } from "../../interfaces/content";
import { db } from "../utils";
import { attachImage, attachImages } from "../utils/media.helper";
import { Media } from "./Media";
import { TaxonomyModel } from "./Taxonomy";

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface ContentCreationAttributes extends Optional<ContentInterface, "id"> { Tag: any }

// We need to declare an interface for our model that is basically what our class would be
interface ContentInstance
    extends Model<any, ContentCreationAttributes>,
    ContentInterface { }

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
        type: DataTypes.TEXT,
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
    findAll: async (query: ContentQuery): Promise<PaginatedResults> => {
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

        const contents = await attachImages(rows) as ContentInterface[];

        return {
            contents: contents,
            total: count,
            page: page
        };

    },
    findBySlug: async (slug: string): Promise<ContentInterface> => {
        const content = await ContentModel.findOne({
            where: {
                status: 'published',
                slug,
            },
            include: TaxonomyModel,
            logging: false
        }) as unknown as ContentInterface;

        return await attachImage(content) as ContentInterface;
    },
    findByTaxonomy: async (query: TaxonomyQuery): Promise<PaginatedResults> => {
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

        const contents = await attachImages(rows) as ContentInterface[];

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
