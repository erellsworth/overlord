import { DataTypes, ModelAttributes } from "sequelize";
import { MediaInstance, MediaInterface } from "../../interfaces/media";
import { GenericResult, PaginatedResults } from "../../interfaces/misc";
import { db } from "../utils/db";
import { incrementFileName } from "../utils/media.helper";

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
    findById: async (id: number): Promise<MediaInstance> => {
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
    },
    getNewFileName: async (filename: string): Promise<string> => {
        const media = await MediaModel.findOne({
            where: {
                filename
            }
        });

        if (!media) {
            return filename;
        }

        return Media.getNewFileName(incrementFileName(filename));
    },
    checkName: async (filename: string): Promise<boolean> => {
        const media = await MediaModel.findOne({
            where: {
                filename
            }
        });

        if (media) {
            return false;
        }

        return true;
    },
    remove: async (id: string): Promise<GenericResult> => {
        const media = await MediaModel.findByPk(id, { logging: false }) as unknown as MediaInstance;

        if (!media) {
            return {
                success: false,
                error: { message: 'Media not found' }
            };
        }
        await media.destroy();

        return {
            success: true
        }
    }
}

export {
    MediaModel,
    Media
}