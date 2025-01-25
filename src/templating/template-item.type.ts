import { Nullable } from "../common/nullable";

export type TemplateField = {
  id: string;
  label: string;
  hint?: Nullable<string>;
  default?: Nullable<string>;
}

export type TemplateItem = {
  id: string;
  label: string;
  detail: string;
  path: string;
  fields?: TemplateField[];
}