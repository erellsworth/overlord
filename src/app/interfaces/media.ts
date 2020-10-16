export interface MediaOptions {
  altText?: string;
  size?: string;
}
export interface Media {
  id: string;
  url: string;
  crops?: { [key: string]: string };
  options: MediaOptions
}


export interface MediaPreview {
  file: File;
  url: string;
  uploadPercentage: number;
  uploadSettings?: MediaOptions;
}
