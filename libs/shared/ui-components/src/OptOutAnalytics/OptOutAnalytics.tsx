import { FC, useEffect, useState } from 'react';

import { Button } from '../Button/Button';
import { TOptOutAnalyticsProps } from './types';

export const OptOutAnalytics: FC<TOptOutAnalyticsProps> = (props) => {
  const { domain } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isUserOptedOut, setIsUserOptedOut] = useState(false);
  useEffect(() => {
    // When page loads, opt user out automatically - i.e., one-click opt-out.
    optOut();
    setIsLoading(false);
  }, []);

  const optOut = () => {
    localStorage.plausible_ignore = true;
    setIsUserOptedOut(true);
  };

  const optIn = () => {
    delete localStorage.plausible_ignore;
    setIsUserOptedOut(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div>
      {isUserOptedOut ? (
        <>
          <p>
            This browser is now opted <strong>out</strong> of analytics for{' '}
            <strong>{domain}</strong>.
          </p>
          <p>
            <Button type="button" onClick={optIn} title="UNDO - Opt back in" />
          </p>
        </>
      ) : (
        <>
          <p>This browser has not opted out of analytics for {domain}.</p>
          <p>
            <Button type="button" onClick={optIn} title="Opt out" />
          </p>
        </>
      )}
      <p>
        Note: opt out is <em>per browser</em>. You will need to visit this page
        with each device and each browser that you want to opt out.
      </p>
    </div>
  );
};
