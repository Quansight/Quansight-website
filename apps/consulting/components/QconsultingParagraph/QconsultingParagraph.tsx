import { FC } from 'react';

export type TQconsultingParagraphProps = {
  text: string;
};

export const QconsultingParagraph: FC<TQconsultingParagraphProps> = ({
  text,
}) => {
  return <p className="text-[1.8rem] leading-[2.2rem]">{text}</p>;
};
