export interface TRichText {
  content: TContent[];
  type: string;
}

export interface TContent {
  attrs?: { level?: number };
  content: TContentItem[];
  type: string;
}

export interface TContentItem {
  attrs?: {
    [key: string]: undefined;
  };
  text: string;
  type: string;
}
