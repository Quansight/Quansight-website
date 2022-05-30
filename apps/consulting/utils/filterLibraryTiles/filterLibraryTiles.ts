import { getFilterStartingValue } from '../../components/Filters/utils/getFilterStartingValue';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { FilterMenuVariant } from '../../types/utils/FilterMenuVariant';

export const filterLibraryTiles = (
  tiles: TTiles,
  postType: string,
  postCategory: string,
): TTiles => {
  return tiles.filter((tile) => {
    const categoriesFilterStartingValue = getFilterStartingValue(
      FilterMenuVariant.Category,
    );
    const typesFilterStartingValue = getFilterStartingValue(
      FilterMenuVariant.Type,
    );
    if (
      postCategory === categoriesFilterStartingValue &&
      postType === typesFilterStartingValue
    ) {
      return true;
    }
    if (
      postType === typesFilterStartingValue &&
      postCategory !== categoriesFilterStartingValue
    ) {
      return tile.postCategory.includes(postCategory);
    }
    if (
      postType !== typesFilterStartingValue &&
      postCategory === categoriesFilterStartingValue
    ) {
      return tile.postType === postType;
    }
    if (
      postType !== typesFilterStartingValue &&
      postCategory !== categoriesFilterStartingValue
    ) {
      return (
        tile.postCategory.includes(postCategory) && tile.postType === postType
      );
    }
    return false;
  });
};
