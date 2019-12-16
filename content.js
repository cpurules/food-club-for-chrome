if(window.location.href.endsWith("boochi_target")) {
    var betTable = document.getElementsByTagName("table")[2];
    var tableRows = betTable.querySelectorAll("tr");

    // The first two table rows are the headers.  We will skip these always.
    // If there are bets, the last table row is possible winnings, which we don't need
    // We will skip these
    for(var i = 2; i < tableRows.length; i++) {
        // If there are bets, tableRows.length > 3
        // So if we're at the end of the table, and tableRows.length > 3, it is the
        // possible winnings row that we can discard
        if(i > 2 && i == (tableRows.length - 1)) {
            break;
        }

        betRow = tableRows[i];
        var betData = betRow.querySelectorAll("td");

        // check for no bets
        if(i == 2 && betData[0].innerHTML == "You do not have any bets placed for this round!") {
            return;
        }
    
        var betInfoCell = betData[1];
        var betInfo = betInfoCell.innerHTML;
    }
}
