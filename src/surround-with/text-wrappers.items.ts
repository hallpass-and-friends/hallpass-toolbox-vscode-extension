import * as vscode from 'vscode';
import { KnownLanguageIds } from '../common/known-language-id.type';


export const wrapperPlaceholder = '■'; // Placeholder for the selected text in the wrapper description

const quoteWrappers: vscode.QuickPickItem[] = [
  { label: 'double-quote', description: `JavaScript double quote string :: "${wrapperPlaceholder}"`,
    detail: 'Replaces quotes if they exist.' },
  { label: 'single-quote', description: `JavaScript single quote string :: '${wrapperPlaceholder}'`,
    detail: 'Replaces quotes if they exist.' },
  { label: 'template-literal', description: `JavaScript template literal string :: \`${wrapperPlaceholder}\``,
    detail: 'Replaces quotes if they exist.' },
];    //also used for typescript

// specialized wrappers for each language
const htmlWrappers: vscode.QuickPickItem[] = [
  { label: 'div', description: `HTML div tag :: <div>${wrapperPlaceholder}</div>` },
  { label: 'span', description: `HTML span tag :: <span>${wrapperPlaceholder}</span>` },
  { label: 'p', description: `HTML paragraph tag :: <p>${wrapperPlaceholder}</p>` },
  { label: 'strong', description: `HTML strong tag :: <strong>${wrapperPlaceholder}</strong>` },
  { label: 'em', description: `HTML emphasis tag :: <em>${wrapperPlaceholder}</em>` },
];
const xmlWrappers: vscode.QuickPickItem[] = [];
const cssWrappers: vscode.QuickPickItem[] = [];
const jsonWrappers: vscode.QuickPickItem[] = [];
const markdownWrappers: vscode.QuickPickItem[] = [];

export const wrapperQuickPickItems: {[key in KnownLanguageIds]: vscode.QuickPickItem[]} = {
  html: htmlWrappers,
  xml: xmlWrappers,
  javascript: quoteWrappers,
  typescript: quoteWrappers,
  css: cssWrappers,
  json: jsonWrappers,
  markdown: markdownWrappers,
  plaintext: quoteWrappers,
} as const;


