import { getActiveDocument } from "./get-active-document";
import { getActiveDocumentLanguageId } from "./get-active-document-language-id";
import { getActiveEditor } from "./get-active-editor";
import { getSelectedText } from "./get-selected-text";
import { getSelection } from "./get-selection";
import { replaceSelectedText } from "./replace-selected-text";

export const editor = {
  getActiveEditor,
  getActiveDocument,
  getActiveDocumentLanguageId,
  getSelection,
  getSelectedText,
  replaceSelectedText,
} as const;