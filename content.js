var betObjects = new Array();

// Lifted from W3Schools: https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setArenaBet(betObject, arena) {
    if(betObject[arena] == "") {
        return;
    }

    var arenaIndex;
    if(arena == "shipwreck") {
        arenaIndex = 0;
    }
    else if(arena == "lagoon") {
        arenaIndex = 1;
    }
    else if(arena == "treasure") {
        arenaIndex = 2;
    }
    else if(arena == "hidden") {
        arenaIndex = 3;
    }
    else if(arena == "harpoon") {
        arenaIndex = 4;
    }
    else {
        return;
    }

    var betForm = document.getElementsByName("bet_form")[0];

    var clickEvent = new Event("click");
    var changeEvent = new Event("change");

    var arenaCheck = betForm.querySelectorAll("input[type=checkbox]")[arenaIndex];
    arenaCheck.checked = true;
    arenaCheck.dispatchEvent(clickEvent);

    var arenaSelect = betForm.querySelectorAll("select")[arenaIndex];
    var arenaOptions = arenaSelect.querySelectorAll("option");
    // First option is always "please select..."
    for(var i = 1; i < arenaOptions.length; i++) {
        var optionText = arenaOptions[i].innerHTML;
        if(optionText.startsWith(betObject[arena]) || optionText.startsWith("The " + betObject[arena])) {
            arenaSelect.value = arenaOptions[i].value
            arenaSelect.dispatchEvent(changeEvent);
            break;
        }
    }
}

if(window.location.href.endsWith("boochi_target")) {
    var betTable = document.getElementsByTagName("table")[2];
    var tableRows = betTable.querySelectorAll("tr");

    var placedBets = false;

    // If the 3rd row in the table is a single cell containing the text:
    //         You do not have any bets placed for this round!
    // ...then no bets were placed.
    placedBets = (tableRows[2].querySelector("td").innerHTML != "You do not have any bets placed for this round!");
    
    if(placedBets) {
        var betObjects = new Array();
        // We skip the last row because it's total possible winnings for the bettor
        for(var i = 2; i < tableRows.length - 1; i++) {   
            var betRow = tableRows[i];
            var allBetData = betRow.querySelectorAll("td");
        
            var betInfoCell = allBetData[1];
            var betInfo = betInfoCell.innerHTML;

            var betArenas = betInfo.split("<br>");
            var betObject = {};
            for(betArena of betArenas) {
                betArena = betArena.toString().trim();
                // There is an extra line break at the end of these that we can skip
                if(betArena != "") {
                    var betDataRegex = /^<b>([\s\w']+)<\/b>: ([\s\w']+)$/
                    var betData = betDataRegex.exec(betArena);

                    // Since our data is modeled after HGB which we started with, we
                    // need to massage this a little more to fit our case.  Luckily
                    // our name check on the bet page will still work :) 
                    var betDataArena = betData[1].split(" ")[0].toLowerCase();
                    var betDataPirate = betData[2];

                    betObject[betDataArena] = betDataPirate;
                }
            }

            betObjects.push(betObject);

            var betButton = document.createElement("button");
            betButton.appendChild(document.createTextNode("Place Bet"));
            betButton.value = i - 2; // We can access this from within the onClick function
            betButton.onclick = function() {
                var expiresDate = new Date();
                expiresDate.setTime(expiresDate.getTime() + 5*60*1000);
                document.cookie = "food_club_bet=" + JSON.stringify(betObjects[this.value]) + ";expires=" + expiresDate.toUTCString() + ";path=/";
                window.location.href = "http://www.neopets.com/pirates/foodclub.phtml?type=bet";
            }

            allBetData[0].replaceChild(betButton, allBetData[0].childNodes[0]);
        }
    }
}
else if(window.location.href.endsWith("~HGB")) {
    // HGB's HTML doesn't lay this out the same way the DOM interprets it
    // Use "Inspect Element" functionality to determine the table data
    var betTable = document.getElementsByTagName("table")[1];
    var tableRows = betTable.querySelectorAll("tr");

    var placedBets = true;

    // Logic for the checking that bets were placed...
    placedBets = true

    if(placedBets) {
        var betObjects = new Array();
        // DOM-generated table has 2 blank rows and then the headers
        // There is also a blank row at the end
        for(var i = 3; i < tableRows.length - 1; i++) {
            var betRow = tableRows[i];
            var betData = betRow.querySelectorAll("td");

            var betObject = {
                "shipwreck": betData[1].innerHTML,
                "lagoon": betData[2].innerHTML,
                "treasure": betData[3].innerHTML,
                "hidden": betData[4].innerHTML,
                "harpoon": betData[5].innerHTML
            }

            betObjects.push(betObject);

            var betButton = document.createElement("button");
            betButton.appendChild(document.createTextNode("Place Bet"));
            betButton.value = i - 3; // We can access this from within the onClick function
            betButton.onclick = function() {
                var expiresDate = new Date();
                expiresDate.setTime(expiresDate.getTime() + 5*60*1000);
                document.cookie = "food_club_bet=" + JSON.stringify(betObjects[this.value]) + ";expires=" + expiresDate.toUTCString() + ";path=/";
                window.location.href = "http://www.neopets.com/pirates/foodclub.phtml?type=bet";
            }

            betData[0].replaceChild(betButton, betData[0].childNodes[0]);
        }
    }
}
else if(window.location.href.indexOf("reddit.com/r/neopets/comments/") != -1 && window.location.href.indexOf("food_club_bets") != -1) {
    var allTables = document.getElementsByTagName("table");

    // The first table is markdown help, so we will skip it
    for(var i = 1; i < allTables.length; i++) {
        var thisTable = allTables[i];
        var firstCellfirstRow = thisTable.querySelector("tr").querySelector("th, td");

        if(firstCellfirstRow && firstCellfirstRow.textContent.match(/^\d+$/)) {
            // Reddit and HGB are basically the same format
            var tableRows = thisTable.querySelectorAll("tr");

            var betObjects = new Array();
            // Skip only the first header row
            for(var i = 1; i < tableRows.length; i++) {
                var betRow = tableRows[i];
                var betData = betRow.querySelectorAll("td");

                var betObject = {
                    "shipwreck": betData[1].innerHTML,
                    "lagoon": betData[2].innerHTML,
                    "treasure": betData[3].innerHTML,
                    "hidden": betData[4].innerHTML,
                    "harpoon": betData[5].innerHTML
                }

                betObjects.push(betObject);

                var betButton = document.createElement("button");
                betButton.appendChild(document.createTextNode("Place Bet"));
                betButton.value = i - 3; // We can access this from within the onClick function
                betButton.onclick = function() {
                    var expiresDate = new Date();
                    expiresDate.setTime(expiresDate.getTime() + 5*60*1000);
                    document.cookie = "food_club_bet=" + JSON.stringify(betObjects[this.value]) + ";expires=" + expiresDate.toUTCString() + ";path=/";
                    window.location.href = "http://www.neopets.com/pirates/foodclub.phtml?type=bet";
                }

                betData[0].replaceChild(betButton, betData[0].childNodes[0]);
            }
        }
    }
}
else if(window.location.href.endsWith("/foodclub.phtml?type=bet")) {
    var betObject = JSON.parse(getCookie("food_club_bet"));

    if(betObject != "") {  
        // Set the bet form
        Object.keys(betObject).forEach(function(val, idx) { setArenaBet(betObject, val) });

        // Pull your maximum bet
        var content = document.getElementById("content").innerHTML;
        var maxNPRegex = /You can only place up to\s+<b>(\d+)<\/b>/;
        var maxNP = maxNPRegex.exec(content)[1];

        // Set maximum bet
        var betField = document.getElementsByName("bet_amount")[0];
        var blurEvent = new Event('blur');
        betField.value = maxNP;
        betField.dispatchEvent(blurEvent);
        
        document.cookie = "food_club_bet=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
    }
}