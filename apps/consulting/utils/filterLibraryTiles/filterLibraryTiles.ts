import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { getFilterStartingValue } from '../getFiltersStartingValue/getFilterStartingValue';
import { FilterMenuVariant } from '../getFiltersStartingValue/types';

export const filterLibraryTiles = (
  tiles: TTiles,
  postType: string,
  postCategory: string,
): TTiles => {
  return tiles.filter((tile) => {
    if (
      postCategory === getFilterStartingValue(FilterMenuVariant.Categories) &&
      postType === getFilterStartingValue(FilterMenuVariant.Types)
    ) {
      return true;
    }

    if (
      postType === getFilterStartingValue(FilterMenuVariant.Types) &&
      postCategory !== getFilterStartingValue(FilterMenuVariant.Categories)
    ) {
      return tile.postCategory.includes(postCategory);
    }
    if (
      postType !== getFilterStartingValue(FilterMenuVariant.Types) &&
      postCategory === getFilterStartingValue(FilterMenuVariant.Categories)
    ) {
      return tile.postType === postType;
    }
    if (
      postType !== getFilterStartingValue(FilterMenuVariant.Types) &&
      postCategory !== getFilterStartingValue(FilterMenuVariant.Categories)
    ) {
      return (
        tile.postCategory.includes(postCategory) && tile.postType === postType
      );
    }
    return false;
  });
  return tiles;
};
