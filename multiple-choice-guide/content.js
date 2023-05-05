const keywords = chrome.runtime.getManifest().keywords;

function highlightKeywords() {
  const pageText = document.body.innerHTML;
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const highlightedText = `<span style="background-color: yellow">${keyword}</span>`;
    const highlightedPageText = pageText.replace(regex, highlightedText);
    document.body.innerHTML = highlightedPageText;
  }
}

highlightKeywords();
