var betTable = document.getElementsByTagName("table")[2];
var tableRows = betTable.querySelectorAll("tr");

// The first two table rows are the headers; the last table row is possible winnings.
// We will want to skip all three of these since they don't contain any bets.
for(var i = 2; i < tableRows.length - 1; i++) {
    betRow = tableRows[i];
    var betData = betRow.querySelectorAll("td");

    var betInfoCell = betData[1];
    var betInfo = betInfoCell.innerHTML;
}