import { TGetLibraryCategoriesProps } from './types';
import { validateCategoriesArray } from './utils/validateCategoriesArray';

const testData = [
  {
    name: 'hello1',
    value: 'world1',
  },
  {
    name: '',
    value: 'world2',
  },
  {
    name: 'hello3',
    value: '',
  },
  {
    name: 123,
    value: 'world4',
  },
  {
    name: 'hello5',
    value: 123,
  },
  {
    name: 'hello1',
    value: 'world6',
  },
  {
    name: 'hello7',
    value: 'world1',
  },
  {
    name: 'hello1',
    value: 'world1',
  },
  {
    value: 'world9',
  },
  {
    name: 'hello10',
  },
  {},
];

export const getLibraryCategories = ({
  localCategories,
  remoteCategories,
}: TGetLibraryCategoriesProps) => {
  const validLocalCategories = validateCategoriesArray(localCategories);
  const validRemoteCategories = validateCategoriesArray(remoteCategories);
};
