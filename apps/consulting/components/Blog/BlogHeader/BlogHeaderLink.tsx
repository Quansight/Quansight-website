import { FC } from 'react';

import { useRouter } from 'next/router';

export const BlogHeaderLink: FC = () => {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()}>
      Click here to go back
    </button>
  );
};
