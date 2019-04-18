// This file is based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/simplemde/index.d.ts,
// which is written by Scalesoft <https://github.com/Scalesoft> and licensed under the MIT license:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/// <reference types="codemirror"/>

declare namespace Meditate {
  interface AutoSaveOptions {
    enabled?: boolean;
    delay?: number;
    uniqueId: string;
  }

  interface BlockStyleOptions {
    bold?: string;
    code?: string;
    italic?: string;
  }

  interface InsertTextOptions {
    horizontalRule?: ReadonlyArray<string>;
    image?: ReadonlyArray<string>;
    link?: ReadonlyArray<string>;
    table?: ReadonlyArray<string>;
  }

  interface ParsingOptions {
    allowAtxHeaderWithoutSpace?: boolean;
    strikethrough?: boolean;
    underscoresBreakWords?: boolean;
  }

  interface RenderingOptions {
    singleLineBreaks?: boolean;
    codeSyntaxHighlighting: boolean;
  }

  interface Shortcuts {
    [action: string]: string | undefined | null;

    toggleBlockquote?: string | null;
    toggleBold?: string | null;
    cleanBlock?: string | null;
    toggleHeadingSmaller?: string | null;
    toggleItalic?: string | null;
    drawLink?: string | null;
    toggleUnorderedList?: string | null;
    togglePreview?: string | null;
    toggleCodeBlock?: string | null;
    drawImage?: string | null;
    toggleOrderedList?: string | null;
    toggleHeadingBigger?: string | null;
    toggleSideBySide?: string | null;
    toggleFullScreen?: string | null;
  }

  interface StatusBarItem {
    className: string;
    defaultValue: (element: HTMLElement) => void;
    onUpdate: (element: HTMLElement) => void;
  }

  interface ToolbarIcon {
    name: string;
    action: string | ((editor: Meditate) => void);
    className: string;
    title: string;
    noDisable?: boolean;
    noMobile?: boolean;
  }

  interface Options {
    autoDownloadFontAwesome?: boolean;
    autofocus?: boolean;
    autosave?: AutoSaveOptions;
    blockStyles?: BlockStyleOptions;
    element?: HTMLElement;
    forceSync?: boolean;
    hideIcons?: ReadonlyArray<string>;
    indentWithTabs?: boolean;
    initialValue?: string;
    insertTexts?: InsertTextOptions;
    lineWrapping?: boolean;
    parsingConfig?: ParsingOptions;
    placeholder?: string;
    previewRender?: (markdownPlaintext: string, previewElement: HTMLElement) => string;
    promptURLs?: boolean;
    renderingConfig?: RenderingOptions;
    shortcuts?: Shortcuts;
    showIcons?: ReadonlyArray<string>;
    spellChecker?: boolean;
    status?: boolean | ReadonlyArray<string | StatusBarItem>;
    styleSelectedText?: boolean;
    tabSize?: number;
    toolbar?: boolean | ReadonlyArray<string | ToolbarIcon>;
    toolbarTips?: boolean;
    onToggleFullScreen?: (goingIntoFullScreen: boolean) => void;
    theme?: string;
  }
}

declare class Meditate {
  constructor(options?: Meditate.Options);

  value(): string;
  value(val: string): void;

  codemirror: CodeMirror.Editor;

  toTextArea(): void;
  isPreviewActive(): boolean;
  isSideBySideActive(): boolean;
  isFullscreenActive(): boolean;
  clearAutosavedValue(): void;

  static toggleBold: (editor: Meditate) => void;
  static toggleItalic: (editor: Meditate) => void;
  static toggleStrikethrough: (editor: Meditate) => void;
  static toggleHeadingSmaller: (editor: Meditate) => void;
  static toggleHeadingBigger: (editor: Meditate) => void;
  static toggleHeading1: (editor: Meditate) => void;
  static toggleHeading2: (editor: Meditate) => void;
  static toggleHeading3: (editor: Meditate) => void;
  static toggleCodeBlock: (editor: Meditate) => void;
  static toggleBlockquote: (editor: Meditate) => void;
  static toggleUnorderedList: (editor: Meditate) => void;
  static toggleOrderedList: (editor: Meditate) => void;
  static cleanBlock: (editor: Meditate) => void;
  static drawLink: (editor: Meditate) => void;
  static drawImage: (editor: Meditate) => void;
  static drawTable: (editor: Meditate) => void;
  static drawHorizontalRule: (editor: Meditate) => void;
  static togglePreview: (editor: Meditate) => void;
  static toggleSideBySide: (editor: Meditate) => void;
  static toggleFullScreen: (editor: Meditate) => void;
  static undo: (editor: Meditate) => void;
  static redo: (editor: Meditate) => void;
}

export as namespace Meditate;
export = Meditate;
