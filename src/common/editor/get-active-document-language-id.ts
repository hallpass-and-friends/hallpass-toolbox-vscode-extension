import { getActiveDocument } from "./get-active-document";

export function getActiveDocumentLanguageId(): string | undefined {
    const document = getActiveDocument();
    return document ? document.languageId : undefined;
}