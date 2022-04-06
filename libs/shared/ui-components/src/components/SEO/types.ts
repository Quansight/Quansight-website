export enum DomainVariant {
  Quansight = 'Quansight',
  Labs = 'Labs',
}

export type TSEOProps = {
  title: string;
  description: string;
  variant: DomainVariant;
};
