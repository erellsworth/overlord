import { S3 } from "aws-sdk";
import { ContentInterface } from "./content";
import { TaxonomyInterface } from "./taxonomy";

export interface contentResults {
    results: ContentInterface[];
    count: number;
    perPage: number;
    taxonomy?: TaxonomyInterface;
}

export interface PaginatedResults<T> {
    contents: T[];
    total: number;
    page: number;
}

export interface GenericResult {
    success: boolean;
    error?: {
        message: string;
        code?: number;
    }
}

export interface ApiResponse<T = void> extends GenericResult {
    data?: T;
}

export interface S3UploadResult extends GenericResult {
    data?: S3.ManagedUpload.SendData
}

export interface ImageStorageResult extends GenericResult {
    fullSizeResult: S3UploadResult;
    thumbResult?: S3UploadResult;
}

export interface NuxtMeta {
    hid: string;
    name: string;
    content: string;
}

export type ContentWithMedia = ContentInterface | TaxonomyInterface;

export interface SettingInterface {
    id: number;
    key: string;
    value: string;
}