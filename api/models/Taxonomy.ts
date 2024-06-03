import { DataTypes, ModelAttributes } from "sequelize";
import { TaxonomyInstance, TaxonomyInterface } from "../../interfaces/taxonomy";
import { db } from "../utils/db";
import { attachImage } from "../utils/media.helper";
import { slugger } from "../utils/misc";

const attributes: ModelAttributes<TaxonomyInstance, TaxonomyInterface> = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    metaData: {
        type: DataTypes.JSONB
    },
    image: {
        type: DataTypes.VIRTUAL
    },
    content: {
        type: DataTypes.VIRTUAL
    },
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    createdAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('createdAt');
            return new Date(rawValue as string).toDateString();
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('updatedAt');
            return new Date(rawValue as string).toDateString();
        }
    }
};

const TaxonomyModel = db.define<TaxonomyInstance>('Taxonomy', attributes);

const Taxonomy = {
    findBySlug: async (slug: string): Promise<TaxonomyInterface> => {

        let tag = await TaxonomyModel.findOne({
            where: {
                slug
            },
            logging: false
        }) as unknown as TaxonomyInterface;

        tag = await attachImage(tag) as TaxonomyInterface;

        return tag;
    },
    findAll: async (): Promise<TaxonomyInterface[]> => {
        return await TaxonomyModel.findAll();
    },
    bulkCreate: async (names: string[]) => {
        const newTags = [];

        for (let i = 0; i < names.length; i++) {
            const name = names[i];

            let tag = await TaxonomyModel.findOne({
                where: {
                    name
                }
            }) as unknown as TaxonomyInstance;

            if (!tag) {
                const params = {
                    name,
                    slug: slugger(name),
                    metaData: {}
                };

                console.log('params', params);

                let newTag = await TaxonomyModel.create(params);

                newTags.push(newTag);
            }
        }

        return newTags;
    }
};

export {
    Taxonomy,
    TaxonomyModel
}