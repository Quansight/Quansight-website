const Preview = (req, res) => {
  res.setPreviewData({});
  res.writeHead(307, { Location: '/' });
  res.end();
};

export default Preview;
