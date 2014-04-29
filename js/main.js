var tableData;
var sortOrders;
var fileName = "";
var maxCols = 0;
var $table;

// When document is loaded call init function
$(document).ready(init);

// Called when the app is first loaded
function init()
{   
    $("#getFile").change(getFile);
    $("#openFile").click(function(){ $("#getFile").click(); });
    print("INIT");
    
    if(!window.chrome)
        alert("Sorry but this has been developed only for chrome.");
    
    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob)
      alert('The File APIs are not fully supported in this browser.');
}

function makeTable()
{
    var $tableContainer = document.getElementById("tableContainer");
    $table = document.createElement("table");
    $table.setAttribute("id", "table");
    $table.classList.add("table");
    
    for(var rowIndex = 0; rowIndex < tableData.length; rowIndex++)
    {
        var newRow = document.createElement("tr");
        
        if(rowIndex % 2 !== 0)
            newRow.classList.add("darkGray");
            
        newRow.classList.add("tableRow");
        
        for(var colIndex = 0; colIndex < maxCols; colIndex++)
        {
            var newCol = document.createElement("td");
            
            if(rowIndex === 0)
            {
                newCol = document.createElement("th");
                newCol.classList.add("tableCellHeader");
                newCol.id = colIndex;
            }
            
            newCol.classList.add("tableCell");
            newCol.innerHTML = !!tableData[rowIndex][colIndex] ? tableData[rowIndex][colIndex] : "";
            newRow.appendChild(newCol);
        }
        
        $table.appendChild(newRow);
    }
    
    $tableContainer.innerHTML = $table.outerHTML;
    
    $("th").click(function() { 
        console.log("clicked");
        var rowIndex = this.id - 0;
        sortOrders[rowIndex] = !sortOrders[rowIndex];
        sortRows(rowIndex, sortOrders[rowIndex]); 
    });
    
    $table = document.getElementById("table");
}

// Reads all files
function getFile(e)
{
    print("OPEN FILE BUTTON CLICKED");
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function()
    {
        processFile(this.result);
    };

    reader.readAsText(file);
    fileName = file.name;
    e.target.value = "";
}

// Processes the file 
function processFile(csvData)
{
    sortOrders = [];
    tableData = csvData.split("\n");
    maxCols = 0;

    if(tableData[tableData.length - 1] === "")
        tableData.pop();
    
    for(var index in tableData)
    {
        sortOrders.push(false);
        tableData[index] = tableData[index].split(",");

        if(tableData[index].length > maxCols)
            maxCols = tableData[index].length;
    }
    
    makeTable();
    $("#fileTitle")[0].innerHTML = fileName;
}

function sortRows(columnIndex, bigFirst)
{
    var begTime = new Date().getTime();
    var changed = true;
    
    while(changed)
    {
        changed = false;
        
        // Start at 1 to skip header row
        for(var rowIndex = 1; rowIndex < tableData.length - 1; rowIndex++)
        {
            if(bigFirst && parseFloat(tableData[rowIndex][columnIndex]) < parseFloat(tableData[rowIndex + 1][columnIndex])) 
                changed = true;
                
            else if(!bigFirst && parseFloat(tableData[rowIndex][columnIndex]) > parseFloat(tableData[rowIndex + 1][columnIndex]))
                changed = true;
            
            if(changed)
            {
                var tmp = tableData[rowIndex];
                tableData[rowIndex] = tableData[rowIndex + 1];
                tableData[rowIndex + 1] = tmp;
            }
        }
    }
    
    updateTable();
    console.log(new Date().getTime() - begTime);
}

// Updates the table
function updateTable()
{
    for(var rowIndex = 0; rowIndex < tableData.length; rowIndex++)
        for(var colIndex = 0; colIndex < maxCols; colIndex++)
            $table.rows[rowIndex].cells[colIndex].innerHTML = !!tableData[rowIndex][colIndex] ? tableData[rowIndex][colIndex] : "";
}

// Lazy to type "console.log()" a whole bunch
function print(str)
{
    console.log(str);
}