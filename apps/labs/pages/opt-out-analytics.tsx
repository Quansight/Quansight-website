import { OptOutAnalytics } from '@quansight/shared/ui-components';

export const OptOutAnalyticsPage = () => (
  <div className="mx-auto prose">
    <OptOutAnalytics domain="labs.quansight.org" />
    <hr />
    <p>
      Quansight Labs uses Plausible for{' '}
      <a href="https://plausible.io/about">privacy-friendly analytics.</a>
    </p>
    <p>
      We do not store tracking cookies, we do not track you across site visits,
      nor across the web.
    </p>
  </div>
);

export default OptOutAnalyticsPage;
