import { Model, Optional } from "sequelize/types";
import { baseInterface } from "./base";
import { ContentInterface } from "./content";
import { Image } from "./media";
import { PaginatedResults } from "./misc";

export interface TaxonomyInterface extends baseInterface {
    name: string;
    description?: string;
    metaData: {
        media_id?: number;
    }
    content?: PaginatedResults<ContentInterface>;
    image?: Image;
}

export interface TaxonomyQuery {
    slug: string;
    limit: number;
    page: number;
}

export interface TaxonomyCreationAttributes extends Optional<TaxonomyInterface, "id"> { }

export interface TaxonomyInstance
    extends Model<TaxonomyInterface, TaxonomyCreationAttributes>,
    TaxonomyInterface { }