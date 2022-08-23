import { Api } from '@quansight/shared/storyblok-sdk';

import { DatasourceEntries } from '../types/basic';
import { DatasourceEntriesDocument } from '../types/hooks';
import {
  DatasourceEntriesQuery,
  DatasourceEntriesQueryVariables,
} from '../types/operations';

export const getDataSourceEntries = async (
  variables: DatasourceEntriesQueryVariables,
  preview: boolean,
): Promise<DatasourceEntries> => {
  const { data } = await Api.getDataSourceEntries<
    DatasourceEntriesQuery,
    DatasourceEntriesQueryVariables
  >(DatasourceEntriesDocument, variables, preview);
  return data.DatasourceEntries;
};
