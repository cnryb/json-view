(function () {
  if (document.getElementsByTagName('pre')[0]) {


    try {
      // At least in chrome, the JSON is wrapped in a pre tag.
      const content = document.getElementsByTagName('pre')[0].innerText;
      if(content[0] !== '{' || content[content.length - 1] !== '}') return;
      
      const json = JSON.parse(content);
      const jsonStr = JSON.stringify(json, null, 2);
      listenMessage(jsonStr)

      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", chrome.runtime.getURL("./index.html"));
      iframe.setAttribute("style", "border: 0px none; width: 100%; height: 100%; display: block;");

      document.documentElement.style.height = "100%";
      document.body.style.margin = "0px";
      document.body.style.height = "100%";
      document.body.insertBefore(iframe, document.body.firstChild);

      function listenMessage(jsonStr) {
        window.addEventListener("message", function (message) {
          // Wait for editor frame to signal that it has loaded.
          if (message.data === "editor-loaded") {
            // element.parentNode.removeChild(element);
            const response = {
              code: jsonStr,
              filename: getFilename(),
            };
            message.source.postMessage(response, chrome.runtime.getURL(""));
          }
        });
      }

      function getFilename() {
        let filename = location.href;
        // Remove path.
        let index = filename.lastIndexOf("/");
        if (index !== -1) {
          filename = filename.substring(index + 1);
        }
        // Remove fragment identifier.
        index = filename.indexOf("#");
        if (index !== -1) {
          filename = filename.substring(0, index);
        }
        // Remove query parameters.
        index = filename.indexOf("?");
        if (index !== -1) {
          filename = filename.substring(0, index);
        }
        return filename;
      }

    }
    catch (e) {
    }
  }

})()