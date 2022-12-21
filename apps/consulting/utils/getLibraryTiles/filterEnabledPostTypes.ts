import { DatasourceEntries } from '../../api/types/basic';
import { enabledPostTypeNames } from '../constants';

export const filterEnabledPostTypes = (
  postTypes: DatasourceEntries,
): DatasourceEntries => {
  return {
    items: postTypes.items.filter((item) =>
      enabledPostTypeNames.includes(item.name),
    ),
    total: 3,
  };
};

export default filterEnabledPostTypes;
