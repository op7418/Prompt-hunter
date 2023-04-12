document.addEventListener("DOMContentLoaded", () => {
  const settingsForm = document.getElementById("settingsForm");
  const notionApiKeyInput = document.getElementById("notionApiKey");
  const notionPageLinkInput = document.getElementById("notionPageLink");

  // Load saved settings
  chrome.storage.sync.get(["notionApiKey", "notionPageLink"], (result) => {
    notionApiKeyInput.value = result.notionApiKey || "";
    notionPageLinkInput.value = result.notionPageLink || "";
  });

  // Save settings
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const notionPageLink = notionPageLinkInput.value;
    const notionDatabaseId = extractDatabaseIdFromPageLink(notionPageLink);

    chrome.storage.sync.set(
      {
        notionApiKey: notionApiKeyInput.value,
        notionDatabaseId: notionDatabaseId,
        notionPageLink: notionPageLink,
      },
      () => {
        alert("Settings saved!");
      }
    );
  });
});

function extractDatabaseIdFromPageLink(pageLink) {
  const regex = /([a-f0-9]{32})/;
  const match = pageLink.match(regex);

  if (match) {
    return match[0];
  }
  return "";
}
