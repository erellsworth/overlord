import { Model, Optional } from "sequelize";
import { GenericResult } from "./misc";

export interface MediaInterface {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    filename: string;
    path: string;
    mimetype: string;
    name: string;
    alt: string;
}

export interface Image {
    full: string;
    thumbnail: string;
    data: MediaInterface;
};

export interface Crop {
    height: number;
    left: number;
    top: number;
    width: number;
}

export interface MediaCreationResult extends GenericResult {
    image?: Image;
}

export interface MediaDeletionResult extends GenericResult {
    media?: MediaInstance;
}

interface MediaCreationAttributes extends Optional<MediaInterface, "id"> { }

export interface MediaInstance
    extends Model<MediaInterface, MediaCreationAttributes>,
    MediaInterface { }