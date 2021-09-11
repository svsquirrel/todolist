
 /***********USING GOOGLE ICONS FOR 'icon'*********/
 const navdata = [ 
                    {name:'My Day',   color: '#e9bd5f', icon:'wb_sunny',images: 'para.jpg',textcolor:'#3d4244' },
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
    console.log(navdata.id);
    const content = document.querySelector('.content');
    const pagediv = document.createElement('div');
          pagediv.classList.add('pagediv');
          pagediv.style.setProperty('--icolor', navcolor);
    
    content.appendChild(pagediv);
   
}

// function renderPages(design){
//     const content = document.querySelector('.content');
//     const pagediv = document.createElement('div');
//     const displaydiv = document.createElement('div');
    
//     const pageicondiv = document.createElement('div');
//     const pagetextdiv = document.createElement('div');
    
//         for(let i = 0; i<navdata.length; i++){
            
//             pageicondiv.innerHTML = navdata[i].icon;
//             pageicondiv.classList.add('pageiconbig','material-icons', 'md-32');
//             pageicondiv.style.setProperty('--icolor', navdata[i].color);
//             pagetextdiv.style.setProperty('--icolor', navdata[i].color);
//             pagetextdiv.classList.add('textbig');
//             pagetextdiv.textContent = design;
    
//             pagediv.classList.add('pagediv');
//             pagediv.classList.remove('content');
//             pagediv.id = design;
       
//             displaydiv.classList.add('display');
    
//             pagediv.appendChild(pageicondiv);
//             pagediv.appendChild(pagetextdiv);
    
//             content.appendChild(pagediv);
//             content.appendChild(displaydiv);
    
//             renderAdd();
//             };
//         };
    

function renderAdd(){
const content = document.querySelector('.content');
const addbox =  document.createElement('div');
const addtext = document.createElement('p');
const form = document.querySelector('#popupForm');

    addbox.classList.add('addbox');
    addbox.addEventListener('click', () => form.style.display = 'block');
    addtext.classList.add('addtext');
    addtext.textContent = 'Add a task';        

    addbox.appendChild(addtext);
    content.appendChild(addbox);
}

