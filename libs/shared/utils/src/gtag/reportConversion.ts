// Snippet from https://github.com/Quansight/Quansight-website/issues/404#issuecomment-1248287234

export const gtag_report_conversion = (url?: Location | undefined) => {
  const callback = function () {
    if (typeof url != 'undefined') {
      window.location = url;
    }
  };

  window.gtag('event', 'conversion', {
    send_to: `${process.env['NEXT_PUBLIC_GOOGLE_ANALYTICS']}/${process.env['NEXT_PUBLIC_CONVERSION_LABEL']}`,
    event_callback: callback,
  });
  return false;
};
