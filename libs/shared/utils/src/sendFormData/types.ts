export type SubscriberValues = {
  email: string;
};

export type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

// GCLID capture disabled for now
export type TrackingParams = {
  // gclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

export type FormAndTrackingValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  // gclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  /*
    We also include here the URL of the page where the contact form lives.
    This will allow us to use a single, common Zap for all contact forms,
    instead of having to define a separate Zap for each form.

    See https://github.com/Quansight/Quansight-website/pull/617.
  */
  form_url: string;
};
