export enum RESOURCE_TYPES {
  LINK = 'link',
  PDF = 'pdf',
  FILE = 'file',
  IMAGE = 'image',
  YOUTUBE = 'youtube',
}

export type RESOURCE_TYPE_TYPE =
  | RESOURCE_TYPES.LINK
  | RESOURCE_TYPES.PDF
  | RESOURCE_TYPES.FILE
  | RESOURCE_TYPES.IMAGE
  | RESOURCE_TYPES.YOUTUBE;
