import { remarkCodeHike } from '@code-hike/mdx';
import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import slug from 'rehype-slug-custom-id';
import remarkGfm from 'remark-gfm';
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
      remarkPlugins: [
        [remarkCodeHike, { autoImport: false, theme }],
        remarkGfm,
      ],
      rehypePlugins: [[slug, { enableCustomId: true, removeAccents: true }]],
      useDynamicImport: true,
    },
  });

  if (!data.author || data.author.length == 0) {
    throw Error('You did not provide author slug');
  }

  const postAuthor = data.author.map((authorName) => {
    const foundAuthor = authors.find((author) => author.slug === authorName);
    if (!foundAuthor) {
      throw Error(`Author ${authorName} is not in the database`);
    }
    return {
      avatarSrc: foundAuthor.content.image.filename,
      fullName: `${foundAuthor.content.firstName} ${foundAuthor.content.lastName}`,
      nickName: foundAuthor.content.githubNick,
    };
  });
  const meta: TPost['meta'] = {
    ...(data as TPost['meta']),
    author: postAuthor,
  };

  return {
    content: result,
    meta,
  };
};
