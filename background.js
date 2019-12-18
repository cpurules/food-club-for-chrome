chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request == "openFoodClub") {
            chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs) {
                var thisTabIndex = tabs[0]["index"];
                chrome.tabs.create({
                    "url": "http://www.neopets.com/pirates/foodclub.phtml?type=bet",
                    "index": thisTabIndex + 1
                });
            });
        }
    }
)