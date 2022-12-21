import { DatasourceEntries } from '../../api/types/basic';

export const filterPostTypes = (
  postTypes: DatasourceEntries,
): DatasourceEntries => {
  return {
    items: postTypes.items.filter((item) =>
      ['blog', 'videos', 'podcasts'].includes(item.name),
    ),
    total: 3,
  };
};
