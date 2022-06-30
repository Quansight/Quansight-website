import { remarkCodeHike } from '@code-hike/mdx';
import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import slug from 'rehype-slug-custom-id';
import theme from 'shiki/themes/solarized-dark.json';

import { ArrayElementType } from '@quansight/shared/types';

import { TeamQuery } from '../../api';
import { TPost } from '../../types/storyblok/bloks/posts';
import { getFileContent } from '../api/posts/getFileContent';

export const serializePost = async (
  fileName: string,
  authors: Array<ArrayElementType<TeamQuery['PersonItems']['items']>> = [],
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
      rehypePlugins: [[slug, { enableCustomId: true, removeAccents: true }]],
      useDynamicImport: true,
    },
  });

  if (!data.author) {
    throw Error('You did not provide author slug');
  }

  const postAuthor = authors.find((author) => author.slug === data.author);

  if (!postAuthor) {
    throw Error('There is not matching author in database');
  }

  const meta: TPost['meta'] = {
    ...(data as TPost['meta']),
    author: {
      avatarSrc: postAuthor.content.image.filename,
      fullName: `${postAuthor.content.firstName} ${postAuthor.content.lastName}`,
      nickName: postAuthor.content.githubNick,
    },
  };

  return {
    content: result,
    meta,
  };
};
