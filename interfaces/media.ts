import { Model, Optional } from "sequelize";

export interface MediaInterface {
    id: number;
    createdAt: string;
    updatedAt: string;
    filename: string;
    path: string;
    mimetype: string;
    name: string;
    alt: string;
}

export interface Image {
    full: string;
    thumbnail: string;
    data: MediaInterface
};

interface MediaCreationAttributes extends Optional<MediaInterface, "id"> { }

export interface MediaInstance
    extends Model<MediaInterface, MediaCreationAttributes>,
    MediaInterface { }