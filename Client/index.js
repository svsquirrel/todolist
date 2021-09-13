document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderNavPane();
    displayPage(id = 'nav-0');
    renderPage( id = 'nav-0');
   
    fetch('http://localhost:5000/searchmyday')
    .then(response => response.json())
    .then(data => loadData(data['data']));
})


function getPageData(id){
    let page = ''
    
    if (id == 'nav-0'){
        page = 'searchmyday';
    } else if (id == 'nav-1'){
        page = 'getAll';
    }else if (id == 'nav-2'){
        page = 'searchimportant';
    }
    fetch ('http://localhost:5000/' + page)
    .then(response => response.json())
    .then(data => loadData(data['data']));
}
function loadData(data){
    const pagediv = document.querySelector('.pagediv');
    pagediv.innerHTML = '';

    data.forEach(function ({id, task, important}){
        const dataLine = document.createElement('div');
        const line = document.createElement('p');
        const importanticon = document.createElement('div');
        const deleteicon = document.createElement('div');
        const editicon = document.createElement('div');

        dataLine.classList.add('dataLine')
        line.classList.add('line')
        importanticon.classList.add('material-icons', 'impValue');
        deleteicon.classList.add('material-icons', 'deleterequest');
        editicon.classList.add('material-icons', 'editrequest');

        line.textContent = `${ task }`;
        line.dataset.id = `${ id }`;
        importanticon.value = `${ important }`;
        importanticon.innerHTML = 'star_border';
            if (importanticon.value ==0){
                importanticon.innerHTML = 'star_border';
            }else if (importanticon.value ==1){
                importanticon.innerHTML = 'star';
            }
        deleteicon.innerHTML = 'delete_outlined';
        deleteicon.dataset.id = `${ id }`;
        editicon.innerHTML = 'edit';
        editicon.dataset.id = `${ id }`;

        deleteicon.addEventListener('click', () => {
            deleteRowById(id);
        }); 

        dataLine.appendChild(line);
        dataLine.appendChild(importanticon);
        dataLine.appendChild(deleteicon);
        dataLine.appendChild(editicon);
        pagediv.appendChild(dataLine);
    });
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
          .then(data => loadData(data['data']));

    //loadHTMLTable();
}

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
            updateSection.hidden = true;
            fetch('http://localhost:5000/getAll')
                  .then(response => response.json())
                  .then(data => loadData(data['data']));
        
            loadData();
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
                  .then(data => loadData(data['data']));
        
           // loadData();
        }
    });
}

