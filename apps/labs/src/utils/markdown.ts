import { marked } from 'marked';

export const md = (text: string): { __html: string } => ({
  __html: marked.parse(text) as string,
});
