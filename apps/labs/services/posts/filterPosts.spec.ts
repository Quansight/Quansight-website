import { TPost } from '../../types/storyblok/bloks/posts';
import { filterPosts } from './filterPosts';

describe('labs services', () => {
  describe('filterPosts', () => {
    const testCases: {
      name: string;
      input: [TPost[], string];
      expected: TPost[];
    }[] = [
      {
        name: 'should return input posts if category and page is not defined',
        input: [
          [
            {
              slug: 'test-1',
              meta: {
                category: ['testCategory'],
                title: 'sss',
                author: {
                  nickName: 'asd',
                  fullName: 'fsfds',
                },
              },
              content: 'fdfdsfgfdg',
            },
          ],
          undefined,
        ],
        expected: [
          {
            slug: 'test-1',
            meta: {
              category: ['testCategory'],
              title: 'sss',
              author: {
                nickName: 'asd',
                fullName: 'fsfds',
              },
            },
            content: 'fdfdsfgfdg',
          },
        ],
      },
      {
        name: 'should return empty array if categories do not match to each other',
        input: [
          [
            {
              slug: 'test-1',
              meta: {
                category: ['testCategory'],
                title: 'sss',
                author: {
                  nickName: 'asd',
                  fullName: 'fsfds',
                },
              },
              content: 'fdfdsfgfdg',
            },
          ],
          'test',
        ],
        expected: [],
      },
      {
        name: 'should return posts which match to the provided category',
        input: [
          [
            {
              slug: 'test-1',
              meta: {
                category: ['testCategory'],
                title: 'sss',
                author: {
                  nickName: 'asd',
                  fullName: 'fsfds',
                },
              },
              content: 'fdfdsfgfdg',
            },
            {
              slug: 'test-2',
              meta: {
                category: ['testCategory-asd'],
                title: 'sss',
                author: {
                  nickName: 'asd',
                  fullName: 'fsfds',
                },
              },
              content: 'fdfdsfgfdg',
            },
          ],
          'testCategory',
        ],
        expected: [
          {
            slug: 'test-1',
            meta: {
              category: ['testCategory'],
              title: 'sss',
              author: {
                nickName: 'asd',
                fullName: 'fsfds',
              },
            },
            content: 'fdfdsfgfdg',
          },
        ],
      },
      {
        name: 'should not return posts that do not have any categories added',
        input: [
          [
            {
              slug: 'test-1',
              meta: {
                title: 'sss',
                author: {
                  nickName: 'asd',
                  fullName: 'fsfds',
                },
              },
              content: 'fdfdsfgfdg',
            },
            {
              slug: 'test-2',
              meta: {
                category: ['testCategory-asd'],
                title: 'sss',
                author: {
                  nickName: 'asd',
                  fullName: 'fsfds',
                },
              },
              content: 'fdfdsfgfdg',
            },
          ],
          'testCategory-asd',
        ],
        expected: [
          {
            slug: 'test-2',
            meta: {
              category: ['testCategory-asd'],
              title: 'sss',
              author: {
                nickName: 'asd',
                fullName: 'fsfds',
              },
            },
            content: 'fdfdsfgfdg',
          },
        ],
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = filterPosts(...input);
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
