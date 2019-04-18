// Create new instance
const editor = new Meditate({
  autoDownloadFontAwesome: false,
  element: document.getElementById("mdEditor")!,
  hideIcons: ["side-by-side", "fullscreen"],
  shortcuts: {
    drawTable: "Cmd-Alt-T",
    toggleFullScreen: null
  },
  spellChecker: false,
  onToggleFullScreen: (full: boolean) => {
    console.log("FullscreenToggled", full);
  },
  theme: "someOtherTheme",
});

// Editor functions
const value = editor.value() as string;
editor.value(value.toUpperCase());

const sbs = editor.isSideBySideActive() as boolean;
const fullscreen = editor.isFullscreenActive() as boolean;

// Access to codemirror object
editor.codemirror.setOption("readOnly", true);

// Static properties
Meditate.toggleItalic = (editor: Meditate) => {
  console.log("SomeButtonOverride");
};
