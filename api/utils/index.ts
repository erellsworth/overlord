import { Model } from "sequelize/types";
import { db } from "./db";
import { attachImages, attachImage } from './media.helper';

export {
    db,
    attachImages,
    attachImage
}