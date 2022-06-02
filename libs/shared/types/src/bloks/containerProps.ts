export type TContainerProps<PageItem, HeaderItem, FooterItem> = {
  data: PageItem;
  footer: FooterItem;
  header: HeaderItem;
  preview: boolean;
};
