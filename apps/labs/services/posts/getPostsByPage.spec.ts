import { TPost } from '../../types/storyblok/bloks/posts';
import { getPostsByPage } from './getPostsByPage';

describe('labs services', () => {
  describe('getPostsByPage', () => {
    const testCases: {
      name: string;
      input: [TPost[], number, number];
      expected: TPost[];
    }[] = [
      {
        name: 'should return proper data',
        input: [['a', 'b', 'c', 'd'], 1, 1],
        expected: ['a'],
      },
      {
        name: 'should return proper data',
        input: [['a', 'b', 'c', 'd'], 1, 2],
        expected: ['a', 'b'],
      },
      {
        name: 'should return proper data',
        input: [['a', 'b', 'c', 'd'], 2, 2],
        expected: ['c', 'd'],
      },
      {
        name: 'should return proper data',
        input: [['a', 'b', 'c', 'd'], 1, 4],
        expected: ['a', 'b', 'c', 'd'],
      },
      {
        name: 'should return proper data',
        input: [['a', 'b', 'c', 'd'], 1, 20],
        expected: ['a', 'b', 'c', 'd'],
      },
      {
        name: 'should return input array if page is not defined',
        input: [['a', 'b', 'c', 'd'], undefined, 4],
        expected: ['a', 'b', 'c', 'd'],
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = getPostsByPage(...input);
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
