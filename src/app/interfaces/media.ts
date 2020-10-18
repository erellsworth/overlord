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
