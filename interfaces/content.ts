import { Model, Optional } from "sequelize";
import { baseInterface } from "./base"
import { Image } from "./media";
import { TaxonomyInterface } from "./taxonomy";

export type ContentType = 'post' | 'page';
export type ContentStatus = 'published' | 'draft';

export interface ContentInterface extends baseInterface {
    title: string;
    type: ContentType;
    status: ContentStatus;
    text: string;
    html: string;
    content: any;
    seo: {
        description: string;
        [key: string]: string
    };
    metaData: {
        text: string;
        media_id: number;
    };
    Taxonomies?: TaxonomyInterface[];
    Tag?: any;
    image?: Image;
}

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface ContentCreationAttributes extends Optional<ContentInterface, "id"> { Tag: any }

// We need to declare an interface for our model that is basically what our class would be
export interface ContentInstance
    extends Model<any, ContentCreationAttributes>,
    ContentInterface { }

export interface ContentQuery {
    type: 'post' | 'page';
    limit: number;
    page: number;
}
