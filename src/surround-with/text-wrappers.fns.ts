import { KnownLanguageIds } from "../common/known-language-id.type";
import { wrapperPlaceholder } from "./text-wrappers.items";

function genericWrapper(wrapper: string, selectedText: string): string {
  if (wrapper.includes(wrapperPlaceholder)) {
    return wrapper.replace(wrapperPlaceholder, selectedText);
  }

  // otherwise assume it's a tag
  return `<${wrapper}>${selectedText}</${wrapper}>`;
}

function wrapInQuotes(wrapper: string, selectedText: string): string {
  // Check if the selected text is already wrapped in quotes
  // if so, remove the quotes
  const quoteTypes = ['"', "'", "`"];
  for (const quote of quoteTypes) {
    if (selectedText.startsWith(quote) && selectedText.endsWith(quote)) {
      // remove the quotes from the selected text
      selectedText = selectedText.slice(1, -1);
      break;
    }
  }

  if (wrapper.includes(wrapperPlaceholder)) {
    return wrapper.replace(wrapperPlaceholder, selectedText);
  }

  // otherwise assume it's a string
  return `${wrapper}${selectedText.replace(
    wrapperPlaceholder,
    selectedText
  )}${wrapper}`;
}

export const textWrapperFns: {[key in KnownLanguageIds]: (wrapper: string, selectedText: string) => string} = {
  'html': genericWrapper,
  'xml': genericWrapper,
  'javascript': wrapInQuotes,
  'typescript': wrapInQuotes,
  'css': genericWrapper,
  'json': wrapInQuotes,
  'markdown': genericWrapper,
  'plaintext': wrapInQuotes,
} as const;