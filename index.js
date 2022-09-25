

(function () {
  const supportedLocales = ["de", "es", "fr", "hu", "it", "ja", "ko", "pr-br", "ru", "tr", "zh-cn", "zh-tw"];
  function getUserLocale() {
    const languageTag = chrome.i18n.getUILanguage().toLowerCase();
    // Extract ISO 639-1 language abbreviation.
    const languageCode = languageTag.substr(0, languageTag.indexOf("-"));
    if (supportedLocales.indexOf(languageCode) >= 0) {
      return languageCode;
    } else if (supportedLocales.indexOf(languageTag) >= 0) {
      return languageTag;
    }
    return null;
  }

  window.addEventListener("message", function (event) {
    const message = event.data;
    if (message.code) {
      require.config({
        paths: {
          vs: "./node_modules/monaco-editor/min/vs",
        },
      });
      const userLocale = getUserLocale();
      if (userLocale !== null) {
        require.config({
          "vs/nls": {
            availableLanguages: {
              "*": userLocale,
            },
          },
        });
      }
      require(["vs/editor/editor.main"], function () {
        var editor = monaco.editor.create(document.getElementById('container'), {
          scrollBeyondLastLine: false,
          // cursorBlinking: "smooth",
          wordWrap: 'on',
          theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs',
          // cursorStyle: 'block',
          readOnly: true,
          contextmenu: false,
          value: message.code,
          language: 'json'
        });

        setTimeout(() => {
          editor.getAction('editor.action.formatDocument').run();
        }, 500)
        editor.onDidLayoutChange(() => {
          console.log('editor.onDidLayoutChange')
        })
        window.addEventListener("resize", function () {
          editor.layout();
        });
      });
    }
  });


  window.parent.postMessage("editor-loaded", "*");

})();