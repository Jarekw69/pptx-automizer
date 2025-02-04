import { XmlElement } from './xml-types';

export type ModifyCallback = {
  (element: XmlElement);
};
export type ModifyCollectionCallback = {
  (collection: HTMLCollectionOf<XmlElement>);
};
/**
 * A Modification is applied to xml elements by ModificationTags.
 * Specify an index if not 0 and put one or more ModifyCallbacks to
 * 'modify' prop.
 */
export type Modification = {
  index?: number;
  last?: boolean;
  collection?: ModifyCollectionCallback;
  children?: ModificationTags;
  modify?: ModifyCallback | ModifyCallback[];
  create?: any;
  isRequired?: boolean;
  fromPrevious?: boolean;
  forceCreate?: boolean;
};
/**
 * ModificationTags will specify the target xml tags for your
 * modifications. ModificationTags can be nested by using 'children'.
 */
export type ModificationTags = {
  [tag: string]: Modification;
};
export type Color = {
  type?: 'schemeClr' | 'srgbClr';
  value: string;
};

export type TextStyle = {
  size?: number;
  color?: Color;
  isBold?: boolean;
  isItalics?: boolean;
};
export type ReplaceText = {
  replace: string;
  by: ReplaceTextReplacement | ReplaceTextReplacement[];
};
export type ReplaceTextReplacement = {
  text: string;
  style?: TextStyle;
};
export type ReplaceTextOptions = {
  openingTag: string;
  closingTag: string;
};
