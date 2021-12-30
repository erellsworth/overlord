import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import { MediaInterface } from "~/interfaces/media";
import { db } from "../utils/db";

interface MediaCreationAttributes extends Optional<MediaInterface, "id"> { }

interface MediaInstance
    extends Model<MediaInterface, MediaCreationAttributes>,
    MediaInterface { }

const attributes: ModelAttributes<MediaInstance, MediaInterface> = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '/uploads'
    },
    mimetype: {
        type: DataTypes.STRING,
        allowNull: false
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

const MediaModel = db.define('Media', attributes);

const Media = {
    findById: async (id: string): Promise<MediaInterface> => {
        return await MediaModel.findByPk(id, { logging: false }) as unknown as MediaInterface;
    }
}

export {
    MediaModel,
    Media
}