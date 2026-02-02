import { TRichText } from '@quansight/shared/types';

export enum FormStates {
  Success = 'success',
  Failure = 'failure',
  Errors = 'errors',
  Default = 'default',
}

export enum FormSessionStorageKeys {
  Message = '#bookacallform [name=message]',
}

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
