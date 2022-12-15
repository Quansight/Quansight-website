import { FormAndTrackingValues, SubscriberValues } from './types';

export const sendFormData = (
  url: string,
  data: FormAndTrackingValues | SubscriberValues,
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
