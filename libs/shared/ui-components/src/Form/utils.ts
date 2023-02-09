import { TrackingParams } from '@quansight/shared/utils';

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

/**
 * Retrieves any GCLID & UTM parameters saved to sessionStorage.
 * GCLID capture disabled for now.
 *
 * @returns {TrackingParams} - Encapsulated GCLID/UTM parameters
 */
export const getTrackingParams = (): TrackingParams => {
  const params: TrackingParams = {
    // gclid: sessionStorage.getItem('gclid') || undefined,
    utm_campaign: sessionStorage.getItem('utm_campaign') || '',
    utm_content: sessionStorage.getItem('utm_content') || '',
    utm_medium: sessionStorage.getItem('utm_medium') || '',
    utm_source: sessionStorage.getItem('utm_source') || '',
    utm_term: sessionStorage.getItem('utm_term') || '',
  };
  return params;
};
