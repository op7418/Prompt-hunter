document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.getElementById("settingsForm");
    const notionApiKeyInput = document.getElementById("notionApiKey");
    const notionDatabaseIdInput = document.getElementById("notionDatabaseId");

    // Load saved settings
    chrome.storage.sync.get(["notionApiKey", "notionDatabaseId"], (result) => {
      notionApiKeyInput.value = result.notionApiKey || "";
      notionDatabaseIdInput.value = result.notionDatabaseId || "";
    });

    // Save settings
    settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      
      chrome.storage.sync.set({
        "notionApiKey": notionApiKeyInput.value,
        "notionDatabaseId": notionDatabaseIdInput.value
      }, () => {
        alert("Settings saved!");
      });
    });
  });