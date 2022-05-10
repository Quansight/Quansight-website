import { TFormProps, FormValues, FormStates } from './types';

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

export const sendFormData = (
  url: string,
  data: FormValues,
): Promise<string> => {
  return new Promise<string>(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send(JSON.stringify(data));
  });
};
