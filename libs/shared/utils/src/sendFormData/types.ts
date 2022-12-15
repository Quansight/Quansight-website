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
  // gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type FormAndTrackingValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  // gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};
