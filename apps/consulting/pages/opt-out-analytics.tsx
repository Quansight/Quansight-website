import Link from 'next/link';

import { OptOutAnalytics } from '@quansight/shared/ui-components';

export const OptOutAnalyticsPage = () => (
  <div className="prose mx-auto text-[2em]">
    <OptOutAnalytics domain="quansight.com" />
    <hr />
    <p>
      To learn more about how Quansight collects data about visitors to our
      site, read our <Link href="/privacy-policy">privacy policy.</Link>
    </p>
  </div>
);

export default OptOutAnalyticsPage;
