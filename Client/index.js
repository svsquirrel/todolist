

document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderNavPane();
    displayPage(id = 'nav-0');
    renderPage( id = 'nav-0');
    getMyDay();
    getTasks();
    getImportant();

    fetch('http://localhost:5000/searchmyday')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
})
    
  
//Load appropriate data for each page that is requested
function getMyDay(){
const tasksall = document.querySelector('#nav-0');
tasksall.addEventListener('click', () => {
    fetch('http://localhost:5000/searchmyday')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
})
}
function getTasks(){
    const tasksall = document.querySelector('#nav-1');
    tasksall.addEventListener('click', () => {
        fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
    })
    }
function getImportant(){
    const tasksall = document.querySelector('#nav-2');
    tasksall.addEventListener('click', () => {
        fetch('http://localhost:5000/searchimportant')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
    })
    }


 //READ
function loadHTMLTable(data){
    const table = document.querySelector('table tbody');
    
    if (data.length === 0) {
        table.innerHTML = '<tr><td class = "no-data" colspan ="5">No Data</td></tr>';
        return;
    }
    
    let tableHtml = '';

    data.forEach(function ({id, date_added, task, important, myday}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`
        tableHtml += `<td>${new Date(date_added).toLocaleString().split(',')[0]}</td>`
        tableHtml += `<td>${task}</td>`
        tableHtml += `<td>${ important }</td>`
        tableHtml += `<td>${ myday }</td>`
        // tableHtml += `<td>${note}</td>`
        //tableHtml += `<td>${ duedate }</td>`
        //tableHtml += `<td>${ complete }</td>`
        tableHtml += `<td><button class = 'delete-row-btn' data-id = ${ id }>Delete</td>`
        tableHtml += `<td><button class='edit-row-btn' data-id=${ id }>Edit</td>`
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}


const form = document.querySelector('#popupForm');    
const cancelform = document.querySelector('.closeicon');
      cancelform.addEventListener('click', () => form.style.display='none');

//CREATE
const submit = document.querySelector('.submiticon');
submit.onclick = function() {
    form.style.display = 'none';
    const taskInput = document.querySelector('.task');
    const task = taskInput.value;
    taskInput.value = '';

    const importantInput = document.querySelector('.starcheck');
    const importantvalue = importantInput.checked;
    
    if(importantvalue === true){
        importantInput.value = 1;
    }else if (importantvalue ===false){
        importantInput.value = 0;
    }
    importantvalue.checked = 'false';

    const mydayInput = document.querySelector('.checkAddDay');
    const mydayvalue = mydayInput.checked;

    if(mydayvalue === true){
        mydayInput.value = 1;
    }else if (mydayvalue ===false){
        mydayInput.value = 0;
    }
    mydayvalue.checked = 'false';
    
    // const duedateInput = document.querySelector('#duedate');
    // const duedate = duedateInput.value;
    // duedateInput.value = '';
   
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
         body: JSON.stringify({
                task : task, 
                important : importantInput.value,
                myday: mydayInput.value
             })
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = '<tr>';

    for (var key in data){
        if(data.hasOwnProperty(key)) {
            if( key === 'dateAdded'){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${ data[key] }</td>`;
        }
    }

    tableHtml += `<td><button class ='delete-row-btn'  data-id = ${ data.id }>Delete</td>`
    tableHtml += `<td><button class='edit-row-btn' data-id=${ data.id }>Edit</td>`
    
    tableHtml += '</tr>';

    if (isTableData){
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }

    tableHtml = '';
    fetch('http://localhost:5000/getAll')
          .then(response => response.json())
          .then(data => loadHTMLTable(data['data']));

    loadHTMLTable();
}
//DELETE & UPDATE Event Listeners
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
       handleEditRow(event.target.dataset.id);
    }
});

//UPDATE
const updateBtn = document.querySelector('#update-row-btn');

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-task-input').dataset.id = id;
       
    updateBtn.addEventListener('click', () => {
        
    const updateTaskInput = document.querySelector('#update-task-input');
   
    fetch('http://localhost:5000/update', {
       
        method: "PATCH",  
        headers: { 
            'Content-type' : 'application/json'
         },
        body: JSON.stringify({ 
            id :  updateTaskInput.dataset.id,
            task: updateTaskInput.value
        })
    })
    
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            tableHtml = '';
            fetch('http://localhost:5000/getAll')
                  .then(response => response.json())
                  .then(data => loadHTMLTable(data['data']));
        
            loadHTMLTable();
        }
    })
    })

}
//DELETE
function deleteRowById(id){
    fetch('http://localhost:5000/delete/'+ id, {
        method: 'DELETE'
        })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            tableHtml = '';
            fetch('http://localhost:5000/getAll')
                  .then(response => response.json())
                  .then(data => loadHTMLTable(data['data']));
        
            loadHTMLTable();
        }
    });
}
//SEARCH MYDAY
const mydaysearch = function() {
  
    fetch('http://localhost:5000/searchmyday')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

//SEARCH IMPORTANT
const importantsearch = function() {
   
    fetch('http://localhost:5000/searchimportant')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


