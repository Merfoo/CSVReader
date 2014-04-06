var tableData;
var fileName = "";

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
    var tableContainer = document.getElementById("tableContainer");
    var rows = tableData.length;
    var cols = tableData[0].length;
    var table = document.createElement("table");
    
    for(var rowIndex = 0; rowIndex < rows; rowIndex++)
    {
        var newRow = document.createElement("tr");
        
        for(var colIndex = 0; colIndex < cols; colIndex++)
        {
            var newCol = document.createElement("td");
            
            if(rowIndex == 0)
            {
                newCol = document.createElement("th");
                newCol.style.fontWeight = "bold";
                newCol.id = colIndex;
            }
            
            if(rowIndex % 2 != 0)
                newCol.classList.add("darkGray");;
            
            newCol.style.border = "1px solid black";
            newCol.style.textAlign = "center";
            newCol.style.paddingLeft = "10px";
            newCol.style.paddingRight = "10px";
            newCol.innerText = !!tableData[rowIndex][colIndex] ? tableData[rowIndex][colIndex] : "";
            newRow.appendChild(newCol);
        }
        
        table.appendChild(newRow);
    }
    
    print(table);
    
    tableContainer.innerHTML = table.outerHTML;
}

function getCsvToArray(csvData)
{
    var csvArray = csvData.split("\n");
    
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
    makeTable();
    $("#fileTitle")[0].innerHTML = fileName;
}

// Lazy to type "console.log()" a whole bunch
function print(str)
{
    console.log(str);
}