//should i make tool tips for the complete button
document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderNavPane();
    displayPageTab(id = 'nav-0');
    renderPage(id = 'nav-0');

    fetch('http://localhost:5000/searchmyday')
        .then(response => response.json())
        .then(data => loadData(data['data']));
})

function getPageData(id) {
    let page = ''
    if (id == 0) {
        page = 'searchmyday';
    } else if (id == 1) {
        page = 'getAll';
    } else if (id == 2) {
        page = 'searchimportant';
    }
    fetch('http://localhost:5000/' + page)
        .then(response => response.json())
        .then(data => loadData(data['data']));
}

function loadData(data) {
    const pagediv = document.querySelector('.pagediv');
    pagediv.innerHTML = '';

    data.forEach(function ({ id, task, important, duedate , complete}) {
        const dataLine = document.createElement('div');
        const completeIcon = document.createElement('div');
        const line = document.createElement('p');
        const dday = document.createElement('p');
        const importanticon = document.createElement('div');
        const deleteicon = document.createElement('div');
        const editicon = document.createElement('div');

        dataLine.classList.add('dataLine');
        completeIcon.classList.add('completeIcon', 'md-30', 'material-icons')
        line.classList.add('line');
        dday.classList.add('dday');
        importanticon.classList.add('material-icons', 'md-30', 'impValue');
        deleteicon.classList.add('material-icons', 'md-30', 'deleterequest');
        editicon.classList.add('material-icons', 'md-30', 'editrequest');

        completeIcon.dataset.id = `${ id }`;
        completeIcon.value = `${ complete }`;
            if (completeIcon.value =='0') {
                 completeIcon.innerHTML = 'radio_button_unchecked';
            } else if (completeIcon.value == '1') {
                completeIcon.innerHTML ='check_circle';
            }

        line.textContent = `${task}`;
        line.dataset.id = `${id}`;
            if ( `${duedate}`.split('T')[0]==='0000-00-00'){
                dday.innerHTML = '';
            }else { 
                dday.innerHTML ='Due ' + `${duedate}`.split('T')[0]
            };
        importanticon.value = `${important}`;
        if (importanticon.value =='0') {
            importanticon.innerHTML = 'star_border';
        } else if (importanticon.value == '1') {
            importanticon.innerHTML = 'star';
        }
        
        deleteicon.innerHTML = 'delete_outlined';
        deleteicon.dataset.id = `${id}`;
        editicon.innerHTML = 'edit';
        editicon.dataset.id = `${id}`;

        completeIcon.addEventListener('click', () => {
            changeToComplete(id, completeIcon.value);
        })
        importanticon.addEventListener('click', () => {
            toggleImportantStatus(id, importanticon.value);
        })
        deleteicon.addEventListener('click', () => {
            deleteRowById(id);
        });
        editicon.addEventListener('click', () => {
            handleEditRow(id);
        });

        dataLine.appendChild(completeIcon);
        dataLine.appendChild(line);
        dataLine.appendChild(dday);
        dataLine.appendChild(importanticon);
        dataLine.appendChild(deleteicon);
        dataLine.appendChild(editicon);
        pagediv.appendChild(dataLine);
    });
}

const form = document.querySelector('#popupForm');
const cancelform = document.querySelector('.closeicon');
cancelform.addEventListener('click', () => form.style.display = 'none');

//CREATE
const submit = document.querySelector('.submiticon');
submit.onclick = function () {
    const formPage = document.querySelector('.formContainer').dataset.id;

    form.style.display = 'none';
    const taskInput = document.querySelector('.task');
    const task = taskInput.value;
          taskInput.value = '';

    const importantInput = document.querySelector('.starcheck');
    const importantvalue = importantInput.checked;
          importantInput.checked = 'false';

    const mydayInput = document.querySelector('.checkAddDay');
    const mydayvalue = mydayInput.checked;
          mydayInput.checked = 'false';

    const duedateInput = document.querySelector('#duedate');
    const duedate = duedateInput.value;
          duedateInput.value = '';

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            task: task,
            important: importantvalue,
            myday: mydayvalue,
            duedate: duedate
        })
    })
        .then(response => response.json())
        .then(getPageData(formPage));
}

//UPDATE TASK
const updateBtn = document.querySelector('#update-row-btn');
const content = document.querySelector('.content');

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-task-input').dataset.id = id;

    updateBtn.addEventListener('click', () => {

        const updateTaskInput = document.querySelector('#update-task-input');

        fetch('http://localhost:5000/update', {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateTaskInput.dataset.id,
                task: updateTaskInput.value
            })
        })

            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    content.innerHTML = '';
                    updateSection.hidden = true;
                    fetch('http://localhost:5000/getAll')
                        .then(response => response.json())
                        .then(data => loadData(data['data']));
                }
            })
    })
}

//UPDATE IMPORTANT
function toggleImportantStatus(id,importantvalue) {
    const pageSrc = document.querySelector('.pagediv').dataset.id;
  
    let importantBoolean = importantvalue == 1 ? true : false ;
        importantBoolean = !importantBoolean;
      
    fetch('http://localhost:5000/updateimportant', {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            important: importantBoolean
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                getPageData(pageSrc);
            }
        });
}
//UPDATE COMPLETE
function changeToComplete(id, completeIconValue){
    
    const pageSrc = document.querySelector('.pagediv').dataset.id;
  
    let completeBoolean = completeIconValue == 1 ? true : false ;
        completeBoolean = !completeBoolean;
      
    fetch('http://localhost:5000/updatecomplete', {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            complete: completeBoolean
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                getPageData(pageSrc);
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
                content.innerHTML = '';
                fetch('http://localhost:5000/getAll')
                    .then(response => response.json())
                    .then(data => loadData(data['data']));
            }
        });
}

