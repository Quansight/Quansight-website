import { remarkCodeHike } from '@code-hike/mdx';
import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import theme from 'shiki/themes/solarized-dark.json';

import { TPost } from '../../types/storyblok/bloks/posts';
import { getFileContent } from '../api/posts/getFileContent';

export const serializePost = async (
  fileName: string,
): Promise<{
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  meta: TPost['meta'];
}> => {
  const fileContent = getFileContent(fileName);
  const { data, content } = matter(fileContent);
  const result = await serialize(content, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [[remarkCodeHike, { autoImport: false, theme }]],
      useDynamicImport: true,
    },
  });
  return {
    content: result,
    meta: data as TPost['meta'],
  };
};
