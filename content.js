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

    var betButton = document.createElement("button");
    var betText = document.createTextNode("Place bet");
    betButton.appendChild(betText);
    betTable.insertBefore(betButton, betTable.childNodes[0]);

    var placedBets = false;

    // If the 3rd row in the table is a single cell containing the text:
    //         You do not have any bets placed for this round!
    // ...then no bets were placed.
    placedBets = (tableRows[2].querySelector("td").innerHTML != "You do not have any bets placed for this round!");
    
    if(placedBets) {
        // We skip the last row because it's total possible winnings for the bettor
        for(var i = 2; i < tableRows.length - 1; i++) {   
            var betRow = tableRows[i];
            var allBetData = betRow.querySelectorAll("td");
        
            var betInfoCell = allBetData[1];
            var betInfo = betInfoCell.innerHTML;

            var betArenas = betInfo.split("<br>");
            for(betArena of betArenas) {
                // There is an extra line break at the end of these that we can skip
                if(betArena != "") {
                    var betDataRegex = /^<b>(\w+)<\/b>: (\w+)$/;
                    var betData = betDataRegex.exec(betArena);
                }
            }
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
                "harpoon": betData[4].innerHTML
            }

            betObjects.push(betObject);

            var betButton = document.createElement("button");
            betButton.appendChild(document.createTextNode("Place Bet"));
            betButton.value = i - 3; // We can access this from within the onClick function
            betButton.onclick = function() {
                var expiresDate = new Date();
                expiresDate.setTime(expiresDate.getTime() + 5*60*1000);
                document.cookie = "food_club_bet=" + JSON.stringify(betObjects[this.value]) + ";expires=" + expiresDate.toUTCString() + ";path=/";
                alert("set bet cookie!");
            }

            betData[0].replaceChild(betButton, betData[0].childNodes[0]);
        }
    }
}
else if(window.location.href.endsWith("/foodclub.phtml?type=bet")) {
    var betObject = JSON.parse(getCookie("food_club_bet"));

    if(betObject != "") {   
        Object.keys(betObject).forEach(function(val, idx) { setArenaBet(betObject, val) });
        document.cookie = "food_club_bet=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
    }
}