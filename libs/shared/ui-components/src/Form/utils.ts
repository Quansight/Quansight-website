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
    utm_campaign: sessionStorage.getItem('utm_campaign') || undefined,
    utm_content: sessionStorage.getItem('utm_content') || undefined,
    utm_medium: sessionStorage.getItem('utm_medium') || undefined,
    utm_source: sessionStorage.getItem('utm_source') || undefined,
    utm_term: sessionStorage.getItem('utm_term') || undefined,
  };
  return params;
};

/**
 * Compiles form data and GCLID/UTM data to a common object.
 * GCLID capture disabled for now.
 *
 * @param formValues {FormValues} - User entered contact form data
 * @param paramValues {ParamValues} - GCLID/UTM parameters retrieved from sessionStorage
 * @returns {FormAndParamValues} - Agglomerated form & GCLID/UTM data
 */
// export const combineFormTrackingValues = (
//   formValues: FormValues,
//   paramValues: ParamValues,
// ): FormAndParamValues => {
//   const fpvals: FormAndParamValues = {
//     name: formValues.name,
//     email: formValues.email,
//     phone: formValues.phone,
//     company: formValues.company,
//     message: formValues.message,
//     // gclid: paramValues.gclid,
//     utm_campaign: paramValues.utm_campaign,
//     utm_content: paramValues.utm_content,
//     utm_medium: paramValues.utm_medium,
//     utm_source: paramValues.utm_source,
//     utm_term: paramValues.utm_term,
//   };

//   return fpvals;
// };
