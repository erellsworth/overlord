import { ContentInterface } from "./content";
import { TaxonomyInterface } from "./taxonomy";

export interface contentResults {
    results: ContentInterface[];
    count: number;
    perPage: number;
    taxonomy?: TaxonomyInterface;
}

export interface PaginatedResults {
    contents: ContentInterface[];
    total: number;
    page: number;
}

export interface ApiResponse {
    success: boolean;
    data?: any;
    error?: {
        message: string;
        code: number;
    }
}

export interface NuxtMeta {
    hid: string;
    name: string;
    content: string;
}

export type ContentWithMedia = ContentInterface | TaxonomyInterface;