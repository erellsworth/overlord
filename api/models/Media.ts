import { DataTypes, ModelAttributes } from "sequelize";
import { MediaInstance, MediaInterface } from "~/interfaces/media";
import { PaginatedResults } from "~/interfaces/misc";
import { db } from "../utils/db";

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
        type: DataTypes.INTEGER,
        autoIncrement: true,
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

const MediaModel = db.define('Media', attributes);

const Media = {
    findById: async (id: string): Promise<MediaInstance> => {
        return await MediaModel.findByPk(id, { logging: false }) as unknown as MediaInstance;
    },
    findAll: async (page: number): Promise<PaginatedResults<MediaInstance>> => {
        const limit = 12;

        const offset = (page - 1) * limit;
        const { count, rows } = await MediaModel.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            logging: false,
            distinct: true,
            offset
        });

        return {
            contents: rows,
            total: count,
            page: page
        };
    }
}

export {
    MediaModel,
    Media
}