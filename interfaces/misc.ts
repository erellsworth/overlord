import { S3 } from "aws-sdk";
import { ContentInterface } from "./content";
import { TaxonomyInterface } from "./taxonomy";
import { CompleteMultipartUploadOutput } from "aws-sdk/clients/s3";

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

export interface PaginatedApiResponse<T = void> extends GenericResult {
    data?: PaginatedResults<T>
}

export interface S3UploadResult extends GenericResult {
    data?: CompleteMultipartUploadOutput
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