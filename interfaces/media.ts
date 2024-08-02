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
    /** zero-indexed offset from left edge */
    left: number;
    /** zero-indexed offset from top edge */
    top: number;
    /** dimension of extracted image */
    width: number;
    /** dimension of extracted image */
    height: number;
}

export interface CropEvent { size: 'full' | 'thumb'; crop: Crop };

export interface UploadRequest {
    id: string;
    file: File;
    alt: string;
    name: string;
    crops?: { [key: string]: Crop };
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