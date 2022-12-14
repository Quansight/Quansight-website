import {
  FormValues,
  FormAndParamValues,
  ParamValues,
} from '@quansight/shared/utils';

import { TFormProps, FormStates } from './types';

export const getFormHeader = (props: TFormProps, state: FormStates): string => {
  const { failureMessage, errorMessage, title } = props;

  switch (state) {
    case FormStates.Failure:
      return failureMessage;
    case FormStates.Errors:
      return errorMessage;
    default:
      return title;
  }
};

export const getParamValues = (): ParamValues => {
  const params: ParamValues = {};

  params.gclid = sessionStorage.getItem('gclid') || undefined;
  params.utm_campaign = sessionStorage.getItem('utm_campaign') || undefined;
  params.utm_content = sessionStorage.getItem('utm_content') || undefined;
  params.utm_medium = sessionStorage.getItem('utm_medium') || undefined;
  params.utm_source = sessionStorage.getItem('utm_source') || undefined;
  params.utm_term = sessionStorage.getItem('utm_term') || undefined;

  return params;
};

export const combineFormParamValues = (
  formValues: FormValues,
  paramValues: ParamValues,
): FormAndParamValues => {
  const fpvals: FormAndParamValues = {
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone,
    company: formValues.company,
    message: formValues.message,
    gclid: paramValues.gclid,
    utm_campaign: paramValues.utm_campaign,
    utm_content: paramValues.utm_content,
    utm_medium: paramValues.utm_medium,
    utm_source: paramValues.utm_source,
    utm_term: paramValues.utm_term,
  };

  return fpvals;
};
