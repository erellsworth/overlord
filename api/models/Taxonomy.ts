import { DataTypes, Model, ModelAttributes, ModelCtor, Optional } from "sequelize";
import { TaxonomyInterface } from "~/interfaces/taxonomy";
import { db } from "../utils/db";
import { attachImage } from "../utils/media.helper";

interface TaxonomyCreationAttributes extends Optional<TaxonomyInterface, "id"> { }

interface TaxonomyInstance
    extends Model<TaxonomyInterface, TaxonomyCreationAttributes>,
    TaxonomyInterface { }

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
    }
};

export {
    Taxonomy,
    TaxonomyModel
}