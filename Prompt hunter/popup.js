document.getElementById("saveButton").addEventListener("click", async () => {
  // 延迟以确保 content script 已加载
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 向 content script 发送消息，请求保存操作
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "saveToNotion" }, (response) => {
      const statusElement = document.getElementById("status");
      if (chrome.runtime.lastError) {
        statusElement.textContent = "Error: 保存失败";
        console.error(chrome.runtime.lastError);
      } else {
        statusElement.textContent = "成功: 已保存到 Notion";
        console.log(response);
      }
      setTimeout(() => {
        statusElement.textContent = "";
      }, 3000);
    });
  });
});
