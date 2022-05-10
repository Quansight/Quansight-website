import { TRichText } from '@quansight/shared/types';

export type FormStates = 'success' | 'failure' | 'errors' | 'default';

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

export type TFormSuccessProps = {
  thanksMessage: TRichText;
};

export type TFormProps = {
  hookUrl: string;
  errorMessage: string;
  failureMessage: string;
} & TFormHeaderProps &
  TFormImageProps &
  TFormSuccessProps;

export default TFormProps;
