chrome.webNavigation.onCompleted.addListener(function() {
    alert("You're on a matching pet page!");
}, {url: [{urlMatches : 'http://www.neopets.com/~boochi_target'}]});