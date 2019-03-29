"use strict";



//  P A C K A G E

const CodeMirror = require("codemirror");



//  P R O G R A M

CodeMirror.commands.tabAndIndentMarkdownList = cm => {
  const ranges = cm.listSelections();
  const pos = ranges[0].head;
  const eolState = cm.getStateAfter(pos.line);
  const inList = eolState.list !== false;

  if (inList) {
    cm.execCommand("indentMore");
    return;
  }

  if (cm.options.indentWithTabs) {
    cm.execCommand("insertTab");
  } else {
    const spaces = Array(cm.options.tabSize + 1).join(" ");
    cm.replaceSelection(spaces); // eslint-disable-line padding-line-between-statements
  }
};

CodeMirror.commands.shiftTabAndUnindentMarkdownList = cm => {
  const ranges = cm.listSelections();
  const pos = ranges[0].head;
  const eolState = cm.getStateAfter(pos.line);
  const inList = eolState.list !== false;

  if (inList) {
    cm.execCommand("indentLess");
    return;
  }

  if (cm.options.indentWithTabs) {
    cm.execCommand("insertTab");
  } else {
    const spaces = Array(cm.options.tabSize + 1).join(" ");
    cm.replaceSelection(spaces); // eslint-disable-line padding-line-between-statements
  }
};
