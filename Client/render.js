
 /***********USING GOOGLE ICONS FOR 'icon'*********/
 const navdata = [ 
                    {name:'My Day',   color: '#e9bd5f', icon:'wb_sunny' },
                    {name:'Tasks',    color: '#6a53f0', icon:'home'},
                    {name:'Important',color: '#e940e9', icon:'star_border'},
                    {name:'Planned',  color: '#2fb1b1', icon:'calendar_today'},
                    {name:'Lists',    color: '#aaa4a4', icon:'add'}
];

function renderNavPane() {
    const navarea = document.querySelector('.navarea');
    const content = document.querySelector('.content');
        for (let i = 0; i< navdata.length; i++){
    
            const navname = navdata[i].name;
            const navicon = navdata[i].icon;
            const navcolor= navdata[i].color;
    
            const newdiv = document.createElement('div');
            newdiv.classList.add('navdiv');
            newdiv.id = 'nav-'+[i];
            newdiv.style.setProperty('--ihover', navcolor);
            newdiv.addEventListener('click', () => {
                content.innerHTML='';
                displayPage(newdiv.id);
                renderPage(newdiv.id);
            })
               
            const newicon = document.createElement('div');
            const newtext = document.createElement('div');
    
            newicon.classList.add('material-icons', 'md-36', 'iconcolor');
            newicon.style.setProperty('--icolor', navcolor);
            newicon.innerHTML = navicon;
            newtext.classList.add('navtext');
            newtext.textContent = navname;
    
            newdiv.appendChild(newicon);
            newdiv.appendChild(newtext);
    
            navarea.appendChild(newdiv);
        }; 

    }
function displayPage(id){
    
    const thisdiv = document.getElementById(id);
    
    const divs = document.querySelectorAll('.navdiv');
    divs.forEach(div =>{
        div.classList.remove('active');
        thisdiv.classList.add('active');
    });
}

function renderPage(id){
    id = parseInt(id.substring(4)) ;
    navdata.id = id;
    
    const navcolor = navdata[id].color;
    const sidediv = document.querySelector('.sidediv');
   
    const addbtn =  document.createElement('button');
          addbtn.classList.add('addbtn');
          addbtn.textContent = 'Add a task'; 
          addbtn.style.setProperty('--icolor',navcolor);
          addbtn.addEventListener('click', displayTaskForm);
          sidediv.appendChild(addbtn);
    
    const pagediv = document.querySelector('.pagediv');
    pagediv.style.setProperty('--icolor', navcolor);     
 
}
function displayTaskForm(){
    const form = document.querySelector('#popupForm');
    const inputs = document.getElementsByTagName('input');
    for (var i in inputs)
        if (inputs[i].type == 'checkbox')inputs[i].checked = false;
    form.style.display = 'block';

}

