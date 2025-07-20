import { getActiveDocument } from "./get-active-document";
import { getActiveDocumentLanguageId } from "./get-active-document-language-id";
import { getActiveEditor } from "./get-active-editor";
import { getSelectedText } from "./get-selected-text";

export const editor = {
  getActiveEditor,
  getActiveDocument,
  getActiveDocumentLanguageId,
  getSelectedText,
} as const;