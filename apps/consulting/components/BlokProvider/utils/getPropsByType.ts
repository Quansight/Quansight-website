import { ComponentType, TBlokComponentProps, TConsultingBlok } from '../types';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getFeatureProps } from '../mappers/getFeatureProps';
import { getQconsultingProps } from '../mappers/getQconsultingProps';
import { getQconsultingItemProps } from '../mappers/getQconsultingItemProps';
import { getQconsultingBtnProps } from '../mappers/getQconsultingBtnProps';
import { getQconsultingParagraphProps } from '../mappers/getQconsultingParagraphProps';
import { TTeaserProps } from '../../Teaser/Teaser';
import { TFeatureProps } from '../../Feature/Feature';
import { TQconsultingProps } from '../../Qconsulting/Qconsulting';
import { TQconsultingItemProps } from '../../QconsultingItem/QconsultingItem';
import { TQconsultingBtnProps } from '../../QconsultingBtn/QconsultingBtn';
import { TQconsultingParagraphProps } from '../../QconsultingParagraph/QconsultingParagraph';

export const getPropsByType = (blok: TConsultingBlok): TBlokComponentProps => {
  return (
    {
      [ComponentType.Teaser]: getTeaserProps(
        blok as TConsultingBlok<TTeaserProps>,
      ),
      [ComponentType.Feature]: getFeatureProps(
        blok as TConsultingBlok<TFeatureProps>,
      ),
      [ComponentType.Qconsulting]: getQconsultingProps(
        blok as TConsultingBlok<TQconsultingProps>,
      ),
      [ComponentType.QconsultingItem]: getQconsultingItemProps(
        blok as TConsultingBlok<TQconsultingItemProps>,
      ),
      [ComponentType.QconsultingBtn]: getQconsultingBtnProps(
        blok as TConsultingBlok<TQconsultingBtnProps>,
      ),
      [ComponentType.QconsultingParagraph]: getQconsultingParagraphProps(
        blok as TConsultingBlok<TQconsultingParagraphProps>,
      ),
    }[blok.component] || null
  );
};
