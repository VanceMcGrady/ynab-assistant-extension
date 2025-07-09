chrome.runtime.onInstalled.addListener(() => {
  console.log("YNAB Assistant installed");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
