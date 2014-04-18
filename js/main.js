var tableData;
var sortOrders;
var fileName = "";
var $table;
var $tableContainer;

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
    $tableContainer = document.getElementById("tableContainer");
    var rows = tableData.length;
    var cols = tableData[0].length;
    $table = document.createElement("table");
    $table.setAttribute("id", "table");
    
    for(var rowIndex = 0; rowIndex < rows; rowIndex++)
    {
        var newRow = document.createElement("tr");
        
        for(var colIndex = 0; colIndex < cols; colIndex++)
        {
            var newCol = document.createElement("td");
            
            if(rowIndex === 0)
            {
                newCol = document.createElement("th");
                newCol.style.fontWeight = "bold";
                newCol.id = colIndex;
            }
            
            if(rowIndex % 2 !== 0)
                newCol.classList.add("darkGray");;
            
            newCol.style.border = "1px solid black";
            newCol.style.textAlign = "center";
            newCol.style.paddingLeft = "3px";
            newCol.style.paddingRight = "3px";
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
}

function getCsvToArray(csvData)
{
    var csvArray = csvData.split("\n");
    
    if(csvArray[csvArray.length - 1] === "")
        csvArray.pop();
    
    for(var index in csvArray)
        csvArray[index] = csvArray[index].split(",");
    
    return csvArray;
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
function processFile(data)
{
    tableData = getCsvToArray(data);
    sortOrders = [];
    
    for(var m in tableData)
        sortOrders.push(false);
    
    makeTable();
    $("#fileTitle")[0].innerHTML = fileName;
}

function sortRows(columnIndex, bigFirst)
{
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
    
    makeTable();
}

// Lazy to type "console.log()" a whole bunch
function print(str)
{
    console.log(str);
}