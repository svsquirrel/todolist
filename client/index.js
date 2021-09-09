document.addEventListener('DOMContentLoaded', function () {
      fetch('http://localhost:5000/getAll')
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']));
});

//DELETE & UPDATE Event Listeners
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});



//CREATE
const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = '';
    
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name })
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

}

//READ
//if no data, have table row that says no data
function loadHTMLTable(data){
    const table = document.querySelector('table tbody');
    
    if (data.length === 0) {
        table.innerHTML = '<tr><td class = "no-data" colspan ="5">No Data</td></tr>';
        return;
    }

    let tableHtml = '';

    data.forEach(function ({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`
        tableHtml += `<td>${name}</td>`
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td><button class = 'delete-row-btn' data-id = ${ id }>Delete</td>`
        tableHtml += `<td><button class='edit-row-btn' data-id=${ id }>Edit</td>`
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

//UPDATE
const updateBtn = document.querySelector('#update-row-btn');

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id
    console.log(document.querySelector('#update-row-btn').dataset.id);
}
    
updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');
    
    fetch('http://localhost:5000/update', {
        headers: { 
            'Content-type' : 'application/json'
         },
        method: 'PATCH',  
        body: JSON.stringify({ 
            id:   updateNameInput.dataset.id,
            name: updateNameInput.value
         })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
// should hide HTML and update page.To refresh the data without 
//reloading the page we need to rebuild the table each time in 
//javascript and then render it to the dom. 
        }
    });
}
//DELETE

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

//SEARCH
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

