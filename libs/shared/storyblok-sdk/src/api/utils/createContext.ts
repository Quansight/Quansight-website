export default function createContext(preview: boolean) {
  return {
    headers: {
      version: preview ? 'draft' : 'published',
    },
  };
}
