export type TLinkProps = {
  id: number,
  url: string
  linktype: 'url',
  fieldtype: 'multilink',
  cashed_url?: string
}

export type TButtonLinkProps = {
  isBordered?: boolean,
  isTriangle?: boolean,
  color: string,
  text: string,
  link: TLinkProps
}
