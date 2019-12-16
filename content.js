var betObjects = new Array();

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
    
    if(true) { // CHANGE TO IF(placedBets) LATER!!!!
        for(var i = 2; i < tableRows.length; i++) {   
            var betRow = tableRows[i];
            var betData = betRow.querySelectorAll("td");
        
            var betInfoCell = betData[1];
            var betInfo = betInfoCell.innerHTML;
        }
    }
}
else if(window.location.href.endsWith("HGB")) {
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
                document.cookie = "food_club_bet=" + JSON.stringify(betObjects[this.value]);
            }

            betData[0].replaceChild(betButton, betData[0].childNodes[0]);
        }
    }
}