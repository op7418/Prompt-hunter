console.log("Content script loaded.");

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // 在此处添加您希望在 DOM 变化时执行的代码
      const jobPage = document.querySelector("#jobPage");
      if (jobPage) {
        // 添加事件监听器
        const saveButton = document.querySelector('#saveButton');
        if (saveButton) {
          saveButton.removeEventListener('click', handleSaveToNotion);
          saveButton.addEventListener('click', handleSaveToNotion);
        }
      }
    }
  }
});

const config = { childList: true, subtree: true };

observer.observe(document.body, config);

function getDataFromPage() {
  const jobPage = document.getElementById("jobPage");
  console.log("jobPage:", jobPage);
  const imageContainer = jobPage.querySelector(".relative.h-auto.w-full.false, .relative.h-auto.w-full.overflow-hidden");
  console.log("imageContainer:", imageContainer);
  const imageElements = imageContainer.querySelectorAll("img");
  let imageUrl = "";

  for (const imageElement of imageElements) {
    const src = imageElement.src;
    if (src.startsWith("https://mj-gallery.com/")) {
      imageUrl = src.replace("_32_N.webp", ".png");
      break;
    }
  }
  
  const prompt = jobPage.querySelector(".first-letter\\:capitalize").innerText;
  const property = jobPage.querySelector(".line-clamp-1:not(.break-all)").innerText;

  // 获取当前网页的网址
  const url = window.location.href;

  // 获取新的文本字段
  const additionalTextContainer = jobPage.querySelector(".flex.w-full.flex-wrap-reverse.justify-between");
  const additionalText = additionalTextContainer.querySelector("p").innerText;

  return { imageUrl, prompt, property, url, additionalText };
}

function handleSaveToNotion() {
  console.log("Handling save to Notion in the content script");
  const { imageUrl, prompt, property, url, additionalText } = getDataFromPage();

  console.log("Sending data:", {
    imageUrl: imageUrl,
    prompt: prompt,
    property: property,
    url: url,
    additionalText: additionalText,
  });

  chrome.runtime.sendMessage(
    {
      action: "saveToNotion",
      data: {
        imageUrl: imageUrl,
        prompt: prompt,
        property: property,
        url: url,
        additionalText: additionalText,
      },
    },
    (response) => {
      console.log(response);
    }
  );
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveToNotionFromContextMenu") {
    handleSaveToNotion();
    sendResponse({ message: "Data saved successfully from context menu" });
  } else if (request.action === "saveToNotion") {
    handleSaveToNotion();
    sendResponse({ message: "Data saved successfully from popup" });
  }
  return true; // 添加这一行以确保响应可以在异步操作完成后发送
});
