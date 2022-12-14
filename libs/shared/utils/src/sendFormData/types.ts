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

export type ParamValues = {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type FormAndParamValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};
