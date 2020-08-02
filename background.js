// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  var data = {};
  fetch('http://localhost:53265/api/Values').then(r => r.text()).then(result => {
    if(result != undefined)
    {
      data['Urls'] = result;
      setData(data);
    }
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab) {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['Urls'], function(result) {
      if(JSON.parse(result['Urls']).indexOf(tab.url) > 0)
      {
        chrome.tabs.create({ url: 'https://www.google.com' });
      }
      else{
        console.log(tab.url);
      }
    });
  }    
});

function setData(data) {
  chrome.storage.sync.set(data, function() {
    // alert(2);
  });
  return true;
};

function getData(key){
  chrome.storage.sync.get([key], function(result) {
    console.log(result[key]);
  });
}