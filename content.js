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
            betRow = tableRows[i];
            var betData = betRow.querySelectorAll("td");
        
            var betInfoCell = betData[1];
            var betInfo = betInfoCell.innerHTML;
        }
    }
}
