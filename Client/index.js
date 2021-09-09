
document.addEventListener('DOMContentLoaded', function () {
    renderNavPane();
    renderPages('My Day');
    renderAdd();
    fetch('http://localhost:5000/getAll')
          .then(response => response.json())
          .then(data => loadHTMLTable(data['data']));
});

 
function loadHTMLTable(data){
    const table = document.querySelector('table tbody');
    
    if (data.length === 0) {
        table.innerHTML = '<tr><td class = "no-data" colspan ="5">No Data</td></tr>';
        return;
    }
    let tableHtml = '';

    data.forEach(function ({id, date_added, task}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td>${task}</td>`
        // tableHtml += `<td>${ important }</td>`
        // tableHtml += `<td>${ day }</td>`
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

    // const importantInput = document.querySelector('.starcheck');
    // const important = importantInput.checked;
    // importantInput.value = '';

    // const mydayInput = document.querySelector('.checkAddDay');
    // const myday = mydayInput.checked;
    // mydayInput.value = '';
    
    // const duedateInput = document.querySelector('#duedate');
    // const duedate = duedateInput.value;
    // duedateInput.value = '';
   
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
         body: JSON.stringify({ task : task})
          
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


