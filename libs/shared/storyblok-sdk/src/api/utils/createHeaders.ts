export default function createHeaders(preview: boolean) {
  return {
    version: preview ? 'draft' : 'published',
  };
}
