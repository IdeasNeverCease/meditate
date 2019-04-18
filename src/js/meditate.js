"use strict"; /* global module, require */



const CodeMirror = require("codemirror");

require("codemirror/addon/edit/continuelist.js");
require("./codemirror/tablist");
require("codemirror/addon/display/fullscreen.js");
require("codemirror/mode/markdown/markdown.js");
require("codemirror/addon/mode/overlay.js");
require("codemirror/addon/display/placeholder.js");
require("codemirror/addon/selection/mark-selection.js");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/mode/gfm/gfm.js");
require("codemirror/mode/xml/xml.js");

const CodeMirrorSpellChecker = require("codemirror-spell-checker");
const marked = require("marked");

const anchorToExternalRegex = new RegExp(/(<a.*?https?:\/\/.*?[^a]>)+?/g);
const isMac = /Mac/.test(navigator.platform);

// Mapping of actions that can be bound to keyboard shortcuts or toolbar buttons
const bindings = {
  toggleBold: toggleBold,
  toggleItalic: toggleItalic,
  drawLink: drawLink,
  toggleHeadingSmaller: toggleHeadingSmaller,
  toggleHeadingBigger: toggleHeadingBigger,
  drawImage: drawImage,
  toggleBlockquote: toggleBlockquote,
  toggleOrderedList: toggleOrderedList,
  toggleUnorderedList: toggleUnorderedList,
  toggleCodeBlock: toggleCodeBlock,
  togglePreview: togglePreview,
  toggleStrikethrough: toggleStrikethrough,
  toggleHeading1: toggleHeading1,
  toggleHeading2: toggleHeading2,
  toggleHeading3: toggleHeading3,
  cleanBlock: cleanBlock,
  drawTable: drawTable,
  drawHorizontalRule: drawHorizontalRule,
  undo: undo,
  redo: redo,
  toggleSideBySide: toggleSideBySide,
  toggleFullScreen: toggleFullScreen
};

const shortcuts = {
  toggleBold: "Cmd-B",
  toggleItalic: "Cmd-I",
  drawLink: "Cmd-K",
  toggleHeadingSmaller: "Cmd-H",
  toggleHeadingBigger: "Shift-Cmd-H",
  cleanBlock: "Cmd-E",
  drawImage: "Cmd-Alt-I",
  toggleBlockquote: "Cmd-'",
  toggleOrderedList: "Cmd-Alt-L",
  toggleUnorderedList: "Cmd-L",
  toggleCodeBlock: "Cmd-Alt-C",
  togglePreview: "Cmd-P",
  toggleSideBySide: "F9",
  toggleFullScreen: "F11"
};

const getBindingName = function(f) {
  for (const key in bindings) {
    if (bindings[key] === f)
      return key;
  }

  return null;
};

const isMobile = function() {
  let check = false;

  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))
    ) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
};

// Saved overflow setting
let saved_overflow = "";



/**
 * Modify HTML to add 'target="_blank"' to links so they open in new tabs by default.
 * @param {string} htmlText - HTML to be modified.
 * @return {string} The modified HTML text.
 */
function addAnchorTargetBlank(htmlText) {
  let match;

  while ((match = anchorToExternalRegex.exec(htmlText)) !== null) {
    // With only one capture group in the RegExp, we can safely take the first index from the match.
    const linkString = match[0];

    if (linkString.indexOf("target=") === -1) {
      const fixedLinkString = linkString.replace(/>$/, " target=\"_blank\">");
      htmlText = htmlText.replace(linkString, fixedLinkString); // eslint-disable-line padding-line-between-statements
    }
  }

  return htmlText;
}


/**
 * Fix shortcut. Mac use Command, others use Ctrl.
 */
function fixShortcut(name) {
  if (isMac)
    name = name.replace("Ctrl", "Cmd");
  else
    name = name.replace("Cmd", "Ctrl");

  return name;
}


/**
 * Create button element for toolbar.
 */
function createToolbarButton(options, enableTooltips, shortcuts) {
  options = options || {};
  const el = document.createElement("button");

  el.className = options.name;
  el.setAttribute("type", "button");
  enableTooltips = (enableTooltips === undefined) ? true : enableTooltips;

  if (options.title && enableTooltips) {
    el.title = createTooltip(options.title, options.action, shortcuts);

    if (isMac) {
      el.title = el.title.replace("Ctrl", "⌘");
      el.title = el.title.replace("Alt", "⌥");
    }
  }

  if (options.noDisable)
    el.classList.add("no-disable");

  if (options.noMobile)
    el.classList.add("no-mobile");

  // Provide backwards compatibility with simple-markdown-editor by adding custom classes to the button.
  const classNameParts = options.className.split(" ");
  const iconClasses = [];

  for (let classNameIndex = 0; classNameIndex < classNameParts.length; classNameIndex++) {
    const classNamePart = classNameParts[classNameIndex];

    // Split icon classes from the button.
    // Regex will detect "fa", "fas", "fa-something" and "fa-some-icon-1", but not "fanfare".
    if (classNamePart.match(/^fa([srlb]|(-[\w-]*)|$)/))
      iconClasses.push(classNamePart);
    else
      el.classList.add(classNamePart);
  }

  el.tabIndex = -1;

  // Create icon element and append as a child to the button
  const icon = document.createElement("i");

  for (let iconClassIndex = 0; iconClassIndex < iconClasses.length; iconClassIndex++) {
    const iconClass = iconClasses[iconClassIndex];
    icon.classList.add(iconClass); // eslint-disable-line padding-line-between-statements
  }

  el.appendChild(icon);
  return el;
}

function createSep() {
  const el = document.createElement("i");

  el.className = "separator";
  el.innerHTML = "|";

  return el;
}

function createTooltip(title, action, shortcuts) {
  let actionName;
  let tooltip = title;

  if (action) {
    actionName = getBindingName(action);

    if (shortcuts[actionName])
      tooltip += " (" + fixShortcut(shortcuts[actionName]) + ")";
  }

  return tooltip;
}

/**
 * The state of CodeMirror at the given position.
 */
function getState(cm, pos) {
  pos = pos || cm.getCursor("start");
  const stat = cm.getTokenAt(pos);

  if (!stat.type)
    return {};

  const types = stat.type.split(" ");
  const ret = {};
  let data;
  let text;

  for (let i = 0; i < types.length; i++) {
    data = types[i];

    switch(true) {
      case data === "strong":
        ret.bold = true;
        break;

      case data === "variable-2":
        text = cm.getLine(pos.line);

        if (/^\s*\d+\.\s/.test(text))
          ret["ordered-list"] = true;
        else
          ret["unordered-list"] = true;

        break;

      case data === "atom":
        ret.quote = true;
        break;

      case data === "em":
        ret.italic = true;
        break;

      case data === "quote":
        ret.quote = true;
        break;

      case data === "strikethrough":
        ret.strikethrough = true;
        break;

      case data === "comment":
        ret.code = true;
        break;

      case data === "link":
        ret.link = true;
        break;

      case data === "tag":
        ret.image = true;
        break;

      case data.match(/^header(-[1-6])?$/):
        ret[data.replace("header", "heading")] = true;
        break;

      default:
        break;
    }
  }

  return ret;
}

/**
 * Toggle full screen of the editor.
 */
function toggleFullScreen(editor) {
  // Set fullscreen
  const cm = editor.codemirror;

  cm.setOption("fullScreen", !cm.getOption("fullScreen"));

  // Prevent scrolling on body during fullscreen active
  if (cm.getOption("fullScreen")) {
    saved_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = saved_overflow;
  }

  // Update toolbar class
  const wrap = cm.getWrapperElement();

  if (!/fullscreen/.test(wrap.previousSibling.className))
    wrap.previousSibling.className += " fullscreen";
  else
    wrap.previousSibling.className = wrap.previousSibling.className.replace(/\s*fullscreen\b/, "");

  // Update toolbar button
  if (editor.toolbarElements && editor.toolbarElements.fullscreen) {
    const toolbarButton = editor.toolbarElements.fullscreen;

    if (!/active/.test(toolbarButton.className))
      toolbarButton.className += " active";
    else
      toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
  }

  // Hide side by side if needed
  const sidebyside = cm.getWrapperElement().nextSibling;

  if (/editor-preview-active-side/.test(sidebyside.className))
    toggleSideBySide(editor);

  if (editor.options.onToggleFullScreen)
    editor.options.onToggleFullScreen(cm.getOption("fullScreen") || false);
}

/**
 * Action for toggling bold.
 */
function toggleBold(editor) {
  _toggleBlock(editor, "bold", editor.options.blockStyles.bold);
}

/**
 * Action for toggling italic.
 */
function toggleItalic(editor) {
  _toggleBlock(editor, "italic", editor.options.blockStyles.italic);
}

/**
 * Action for toggling strikethrough.
 */
function toggleStrikethrough(editor) {
  _toggleBlock(editor, "strikethrough", "~~");
}

/**
 * Action for toggling code block.
 */
function toggleCodeBlock(editor) {
  const fenceCharsToInsert = editor.options.blockStyles.code;

  function fencing_line(line) {
    /* return true, if this is a ``` or ~~~ line */
    if (typeof line !== "object")
      throw "fencing_line() takes a 'line' object (not a line number, or line text).  Got: " + typeof line + ": " + line;

    return line.styles && line.styles[2] && line.styles[2].indexOf("formatting-code-block") !== -1;
  }

  function token_state(token) {
    // base goes an extra level deep when mode backdrops are used, e.g. spellchecker on
    return token.state.base.base || token.state.base;
  }

  function code_type(cm, line_num, line, firstTok, lastTok) {
    /*
     * Return "single", "indented", "fenced" or false
     *
     * cm and line_num are required.  Others are optional for efficiency
     *   To check in the middle of a line, pass in firstTok yourself.
     */
    line = line || cm.getLineHandle(line_num);

    firstTok = firstTok || cm.getTokenAt({
      line: line_num,
      ch: 1
    });

    lastTok = lastTok || (!!line.text && cm.getTokenAt({
      line: line_num,
      ch: line.text.length - 1
    }));

    const types = firstTok.type ? firstTok.type.split(" ") : [];

    if (lastTok && token_state(lastTok).indentedCode) {
      // have to check last char, since first chars of first line are not marked as indented
      return "indented";
    } else if (types.indexOf("comment") === -1) {
      // has to be after "indented" check, since first chars of first indented line are not marked as such
      return false;
    } else if (token_state(firstTok).fencedChars || token_state(lastTok).fencedChars || fencing_line(line)) {
      return "fenced";
    } else {
      return "single";
    }
  }

  function insertFencingAtSelection(cm, cur_start, cur_end, fenceCharsToInsert) {
    const start_line_sel = cur_start.line + 1;
    let end_line_sel = cur_end.line + 1;
    const sel_multi = cur_start.line !== cur_end.line;
    const repl_start = fenceCharsToInsert + "\n";
    let repl_end = "\n" + fenceCharsToInsert;

    if (sel_multi)
      end_line_sel++;

    // handle last char including \n or not
    if (sel_multi && cur_end.ch === 0) {
      repl_end = fenceCharsToInsert + "\n";
      end_line_sel--;
    }

    _replaceSelection(cm, false, [repl_start, repl_end]);

    cm.setSelection(
      {
        line: start_line_sel,
        ch: 0
      }, {
        line: end_line_sel,
        ch: 0
      }
    );
  }

  const cm = editor.codemirror;
  const cur_start = cm.getCursor("start");
  const cur_end = cm.getCursor("end");

  const tok = cm.getTokenAt({
    line: cur_start.line,
    ch: cur_start.ch || 1
  }); // avoid ch 0 which is a cursor pos but not token

  let line = cm.getLineHandle(cur_start.line);
  const is_code = code_type(cm, cur_start.line, line, tok);
  let block_end;
  let block_start;
  let lineCount;

  if (is_code === "single") {
    // similar to some Meditate _toggleBlock logic
    const start = line.text.slice(0, cur_start.ch).replace("`", "");
    const end = line.text.slice(cur_start.ch).replace("`", "");

    cm.replaceRange(start + end, {
      line: cur_start.line,
      ch: 0
    }, {
      line: cur_start.line,
      ch: 99999999999999
    });

    cur_start.ch--;

    if (cur_start !== cur_end)
      cur_end.ch--;

    cm.setSelection(cur_start, cur_end);
    cm.focus();
  } else if (is_code === "fenced") {
    if (cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch) {
      // use selection

      // find the fenced line so we know what type it is (tilde, backticks, number of them)
      for (block_start = cur_start.line; block_start >= 0; block_start--) {
        line = cm.getLineHandle(block_start);

        if (fencing_line(line))
          break;
      }

      const fencedTok = cm.getTokenAt({
        line: block_start,
        ch: 1
      });

      const fence_chars = token_state(fencedTok).fencedChars;
      let start_line;
      let start_text;
      let end_line;
      let end_text;

      // check for selection going up against fenced lines, in which case we do not want to add more fencing
      if (fencing_line(cm.getLineHandle(cur_start.line))) {
        start_text = "";
        start_line = cur_start.line;
      } else if (fencing_line(cm.getLineHandle(cur_start.line - 1))) {
        start_text = "";
        start_line = cur_start.line - 1;
      } else {
        start_text = fence_chars + "\n";
        start_line = cur_start.line;
      }

      if (fencing_line(cm.getLineHandle(cur_end.line))) {
        end_text = "";
        end_line = cur_end.line;

        if (cur_end.ch === 0)
          end_line += 1;
      } else if (cur_end.ch !== 0 && fencing_line(cm.getLineHandle(cur_end.line + 1))) {
        end_text = "";
        end_line = cur_end.line + 1;
      } else {
        end_text = fence_chars + "\n";
        end_line = cur_end.line + 1;
      }

      // full last line selected, putting cursor at beginning of next
      if (cur_end.ch === 0)
        end_line -= 1;

      cm.operation(function() {
        // end line first, so that line numbers do not change
        cm.replaceRange(end_text, {
          line: end_line,
          ch: 0
        }, {
          line: end_line + (end_text ? 0 : 1),
          ch: 0
        });
        cm.replaceRange(start_text, {
          line: start_line,
          ch: 0
        }, {
          line: start_line + (start_text ? 0 : 1),
          ch: 0
        });
      });

      cm.setSelection({
        line: start_line + (start_text ? 1 : 0),
        ch: 0
      }, {
        line: end_line + (start_text ? 1 : -1),
        ch: 0
      });

      cm.focus();
    } else {
      // no selection, search for ends of this fenced block
      let search_from = cur_start.line;

      if (fencing_line(cm.getLineHandle(cur_start.line))) { // gets a little tricky if cursor is right on a fenced line
        if (code_type(cm, cur_start.line + 1) === "fenced") {
          block_start = cur_start.line;
          search_from = cur_start.line + 1; // for searching for "end"
        } else {
          block_end = cur_start.line;
          search_from = cur_start.line - 1; // for searching for "start"
        }
      }

      if (block_start === undefined) {
        for (block_start = search_from; block_start >= 0; block_start--) {
          line = cm.getLineHandle(block_start);

          if (fencing_line(line))
            break;
        }
      }

      if (block_end === undefined) {
        lineCount = cm.lineCount();

        for (block_end = search_from; block_end < lineCount; block_end++) {
          line = cm.getLineHandle(block_end);

          if (fencing_line(line))
            break;
        }
      }

      cm.operation(function() {
        cm.replaceRange("",
          {
            line: block_start,
            ch: 0
          }, {
            line: block_start + 1,
            ch: 0
          }
        );

        cm.replaceRange("",
          {
            line: block_end - 1,
            ch: 0
          }, {
            line: block_end,
            ch: 0
          }
        );
      });

      cm.focus();
    }
  } else if (is_code === "indented") {
    if (cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch) {
      // use selection
      block_start = cur_start.line;
      block_end = cur_end.line;

      if (cur_end.ch === 0)
        block_end--;
    } else {
      // no selection, search for ends of this indented block
      for (block_start = cur_start.line; block_start >= 0; block_start--) {
        line = cm.getLineHandle(block_start);

        if (line.text.match(/^\s*$/)) {
          // empty or all whitespace - keep going
          continue;
        } else {
          if (code_type(cm, block_start, line) !== "indented") {
            block_start += 1;
            break;
          }
        }
      }

      lineCount = cm.lineCount();

      for (block_end = cur_start.line; block_end < lineCount; block_end++) {
        line = cm.getLineHandle(block_end);

        if (line.text.match(/^\s*$/)) {
          // empty or all whitespace - keep going
          continue;
        } else {
          if (code_type(cm, block_end, line) !== "indented") {
            block_end -= 1;
            break;
          }
        }
      }
    }

    // if we are going to un-indent based on a selected set of lines, and the next line is indented too, we need to
    // insert a blank line so that the next line(s) continue to be indented code
    const next_line = cm.getLineHandle(block_end + 1);

    const next_line_last_tok = next_line && cm.getTokenAt({
      line: block_end + 1,
      ch: next_line.text.length - 1
    });

    const next_line_indented = next_line_last_tok && token_state(next_line_last_tok).indentedCode;

    if (next_line_indented) {
      cm.replaceRange("\n", {
        line: block_end + 1,
        ch: 0
      });
    }

    for (let i = block_start; i <= block_end; i++)
      cm.indentLine(i, "subtract"); // TODO: this doesn't get tracked in the history, so can't be undone :(

    cm.focus();
  } else {
    // insert code formatting
    const no_sel_and_starting_of_line = (cur_start.line === cur_end.line && cur_start.ch === cur_end.ch && cur_start.ch === 0);
    const sel_multi = cur_start.line !== cur_end.line;

    if (no_sel_and_starting_of_line || sel_multi)
      insertFencingAtSelection(cm, cur_start, cur_end, fenceCharsToInsert);
    else
      _replaceSelection(cm, false, ["`", "`"]);
  }
}

/**
 * Action for toggling blockquote.
 */
function toggleBlockquote(editor) {
  const cm = editor.codemirror;
  _toggleLine(cm, "quote"); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for toggling heading size: normal -> h1 -> h2 -> h3 -> h4 -> h5 -> h6 -> normal
 */
function toggleHeadingSmaller(editor) {
  const cm = editor.codemirror;
  _toggleHeading(cm, "smaller"); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for toggling heading size: normal -> h6 -> h5 -> h4 -> h3 -> h2 -> h1 -> normal
 */
function toggleHeadingBigger(editor) {
  const cm = editor.codemirror;
  _toggleHeading(cm, "bigger"); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for toggling heading size 1
 */
function toggleHeading1(editor) {
  const cm = editor.codemirror;
  _toggleHeading(cm, undefined, 1); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for toggling heading size 2
 */
function toggleHeading2(editor) {
  const cm = editor.codemirror;
  _toggleHeading(cm, undefined, 2); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for toggling heading size 3
 */
function toggleHeading3(editor) {
  const cm = editor.codemirror;
  _toggleHeading(cm, undefined, 3); // eslint-disable-line padding-line-between-statements
}


/**
 * Action for toggling ul.
 */
function toggleUnorderedList(editor) {
  const cm = editor.codemirror;
  _toggleLine(cm, "unordered-list"); // eslint-disable-line padding-line-between-statements
}


/**
 * Action for toggling ol.
 */
function toggleOrderedList(editor) {
  const cm = editor.codemirror;
  _toggleLine(cm, "ordered-list"); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for clean block (remove headline, list, blockquote code, markers)
 */
function cleanBlock(editor) {
  const cm = editor.codemirror;
  _cleanBlock(cm); // eslint-disable-line padding-line-between-statements
}

/**
 * Action for drawing a link.
 */
function drawLink(editor) {
  const cm = editor.codemirror;
  const stat = getState(cm);
  const options = editor.options;
  let url = "https://";

  if (options.promptURLs) {
    url = prompt(options.promptTexts.link, "https://");

    if (!url)
      return false;
  }

  _replaceSelection(cm, stat.link, options.insertTexts.link, url);
}

/**
 * Action for drawing an img.
 */
function drawImage(editor) {
  const cm = editor.codemirror;
  const stat = getState(cm);
  const options = editor.options;
  let url = "https://";

  if (options.promptURLs) {
    url = prompt(options.promptTexts.image, "https://");

    if (!url)
      return false;
  }
  _replaceSelection(cm, stat.image, options.insertTexts.image, url);
}

/**
 * Action for drawing a table.
 */
function drawTable(editor) {
  const cm = editor.codemirror;
  const stat = getState(cm);
  const options = editor.options;

  _replaceSelection(cm, stat.table, options.insertTexts.table);
}

/**
 * Action for drawing a horizontal rule.
 */
function drawHorizontalRule(editor) {
  const cm = editor.codemirror;
  const stat = getState(cm);
  const options = editor.options;

  _replaceSelection(cm, stat.image, options.insertTexts.horizontalRule);
}


/**
 * Undo action.
 */
function undo(editor) {
  const cm = editor.codemirror;

  cm.undo();
  cm.focus();
}


/**
 * Redo action.
 */
function redo(editor) {
  const cm = editor.codemirror;

  cm.redo();
  cm.focus();
}


/**
 * Toggle side by side preview
 */
function toggleSideBySide(editor) {
  const cm = editor.codemirror;
  const wrapper = cm.getWrapperElement();
  const preview = wrapper.nextSibling;
  const toolbarButton = editor.toolbarElements && editor.toolbarElements["side-by-side"];
  let useSideBySideListener = false;

  if (/editor-preview-active-side/.test(preview.className)) {
    preview.className = preview.className.replace(
      /\s*editor-preview-active-side\s*/g, ""
    );

    if (toolbarButton)
      toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");

    wrapper.className = wrapper.className.replace(/\s*CodeMirror-sided\s*/g, " ");
  } else {
    // When the preview button is clicked for the first time,
    // give some time for the transition from editor.css to fire and the view to slide from right to left,
    // instead of just appearing.
    setTimeout(function() {
      if (!cm.getOption("fullScreen"))
        toggleFullScreen(editor);

      preview.className += " editor-preview-active-side";
    }, 1);

    if (toolbarButton)
      toolbarButton.className += " active";

    wrapper.className += " CodeMirror-sided";
    useSideBySideListener = true;
  }

  // Hide normal preview if active
  const previewNormal = wrapper.lastChild;

  if (/editor-preview-active/.test(previewNormal.className)) {
    previewNormal.className = previewNormal.className.replace(
      /\s*editor-preview-active\s*/g, ""
    );

    const toolbar = editor.toolbarElements.preview;
    const toolbar_div = wrapper.previousSibling;

    toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
    toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
  }

  const sideBySideRenderingFunction = function() {
    preview.innerHTML = editor.options.previewRender(editor.value(), preview);
  };

  if (!cm.sideBySideRenderingFunction)
    cm.sideBySideRenderingFunction = sideBySideRenderingFunction;

  if (useSideBySideListener) {
    preview.innerHTML = editor.options.previewRender(editor.value(), preview);
    cm.on("update", cm.sideBySideRenderingFunction);
  } else {
    cm.off("update", cm.sideBySideRenderingFunction);
  }

  // Refresh to fix selection being off (#309)
  cm.refresh();
}


/**
 * Preview action.
 */
function togglePreview(editor) {
  const cm = editor.codemirror;
  const wrapper = cm.getWrapperElement();
  const toolbar_div = wrapper.previousSibling;
  const toolbar = editor.options.toolbar ? editor.toolbarElements.preview : false;
  let preview = wrapper.lastChild;

  if (!preview || !/editor-preview/.test(preview.className)) {
    preview = document.createElement("div");
    preview.className = "editor-preview";
    wrapper.appendChild(preview);
  }

  if (/editor-preview-active/.test(preview.className)) {
    preview.className = preview.className.replace(
      /\s*editor-preview-active\s*/g, ""
    );

    if (toolbar) {
      toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
      toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
    }
  } else {
    // When the preview button is clicked for the first time,
    // give some time for the transition from editor.css to fire and the view to slide from right to left,
    // instead of just appearing.
    setTimeout(function() {
      preview.className += " editor-preview-active";
    }, 1);

    if (toolbar) {
      toolbar.className += " active";
      toolbar_div.className += " disabled-for-preview";
    }
  }

  preview.innerHTML = editor.options.previewRender(editor.value(), preview);

  // Turn off side by side if needed
  const sidebyside = cm.getWrapperElement().nextSibling;

  if (/editor-preview-active-side/.test(sidebyside.className))
    toggleSideBySide(editor);
}

function _replaceSelection(cm, active, startEnd, url) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  let text;
  let start = startEnd[0];
  let end = startEnd[1];
  const startPoint = {};
  const endPoint = {};

  Object.assign(startPoint, cm.getCursor("start"));
  Object.assign(endPoint, cm.getCursor("end"));

  if (url)
    end = end.replace("#url#", url);

  if (active) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);

    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0
    });
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);

    startPoint.ch += start.length;

    if (startPoint !== endPoint)
      endPoint.ch += start.length;
  }

  cm.setSelection(startPoint, endPoint);
  cm.focus();
}

function _toggleHeading(cm, direction, size) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  const startPoint = cm.getCursor("start");
  const endPoint = cm.getCursor("end");

  for (let i = startPoint.line; i <= endPoint.line; i++) {
    (function(i) {
      let text = cm.getLine(i);
      const currHeadingLevel = text.search(/[^#]/);

      if (direction !== undefined) {
        if (currHeadingLevel <= 0) {
          if (direction === "bigger")
            text = "###### " + text;
          else
            text = "# " + text;
        } else if (currHeadingLevel === 6 && direction === "smaller") {
          text = text.substr(7);
        } else if (currHeadingLevel === 1 && direction === "bigger") {
          text = text.substr(2);
        } else {
          if (direction === "bigger")
            text = text.substr(1);
          else
            text = "#" + text;
        }
      } else {
        if (size === 1) {
          if (currHeadingLevel <= 0) {
            text = "# " + text;
          } else if (currHeadingLevel === size) {
            text = text.substr(currHeadingLevel + 1);
          } else {
            text = "# " + text.substr(currHeadingLevel + 1);
          }
        } else if (size === 2) {
          if (currHeadingLevel <= 0) {
            text = "## " + text;
          } else if (currHeadingLevel === size) {
            text = text.substr(currHeadingLevel + 1);
          } else {
            text = "## " + text.substr(currHeadingLevel + 1);
          }
        } else {
          if (currHeadingLevel <= 0) {
            text = "### " + text;
          } else if (currHeadingLevel === size) {
            text = text.substr(currHeadingLevel + 1);
          } else {
            text = "### " + text.substr(currHeadingLevel + 1);
          }
        }
      }

      cm.replaceRange(text,
        {
          line: i,
          ch: 0
        }, {
          line: i,
          ch: 99999999999999
        }
      );
    })(i);
  }

  cm.focus();
}


function _toggleLine(cm, name) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  const listRegexp = /^(\s*)(\*|-|\+|\d*\.)(\s+)/;
  const whitespacesRegexp = /^\s*/;
  const stat = getState(cm);
  const startPoint = cm.getCursor("start");
  const endPoint = cm.getCursor("end");

  const repl = {
    quote: /^(\s*)>\s+/,
    "unordered-list": listRegexp,
    "ordered-list": listRegexp
  };

  const _getChar = function(name, i) {
    const map = {
      quote: ">",
      "unordered-list": "*",
      "ordered-list": "%%i."
    };

    return map[name].replace("%%i", i);
  };

  const _checkChar = function(name, char) {
    const map = {
      quote: ">",
      "unordered-list": "*",
      "ordered-list": "d+."
    };

    const rt = new RegExp(map[name]);

    return char && rt.test(char);
  };

  let line = 1;

  for (let i = startPoint.line; i <= endPoint.line; i++) {
    (function(i) {
      let text = cm.getLine(i);

      if (stat[name]) {
        text = text.replace(repl[name], "$1");
      } else {
        var arr = listRegexp.exec(text);
        var char = _getChar(name, line);

        if (arr !== null) {
          if (_checkChar(name, arr[2]))
            char = "";

          text = arr[1] + char + arr[3] + text.replace(whitespacesRegexp, "").replace(repl[name], "$1");
        } else {
          text = char + " " + text;
        }

        line += 1;
      }

      cm.replaceRange(text,
        {
          line: i,
          ch: 0
        }, {
          line: i,
          ch: 99999999999999
        }
      );
    })(i);
  }

  cm.focus();
}

function _toggleBlock(editor, type, start_chars, end_chars) {
  if (/editor-preview-active/.test(editor.codemirror.getWrapperElement().lastChild.className))
    return;

  end_chars = (typeof end_chars === "undefined") ?
    start_chars :
    end_chars;

  const cm = editor.codemirror;
  const stat = getState(cm);

  let text;
  let start = start_chars;
  let end = end_chars;

  const startPoint = cm.getCursor("start");
  const endPoint = cm.getCursor("end");

  if (stat[type]) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);

    if (type === "bold") {
      start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
      end = end.replace(/(\*\*|__)/, "");
    } else if (type === "italic") {
      start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
      end = end.replace(/(\*|_)/, "");
    } else if (type === "strikethrough") {
      start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
      end = end.replace(/(\*\*|~~)/, "");
    }

    cm.replaceRange(start + end,
      {
        line: startPoint.line,
        ch: 0
      }, {
        line: startPoint.line,
        ch: 99999999999999
      }
    );

    if (type === "bold" || type === "strikethrough") {
      startPoint.ch -= 2;

      if (startPoint !== endPoint)
        endPoint.ch -= 2;
    } else if (type === "italic") {
      startPoint.ch -= 1;

      if (startPoint !== endPoint)
        endPoint.ch -= 1;
    }
  } else {
    text = cm.getSelection();

    if (type === "bold") {
      text = text.split("**").join("");
      text = text.split("__").join("");
    } else if (type === "italic") {
      text = text.split("*").join("");
      text = text.split("_").join("");
    } else if (type === "strikethrough") {
      text = text.split("~~").join("");
    }

    cm.replaceSelection(start + text + end);

    startPoint.ch += start_chars.length;
    endPoint.ch = startPoint.ch + text.length;
  }

  cm.setSelection(startPoint, endPoint);
  cm.focus();
}

function _cleanBlock(cm) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  const startPoint = cm.getCursor("start");
  const endPoint = cm.getCursor("end");
  let text;

  for (let line = startPoint.line; line <= endPoint.line; line++) {
    text = cm.getLine(line);
    text = text.replace(/^[ ]*([# ]+|\*|-|[> ]+|[0-9]+(.|\)))[ ]*/, "");

    cm.replaceRange(text,
      {
        line: line,
        ch: 0
      }, {
        line: line,
        ch: 99999999999999
      }
    );
  }
}

// Merge the properties of one object into another.
function _mergeProperties(target, source) {
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      switch(true) {
        case source[property] instanceof Array:
          target[property] = source[property].concat(target[property] instanceof Array ? target[property] : []);
          break;

        case source[property] !== null && typeof source[property] === "object" && source[property].constructor === Object:
          target[property] = _mergeProperties(target[property] || {}, source[property]);
          break;

        default:
          target[property] = source[property];
          break;
      }
    }
  }

  return target;
}

// Merge an arbitrary number of objects into one.
function extend(target) {
  for (let i = 1; i < arguments.length; i++)
    target = _mergeProperties(target, arguments[i]);

  return target;
}

/* The right word count in respect for CJK. */
function wordCount(data) {
  const pattern = /[a-zA-Z0-9_\u00A0-\u02AF\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
  const m = data.match(pattern);
  let count = 0;

  if (m === null)
    return count;

  for (let i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4E00)
      count += m[i].length;
    else
      count += 1;
  }

  return count;
}

const toolbarBuiltInButtons = {
  bold: {
    name: "bold",
    action: toggleBold,
    className: "fa fa-bold",
    title: "Bold",
    default: true
  },
  italic: {
    name: "italic",
    action: toggleItalic,
    className: "fa fa-italic",
    title: "Italic",
    default: true
  },
  strikethrough: {
    name: "strikethrough",
    action: toggleStrikethrough,
    className: "fa fa-strikethrough",
    title: "Strikethrough"
  },
  heading: {
    name: "heading",
    action: toggleHeadingSmaller,
    className: "fa fa-header fa-heading",
    title: "Heading",
    default: true
  },
  "heading-smaller": {
    name: "heading-smaller",
    action: toggleHeadingSmaller,
    className: "fa fa-header fa-heading header-smaller",
    title: "Smaller Heading"
  },
  "heading-bigger": {
    name: "heading-bigger",
    action: toggleHeadingBigger,
    className: "fa fa-header fa-heading header-bigger",
    title: "Bigger Heading"
  },
  "heading-1": {
    name: "heading-1",
    action: toggleHeading1,
    className: "fa fa-header fa-heading header-1",
    title: "Big Heading"
  },
  "heading-2": {
    name: "heading-2",
    action: toggleHeading2,
    className: "fa fa-header fa-heading header-2",
    title: "Medium Heading"
  },
  "heading-3": {
    name: "heading-3",
    action: toggleHeading3,
    className: "fa fa-header fa-heading header-3",
    title: "Small Heading"
  },
  "separator-1": {
    name: "separator-1"
  },
  code: {
    name: "code",
    action: toggleCodeBlock,
    className: "fa fa-code",
    title: "Code"
  },
  quote: {
    name: "quote",
    action: toggleBlockquote,
    className: "fa fa-quote-left",
    title: "Quote",
    default: true
  },
  "unordered-list": {
    name: "unordered-list",
    action: toggleUnorderedList,
    className: "fa fa-list-ul",
    title: "Generic List",
    default: true
  },
  "ordered-list": {
    name: "ordered-list",
    action: toggleOrderedList,
    className: "fa fa-list-ol",
    title: "Numbered List",
    default: true
  },
  "clean-block": {
    name: "clean-block",
    action: cleanBlock,
    className: "fa fa-eraser",
    title: "Clean block"
  },
  "separator-2": {
    name: "separator-2"
  },
  link: {
    name: "link",
    action: drawLink,
    className: "fa fa-link",
    title: "Create Link",
    default: true
  },
  image: {
    name: "image",
    action: drawImage,
    className: "fa fa-image",
    title: "Insert Image",
    default: true
  },
  table: {
    name: "table",
    action: drawTable,
    className: "fa fa-table",
    title: "Insert Table"
  },
  "horizontal-rule": {
    name: "horizontal-rule",
    action: drawHorizontalRule,
    className: "fa fa-minus",
    title: "Insert Horizontal Line"
  },
  "separator-3": {
    name: "separator-3"
  },
  preview: {
    name: "preview",
    action: togglePreview,
    className: "fa fa-eye",
    noDisable: true,
    title: "Toggle Preview",
    default: true
  },
  "side-by-side": {
    name: "side-by-side",
    action: toggleSideBySide,
    className: "fa fa-columns",
    noDisable: true,
    noMobile: true,
    title: "Toggle Side by Side",
    default: true
  },
  fullscreen: {
    name: "fullscreen",
    action: toggleFullScreen,
    className: "fa fa-arrows-alt",
    noDisable: true,
    noMobile: true,
    title: "Toggle Fullscreen",
    default: true
  },
  "separator-4": {
    name: "separator-4"
  },
  guide: {
    name: "guide",
    action: "https://www.markdownguide.org/basic-syntax/",
    className: "fa fa-question-circle",
    noDisable: true,
    title: "Markdown Guide",
    default: true
  },
  "separator-5": {
    name: "separator-5"
  },
  undo: {
    name: "undo",
    action: undo,
    className: "fa fa-undo",
    noDisable: true,
    title: "Undo"
  },
  redo: {
    name: "redo",
    action: redo,
    className: "fa fa-repeat fa-redo",
    noDisable: true,
    title: "Redo"
  }
};

const insertTexts = {
  link: ["[", "](#url#)"],
  image: ["![](", "#url#)"],
  table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"],
  horizontalRule: ["", "\n\n-----\n\n"]
};

const promptTexts = {
  link: "URL for the link:",
  image: "URL of the image:"
};

const blockStyles = {
  bold: "**",
  code: "```",
  italic: "*"
};

/**
 * Interface of Meditate.
 */
function Meditate(options) {
  // Handle options parameter
  options = options || {};

  // Used later to refer to it"s parent
  options.parent = this;

  // Check if Font Awesome needs to be auto downloaded
  let autoDownloadFA = false;

  if (options.autoDownloadFontAwesome === false)
    autoDownloadFA = false;

  if (options.autoDownloadFontAwesome !== true) {
    const styleSheets = document.styleSheets;

    for (let i = 0; i < styleSheets.length; i++) {
      if (!styleSheets[i].href)
        continue;

      if (styleSheets[i].href.indexOf("//maxcdn.bootstrapcdn.com/font-awesome/") > -1)
        autoDownloadFA = false;
    }
  }

  if (autoDownloadFA) {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css";

    document.getElementsByTagName("head")[0].appendChild(link);
  }


  // Find the textarea to use
  if (options.element) {
    this.element = options.element;
  } else if (options.element === null) {
    // This means that the element option was specified, but no element was found
    console.log("Meditate: Error. No element was found."); // eslint-disable-line no-console
    return;
  }

  // Handle toolbar
  if (options.toolbar === undefined) {
    // Initialize
    options.toolbar = [];

    // Loop over the built in buttons, to get the preferred order
    for (const key in toolbarBuiltInButtons) {
      if (toolbarBuiltInButtons.hasOwnProperty(key)) {
        if (key.indexOf("separator-") !== -1)
          options.toolbar.push("|");

        if (
          toolbarBuiltInButtons[key].default === true ||
          (
            options.showIcons && options.showIcons.constructor === Array &&
            options.showIcons.indexOf(key) !== -1
          )
        ) options.toolbar.push(key);
      }
    }
  }

  // Handle status bar
  if (!options.hasOwnProperty("status"))
    options.status = ["autosave", "lines", "words", "cursor"];

  // Add default preview rendering function
  if (!options.previewRender) {
    options.previewRender = function(plainText) {
      // Note: "this" refers to the options object
      return this.parent.markdown(plainText);
    };
  }

  // Set default options for parsing config
  options.parsingConfig = extend({
    highlightFormatting: true // needed for toggleCodeBlock to detect types of code
  }, options.parsingConfig || {});

  // Merging the insertTexts, with the given options
  options.insertTexts = extend({}, insertTexts, options.insertTexts || {});

  // Merging the promptTexts, with the given options
  options.promptTexts = extend({}, promptTexts, options.promptTexts || {});

  // Merging the blockStyles, with the given options
  options.blockStyles = extend({}, blockStyles, options.blockStyles || {});

  // Merging the shortcuts, with the given options
  options.shortcuts = extend({}, shortcuts, options.shortcuts || {});
  options.minHeight = options.minHeight || "300px";

  // Change unique_id to uniqueId for backwards compatibility
  if (options.autosave !== undefined && options.autosave.unique_id !== undefined && options.autosave.unique_id !== "")
    options.autosave.uniqueId = options.autosave.unique_id;

  // Update this options
  this.options = options;

  // Auto render
  this.render();

  // The codemirror component is only available after rendering
  // so, the setter for the initialValue can only run after
  // the element has been rendered
  if (
    options.initialValue &&
    (
      !this.options.autosave ||
      this.options.autosave.foundSavedValue !== true
    )
  ) this.value(options.initialValue);
}

/**
 * Default markdown render.
 */
Meditate.prototype.markdown = function(text) {
  if (marked) {
    // TODO:
    // Set `sanitize` to `true`

    // Initialize
    let markedOptions;

    if (this.options && this.options.renderingConfig && this.options.renderingConfig.markedOptions)
      markedOptions = this.options.renderingConfig.markedOptions;
    else
      markedOptions = {};

    // Update options
    if (this.options && this.options.renderingConfig && this.options.renderingConfig.singleLineBreaks === false)
      markedOptions.breaks = false;
    else
      markedOptions.breaks = true;

    if (this.options && this.options.renderingConfig && this.options.renderingConfig.codeSyntaxHighlighting === true) {
      /* Get HLJS from config or window */
      const hljs = this.options.renderingConfig.hljs || window.hljs;

      /* Check if HLJS loaded */
      if (hljs)
        markedOptions.highlight = code => hljs.highlightAuto(code).value;
    }

    // Set options
    marked.setOptions(markedOptions);

    // Convert the markdown to HTML
    let htmlText = marked(text);

    // Edit the HTML anchors to add 'target="_blank"' by default.
    htmlText = addAnchorTargetBlank(htmlText);

    return htmlText;
  }
};

/**
 * Render editor to the given element.
 */
Meditate.prototype.render = function(el) {
  if (!el)
    el = this.element || document.getElementsByTagName("textarea")[0];

  if (this._rendered && this._rendered === el)
    return; // Already rendered

  this.element = el;
  const options = this.options;

  const self = this;
  const keyMaps = {};

  for (const key in options.shortcuts) {
    // null stands for "do not bind this command"
    if (options.shortcuts[key] !== null && bindings[key] !== null) {
      (function(key) {
        keyMaps[fixShortcut(options.shortcuts[key])] = function() {
          bindings[key](self);
        };
      })(key);
    }
  }

  keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
  keyMaps["Tab"] = "tabAndIndentMarkdownList";
  keyMaps["Shift-Tab"] = "shiftTabAndUnindentMarkdownList";

  keyMaps["Esc"] = function(cm) {
    if (cm.getOption("fullScreen"))
      toggleFullScreen(self);
  };

  document.addEventListener("keydown", function(e) {
    e = e || window.event;

    if (e.keyCode === 27)
      if (self.codemirror.getOption("fullScreen"))
        toggleFullScreen(self);
  }, false);

  let backdrop;
  let mode;

  if (options.spellChecker !== false) {
    mode = "spell-checker";
    backdrop = options.parsingConfig;
    backdrop.name = "gfm";
    backdrop.gitHubSpice = false;

    CodeMirrorSpellChecker({
      codeMirrorInstance: CodeMirror
    });
  } else {
    mode = options.parsingConfig;
    mode.name = "gfm";
    mode.gitHubSpice = false;
  }

  // eslint-disable-next-line no-unused-vars
  function configureMouse(cm, repeat, event) {
    return {
      addNew: false
    };
  }

  this.codemirror = CodeMirror.fromTextArea(el, {
    mode: mode,
    backdrop: backdrop,
    theme: (options.theme !== undefined) ? options.theme : "meditate",
    tabSize: (options.tabSize !== undefined) ? options.tabSize : 2,
    indentUnit: (options.tabSize !== undefined) ? options.tabSize : 2,
    indentWithTabs: (options.indentWithTabs === true) ? true : false,
    lineNumbers: false,
    autofocus: (options.autofocus === true) ? true : false,
    extraKeys: keyMaps,
    lineWrapping: (options.lineWrapping === false) ? false : true,
    allowDropFileTypes: ["text/plain"],
    placeholder: options.placeholder || el.getAttribute("placeholder") || "",
    styleSelectedText: (options.styleSelectedText !== undefined) ? options.styleSelectedText : !isMobile(),
    configureMouse: configureMouse
  });

  this.codemirror.getScrollerElement().style.minHeight = options.minHeight;

  if (options.forceSync === true) {
    const cm = this.codemirror;

    cm.on("change", function() {
      cm.save();
    });
  }

  this.gui = {};

  if (options.toolbar !== false)
    this.gui.toolbar = this.createToolbar();

  if (options.status !== false)
    this.gui.statusbar = this.createStatusbar();

  if (options.autosave !== undefined && options.autosave.enabled === true)
    this.autosave();

  this.gui.sideBySide = this.createSideBySide();
  this._rendered = this.element;

  // Fixes CodeMirror bug (#344)
  const temp_cm = this.codemirror;

  setTimeout(function() {
    temp_cm.refresh();
  }.bind(temp_cm), 0);
};

// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem throw QuotaExceededError. We're going to detect this and set a variable accordingly.
function isLocalStorageAvailable() {
  if (typeof localStorage === "object") {
    try {
      localStorage.setItem("smde_localStorage", 1);
      localStorage.removeItem("smde_localStorage");
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

Meditate.prototype.autosave = function() {
  if (isLocalStorageAvailable()) {
    const easyMDE = this;

    if (this.options.autosave.uniqueId === undefined || this.options.autosave.uniqueId === "") {
      console.log("Meditate: You must set a uniqueId to use the autosave feature"); // eslint-disable-line no-console
      return;
    }

    if(this.options.autosave.binded !== true) {
      if (easyMDE.element.form !== null && easyMDE.element.form !== undefined) {
        easyMDE.element.form.addEventListener("submit", function() {
          clearTimeout(easyMDE.autosaveTimeoutId);
          easyMDE.autosaveTimeoutId = undefined;

          localStorage.removeItem("smde_" + easyMDE.options.autosave.uniqueId);

          // Restart autosaving in case the submit will be cancelled down the line
          setTimeout(function() {
            easyMDE.autosave();
          }, easyMDE.options.autosave.delay || 10000);
        });
      }

      this.options.autosave.binded = true;
    }

    if (this.options.autosave.loaded !== true) {
      if (typeof localStorage.getItem("smde_" + this.options.autosave.uniqueId) === "string" && localStorage.getItem("smde_" + this.options.autosave.uniqueId) !== "") {
        this.codemirror.setValue(localStorage.getItem("smde_" + this.options.autosave.uniqueId));
        this.options.autosave.foundSavedValue = true;
      }

      this.options.autosave.loaded = true;
    }

    localStorage.setItem("smde_" + this.options.autosave.uniqueId, easyMDE.value());

    const el = document.getElementById("autosaved");

    if (el !== null && el !== undefined && el !== "") {
      const d = new Date();
      const hh = d.getHours();
      let m = d.getMinutes();
      let dd = "am";
      let h = hh;

      if (h >= 12) {
        h = hh - 12;
        dd = "pm";
      }

      if (h === 0)
        h = 12;

      m = m < 10 ? "0" + m : m;

      el.innerHTML = "Autosaved: " + h + ":" + m + " " + dd;
    }

    this.autosaveTimeoutId = setTimeout(function() {
      easyMDE.autosave();
    }, this.options.autosave.delay || 10000);
  } else {
    console.log("Meditate: localStorage not available, cannot autosave"); // eslint-disable-line no-console
  }
};

Meditate.prototype.clearAutosavedValue = function() {
  if (isLocalStorageAvailable()) {
    if (
      this.options.autosave === undefined ||
      this.options.autosave.uniqueId === undefined ||
      this.options.autosave.uniqueId === ""
    ) {
      console.log("Meditate: You must set a uniqueId to clear the autosave value"); // eslint-disable-line no-console
      return;
    }

    localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
  } else {
    console.log("Meditate: localStorage not available, cannot autosave"); // eslint-disable-line no-console
  }
};

Meditate.prototype.createSideBySide = function() {
  const cm = this.codemirror;
  const wrapper = cm.getWrapperElement();
  let preview = wrapper.nextSibling;

  if (!preview || !/editor-preview-side/.test(preview.className)) {
    preview = document.createElement("div");
    preview.className = "editor-preview-side";
    wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);
  }

  if (this.options.syncSideBySidePreviewScroll === false)
    return preview;

  // Syncs scroll editor -> preview
  let cScroll = false;
  let pScroll = false;

  cm.on("scroll", function(v) {
    if (cScroll) {
      cScroll = false;
      return;
    }

    pScroll = true;

    const height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
    const ratio = parseFloat(v.getScrollInfo().top) / height;
    const move = (preview.scrollHeight - preview.clientHeight) * ratio;

    preview.scrollTop = move;
  });

  // Syncs scroll  preview -> editor
  preview.onscroll = function() {
    if (pScroll) {
      pScroll = false;
      return;
    }

    cScroll = true;

    const height = preview.scrollHeight - preview.clientHeight;
    const ratio = parseFloat(preview.scrollTop) / height;
    const move = (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight) * ratio;

    cm.scrollTo(0, move);
  };

  return preview;
};

Meditate.prototype.createToolbar = function(items) {
  items = items || this.options.toolbar;

  if (!items || items.length === 0)
    return;

  for (let i = 0; i < items.length; i++) {
    if (toolbarBuiltInButtons[items[i]] !== undefined)
      items[i] = toolbarBuiltInButtons[items[i]];
  }

  const bar = document.createElement("div");
  const self = this;
  const toolbarData = {};

  bar.className = "editor-toolbar";
  self.toolbar = items;

  for (let i = 0; i < items.length; i++) {
    if (items[i].name === "guide" && self.options.toolbarGuideIcon === false)
      continue;

    if (self.options.hideIcons && self.options.hideIcons.indexOf(items[i].name) !== -1)
      continue;

    // Fullscreen does not work well on mobile devices (even tablets)
    // In the future, hopefully this can be resolved
    if ((items[i].name === "fullscreen" || items[i].name === "side-by-side") && isMobile())
      continue;

    // Do not include trailing separators
    if (items[i] === "|") {
      let nonSeparatorIconsFollow = false;

      for (let x = (i + 1); x < items.length; x++) {
        if (items[x] !== "|" && (!self.options.hideIcons || self.options.hideIcons.indexOf(items[x].name) === -1))
          nonSeparatorIconsFollow = true;
      }

      if (!nonSeparatorIconsFollow)
        continue;
    }

    // Create the icon and append to the toolbar
    (function(item) {
      let el;

      if (item === "|")
        el = createSep();
      else
        el = createToolbarButton(item, self.options.toolbarTips, self.options.shortcuts);

      // bind events, special for info
      if (item.action) {
        if (typeof item.action === "function") {
          el.onclick = function(e) {
            e.preventDefault();
            item.action(self);
          };
        } else if (typeof item.action === "string") {
          el.onclick = function(e) {
            e.preventDefault();
            window.open(item.action, "_blank");
          };
        }
      }

      toolbarData[item.name || item] = el;
      bar.appendChild(el);
    })(items[i]);
  }

  self.toolbarElements = toolbarData;

  const cm = this.codemirror;

  cm.on("cursorActivity", function() {
    const stat = getState(cm);

    for (const key in toolbarData) {
      (function(key) {
        const el = toolbarData[key];

        if (stat[key])
          el.className += " active";
        else if (key !== "fullscreen" && key !== "side-by-side")
          el.className = el.className.replace(/\s*active\s*/g, "");
      })(key);
    }
  });

  const cmWrapper = cm.getWrapperElement();

  cmWrapper.parentNode.insertBefore(bar, cmWrapper);
  return bar;
};

Meditate.prototype.createStatusbar = function(status) {
  // Initialize
  status = status || this.options.status;
  const options = this.options;
  const cm = this.codemirror;

  // Make sure the status variable is valid
  if (!status || status.length === 0)
    return;

  // Set up the built-in items
  const items = [];
  let defaultValue;
  let onUpdate;

  for (let i = 0; i < status.length; i++) {
    // Reset some values
    onUpdate = undefined;
    defaultValue = undefined;

    // Handle if custom or not
    if (typeof status[i] === "object") {
      items.push({
        className: status[i].className,
        defaultValue: status[i].defaultValue,
        onUpdate: status[i].onUpdate
      });
    } else {
      const name = status[i];

      switch(true) {
        case name === "words":
          defaultValue = el => el.innerHTML = wordCount(cm.getValue());
          onUpdate = el => el.innerHTML = wordCount(cm.getValue());
          break;

        case name === "lines":
          defaultValue = el => el.innerHTML = cm.lineCount();
          onUpdate = el => el.innerHTML = cm.lineCount();
          break;

        case name === "cursor":
          defaultValue = el => el.innerHTML = "0:0";

          onUpdate = function(el) {
            const pos = cm.getCursor();
            el.innerHTML = pos.line + ":" + pos.ch; // eslint-disable-line padding-line-between-statements
          };

          break;

        case name === "autosave":
          defaultValue = el => {
            if (options.autosave !== undefined && options.autosave.enabled === true)
              el.setAttribute("id", "autosaved");
          };
          break;

        default:
          break;
      }

      items.push({
        className: name,
        defaultValue: defaultValue,
        onUpdate: onUpdate
      });
    }
  }


  // Create element for the status bar
  const bar = document.createElement("div");

  bar.className = "editor-statusbar";


  // Create a new span for each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i]; // Store in temporary variable
    const el = document.createElement("span"); // Create span element

    el.className = item.className;

    // Ensure the defaultValue is a function
    if (typeof item.defaultValue === "function")
      item.defaultValue(el);

    // Ensure the onUpdate is a function
    if (typeof item.onUpdate === "function") {
      // Create a closure around the span of the current action, then execute the onUpdate handler
      this.codemirror.on("update", (function(el, item) {
        return function() {
          item.onUpdate(el);
        };
      }(el, item)));
    }

    // Append the item to the status bar
    bar.appendChild(el);
  }

  // Insert the status bar into the DOM
  const cmWrapper = this.codemirror.getWrapperElement();

  cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling);
  return bar;
};

/**
 * Get or set the text content.
 */
Meditate.prototype.value = function(val) {
  const cm = this.codemirror;

  if (val === undefined) {
    return cm.getValue();
  } else {
    cm.getDoc().setValue(val);

    if (this.isPreviewActive()) {
      const wrapper = cm.getWrapperElement();
      const preview = wrapper.lastChild;

      preview.innerHTML = this.options.previewRender(val, preview);
    }

    return this;
  }
};


/**
 * Bind static methods for exports.
 */
Meditate.toggleBold = toggleBold;
Meditate.toggleItalic = toggleItalic;
Meditate.toggleStrikethrough = toggleStrikethrough;
Meditate.toggleBlockquote = toggleBlockquote;
Meditate.toggleHeadingSmaller = toggleHeadingSmaller;
Meditate.toggleHeadingBigger = toggleHeadingBigger;
Meditate.toggleHeading1 = toggleHeading1;
Meditate.toggleHeading2 = toggleHeading2;
Meditate.toggleHeading3 = toggleHeading3;
Meditate.toggleCodeBlock = toggleCodeBlock;
Meditate.toggleUnorderedList = toggleUnorderedList;
Meditate.toggleOrderedList = toggleOrderedList;
Meditate.cleanBlock = cleanBlock;
Meditate.drawLink = drawLink;
Meditate.drawImage = drawImage;
Meditate.drawTable = drawTable;
Meditate.drawHorizontalRule = drawHorizontalRule;
Meditate.undo = undo;
Meditate.redo = redo;
Meditate.togglePreview = togglePreview;
Meditate.toggleSideBySide = toggleSideBySide;
Meditate.toggleFullScreen = toggleFullScreen;

/**
 * Bind instance methods for exports.
 */
Meditate.prototype.toggleBold = function() {
  toggleBold(this);
};

Meditate.prototype.toggleItalic = function() {
  toggleItalic(this);
};

Meditate.prototype.toggleStrikethrough = function() {
  toggleStrikethrough(this);
};

Meditate.prototype.toggleBlockquote = function() {
  toggleBlockquote(this);
};

Meditate.prototype.toggleHeadingSmaller = function() {
  toggleHeadingSmaller(this);
};

Meditate.prototype.toggleHeadingBigger = function() {
  toggleHeadingBigger(this);
};

Meditate.prototype.toggleHeading1 = function() {
  toggleHeading1(this);
};

Meditate.prototype.toggleHeading2 = function() {
  toggleHeading2(this);
};

Meditate.prototype.toggleHeading3 = function() {
  toggleHeading3(this);
};

Meditate.prototype.toggleCodeBlock = function() {
  toggleCodeBlock(this);
};

Meditate.prototype.toggleUnorderedList = function() {
  toggleUnorderedList(this);
};

Meditate.prototype.toggleOrderedList = function() {
  toggleOrderedList(this);
};

Meditate.prototype.cleanBlock = function() {
  cleanBlock(this);
};

Meditate.prototype.drawLink = function() {
  drawLink(this);
};

Meditate.prototype.drawImage = function() {
  drawImage(this);
};

Meditate.prototype.drawTable = function() {
  drawTable(this);
};

Meditate.prototype.drawHorizontalRule = function() {
  drawHorizontalRule(this);
};

Meditate.prototype.undo = function() {
  undo(this);
};

Meditate.prototype.redo = function() {
  redo(this);
};

Meditate.prototype.togglePreview = function() {
  togglePreview(this);
};

Meditate.prototype.toggleSideBySide = function() {
  toggleSideBySide(this);
};

Meditate.prototype.toggleFullScreen = function() {
  toggleFullScreen(this);
};

Meditate.prototype.isPreviewActive = function() {
  const cm = this.codemirror;
  const wrapper = cm.getWrapperElement();
  const preview = wrapper.lastChild;

  return /editor-preview-active/.test(preview.className);
};

Meditate.prototype.isSideBySideActive = function() {
  const cm = this.codemirror;
  const wrapper = cm.getWrapperElement();
  const preview = wrapper.nextSibling;

  return /editor-preview-active-side/.test(preview.className);
};

Meditate.prototype.isFullscreenActive = function() {
  const cm = this.codemirror;
  return cm.getOption("fullScreen"); // eslint-disable-line padding-line-between-statements
};

Meditate.prototype.getState = function() {
  const cm = this.codemirror;
  return getState(cm); // eslint-disable-line padding-line-between-statements
};

Meditate.prototype.toTextArea = function() {
  const cm = this.codemirror;
  const wrapper = cm.getWrapperElement();

  if (wrapper.parentNode) {
    if (this.gui.toolbar)
      wrapper.parentNode.removeChild(this.gui.toolbar);

    if (this.gui.statusbar)
      wrapper.parentNode.removeChild(this.gui.statusbar);

    if (this.gui.sideBySide)
      wrapper.parentNode.removeChild(this.gui.sideBySide);
  }

  cm.toTextArea();

  if (this.autosaveTimeoutId) {
    clearTimeout(this.autosaveTimeoutId);

    this.autosaveTimeoutId = undefined;
    this.clearAutosavedValue();
  }
};

module.exports = exports = Meditate;
