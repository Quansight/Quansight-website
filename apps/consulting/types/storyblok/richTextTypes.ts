export interface TRichText {
  content: TContent[];
  type: string;
}

export interface TContent {
  content: TContentItem[];
  type: string;
}

export interface TContentItem {
  text: string;
  type: string;
}
