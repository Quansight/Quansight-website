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

    const isNotFiltered =
      postCategory === categoriesFilterStartingValue &&
      postType === typesFilterStartingValue;

    const isFilteredByCategory =
      postType === typesFilterStartingValue &&
      postCategory !== categoriesFilterStartingValue;

    const isFilteredByType =
      postType !== typesFilterStartingValue &&
      postCategory === categoriesFilterStartingValue;

    const isFilteredByAll =
      postType !== typesFilterStartingValue &&
      postCategory !== categoriesFilterStartingValue;

    if (isNotFiltered) {
      return true;
    }
    if (isFilteredByCategory) {
      return tile.postCategory.includes(postCategory);
    }
    if (isFilteredByType) {
      return tile.postType === postType;
    }
    if (isFilteredByAll) {
      return (
        tile.postCategory.includes(postCategory) && tile.postType === postType
      );
    }
    return false;
  });
};
