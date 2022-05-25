import { TPost } from '../../types/storyblok/bloks/posts';
import { sortPostsByDate } from './sortPostsByDate';

describe('posts services', () => {
  describe('sortPostsByDate', () => {
    it('should return properly sorted array of items', () => {
      const list: TPost[] = [
        {
          meta: {
            published: 'October 13, 2022',
          },
        },
        {
          meta: {
            published: 'October 14, 2022',
          },
        },
        {
          meta: {
            published: 'October 11, 2022',
          },
        },
      ];

      const result = sortPostsByDate(list);

      expect(result).toStrictEqual([
        {
          meta: {
            published: 'October 14, 2022',
          },
        },
        {
          meta: {
            published: 'October 13, 2022',
          },
        },
        {
          meta: {
            published: 'October 11, 2022',
          },
        },
      ]);
    });
  });
});
