import { FC } from 'react';

export type TQconsultingProps = {
  title: string;
  description: string;
};

export const Qconsulting: FC<TQconsultingProps> = ({ title, description }) => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <div></div>
    </section>
  );
};
