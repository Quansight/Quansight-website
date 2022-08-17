// Event code
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'AW-722597110');

// Conversion reporting code
export function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof url != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
    send_to: 'AW-722597110/TEbJCM3O4LQBEPbpx9gC',
    event_callback: callback,
  });
  return false;
}
