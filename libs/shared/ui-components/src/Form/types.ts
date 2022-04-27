import { TRichText } from '@quansight/shared/types';

export type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export type TFormHeaderProps = {
  title: string;
};

export type TFormImageProps = {
  imageSrc: string;
  imageAlt: string;
};

export type TFormProps = {
  hookUrl: string;
  errorMessage: string;
  thanksMessage: TRichText;
} & TFormHeaderProps &
  TFormImageProps;

export default TFormProps;
