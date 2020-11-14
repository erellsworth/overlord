export interface MediaOptions {
  altText?: string;
  size?: string;
}
export interface Media {
  id?: string;
  name: string;
  url: string;
  sizes?: { [key: string]: string };
  type: string;
  options: MediaOptions
}

export interface MediaUploadRequest {
  bucket: string;
  image: string;
  type: string;
  name: string;
}
