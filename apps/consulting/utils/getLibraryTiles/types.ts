import {
  PageItem,
  PageItems,
  LibrarylinkItem,
  LibrarylinkItems,
} from '../../api/types/basic';

export type TLibraryTileRawData = LibrarylinkItem | PageItem | null;

export type TGetLibraryTilesProps = {
  blogArticles: PageItems;
  libraryLinks: LibrarylinkItems;
};
