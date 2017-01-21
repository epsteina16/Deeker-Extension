// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}


function getHighlightedText(){
  console.log("In highlighted text");
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    console.log(selection[0])
    return selection[0];
  });
}

function renderStatus(text) {
  document.getElementById('status').textContent = text;
}

function redirects(newText){
  if (newText.search("ah") != -1){
    chrome.tabs.executeScript({
      code: "window.location.replace('https://www.youtube.com/watch?v=aaqzPMOd_1g');"
    });
  }
  if (newText.search("im so stoked my dudes") != -1){
    chrome.tabs.executeScript({
      code: "window.location.replace('https://www.youtube.com/watch?v=5N5_He6A9ME');"
    });
  }
  if (newText.search("pen pineapple apple pen") != -1){
    chrome.tabs.executeScript({
      code: "window.location.replace('https://www.youtube.com/watch?v=Ct6BUPvE2sM');"
    });
  }
  if (newText.search("hello ollie") != -1){
    chrome.tabs.executeScript({
      code: "window.location.replace('https://www.youtube.com/watch?v=rZSoE9sDr3Y');"
    });
  }
}

function translateText(text) {
  var words = [
    ["deek", "don't know"],
    ["deeker", "doofus"],
    ["deeking", "not knowing"],
    ["leland", "dude"],
    ["fasho", "for sure"],
    ["yee", "yes"],
    ["tryna", "are you trying to"],
    ["fuck with", "like"],
    ["hella", "wicked"],
    ["cat", "leave"],
    ["catting", "leaving"],
    ["cop", "buy"],
    ["fiend", "want"],
    ["p juug", "pretty cool"],
    ["juug", "cool"],
    ["dank", "sick"],
    ["heez", "abode"],
    ["heezing", "coming"],
    ["slide", "come"],
    ["sliding", "coming"],
    ["damn near", "just about"],
    ["cuffed", "whipped"],
    ["cheef", "smoke"],
    ["bool", "chill"],
    ["boolin", "chillin"],
    ["bail", "leave"],
    ["based", "high"]
  ];
  var numWords = words.length;
  var newText = String(text);
  newText = newText.toLowerCase();
  //for deek terms
  redirects(newText);
  if (newText.search("deek") != -1){
    if (newText.search("deeker") != -1){
      newText = newText.replace(words[1][0], words[1][1]);
    } else if (newText.search("deeking") != -1){
      newText = newText.replace(words[2][0], words[2][1]);
    }
    newText = newText.replace(words[0][0], words[0][1]);
  }
  for (count = 3; count < numWords; count++){
    english = words[count][1];
    deeklish = words[count][0];
    newText = newText.replace(deeklish, english);
  }
  return newText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    document.getElementById("btn").addEventListener('click', function() {
      var textBoxValue = document.getElementById("text-box").innerText;
      var highlightedValue;
      var translatedText;
      if (textBoxValue === ""){
        chrome.tabs.executeScript( {
          code: "window.getSelection().toString();"
        }, function(selection) {
          document.getElementById("text-box").innerText = selection[0];
        });
        highlightedValue = document.getElementById("text-box").innerText;
        console.log("No text box value")
        console.log(highlightedValue)
        translatedText = translateText(highlightedValue);
        renderStatus(translatedText);
      }
      else{
        console.log("Text box translating")
        translatedText = translateText(textBoxValue);
        renderStatus(translatedText);
      }
    });
  });
});
