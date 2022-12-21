import { DatasourceEntries } from '../../api/types/basic';
import { enabledPostTypes } from '../../utils/constants';

export const filterPostTypes = (
  postTypes: DatasourceEntries,
): DatasourceEntries => {
  return {
    items: postTypes.items.filter((item) =>
      enabledPostTypes.includes(item.name),
    ),
    total: 3,
  };
};
