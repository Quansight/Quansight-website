export type TLinkEntry<
  LinkEntry extends {
    id: number;
    isFolder: boolean;
    name: string;
    slug: string;
  },
> = Pick<LinkEntry, 'id' | 'isFolder' | 'name' | 'slug'>;
