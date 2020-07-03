let jsonFile;
let jsonFileConstant;
let filters = [];


function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

// Callback
loadJSON(function(response) {
    jsonFile = JSON.parse(response);
    jsonFileConstant = JSON.parse(response);
    loadHTML(jsonFile);
});


//initial load html
const tagNew = `<a href="" class="new">New!</a>`;
const tagFeatured = `<a href="" class="featured">Featured</a>`;
const elementContent = document.querySelector('.cards');
const elementFilter = document.querySelector('.filters-seacrh');
const filterEl = document.querySelector('.filter');


function loadHTML(json){
    elementContent.innerHTML = '';
    json.forEach(element => {
        let htmlCard = `<div class="card">
                            <img src="LOGO">
                            <div class="job">
                                <div class="job-bussiness">
                                    <h4 class="bussiness">TITLE_BUSSINESS</h4>
                                    JOB_NEW
                                    JOB_FEAUTURED
                                </div>                                
                                <h2 class="job-title">
                                    TITLE_JOB
                                </h2>
                                <div class="job-details">
                                    <ul>
                                        TAG_JOB_DETAILS
                                    </ul>
                                </div>
                            </div>
                            <div class="skills">
                                TAG_SKILLS
                            </div>
                        </div>`;

        htmlCard = htmlCard.replace('LOGO', element.logo);
        htmlCard = htmlCard.replace('TITLE_BUSSINESS', element.company);
        htmlCard = htmlCard.replace('TITLE_JOB', element.position);

        if (element.new) {
            htmlCard = htmlCard.replace(`JOB_NEW`, tagNew);
        } else { 
            htmlCard = htmlCard.replace('JOB_NEW', ''); 
        }

        if (element.featured) {
            htmlCard = htmlCard.replace('JOB_FEAUTURED', tagFeatured);
        } else { 
            htmlCard = htmlCard.replace('JOB_FEAUTURED', ''); 
        }

        let jobDetails = '';
        jobDetails += `<li>${element.postedAt}</li>`;
        jobDetails += `<li>${element.contract}</li>`;
        jobDetails += `<li>${element.location}</li>`;
        htmlCard = htmlCard.replace('TAG_JOB_DETAILS', jobDetails); 

        let skillDetails = '';
        skillDetails += `<a onclick="addFilter(this, 'role')">${element.role}</a>`;
        skillDetails += `<a onclick="addFilter(this, 'level')">${element.level}</a>`;
        element.languages.forEach(language => {
            skillDetails += `<a onclick="addFilter(this, 'language')">${language}</a>`;
        });
        element.tools.forEach(tool => {
            skillDetails += `<a onclick="addFilter(this, 'tool')">${tool}</a>`;
        });
        htmlCard = htmlCard.replace('TAG_SKILLS', skillDetails); 
        elementContent.insertAdjacentHTML('beforeend', htmlCard);
    });
}

function addFilter(obj, tag){
    const skillFilter = obj.innerHTML;

    if (filters.length === 0) {
        filters.push({
            value: skillFilter,
            tag
        });  
    }
    else {
        const findLen = filters.findIndex(el => el.value === skillFilter);
        if (findLen === -1) {
            filters.push({
                value: skillFilter,
                tag
            });  
        } 
    }    
    console.log(filters);
    //call
    callFilter();
}

function deleteFilter(value){
    filters = filters.filter(val => val.value !== value);
    callFilter();
}

function clearAll(){
    filters = [];
    callFilter();
}

function callFilter(){
    elementFilter.innerHTML = '';
    filterEl.style.display = "none";
    elementContent.classList.remove("relative-cards");
    if (filters.length !== 0){
        filters.forEach(x => {
            let filter = `<div class="filter-text">
                            <div class="text">${x.value}</div>
                            <div class="image" onclick="deleteFilter('${x.value}')"><img src="images/icon-remove.svg" alt=""></div>
                        </div>`;  
            elementFilter.insertAdjacentHTML('beforeend', filter);        
        }); 
        filterEl.style.display = "flex";
        elementContent.classList.add("relative-cards");
    }
    callFilterJSON();
}


function callFilterJSON(){
    if (filters.length === 0){
        loadHTML(jsonFileConstant);
        return;
    }  
    let newJsonFile = jsonFileConstant;
    filters.forEach(obj => {
        if (obj.tag === 'role') {
            newJsonFile = newJsonFile.filter(json => json.role === obj.value);
        }
        if (obj.tag === 'level') {
            newJsonFile = newJsonFile.filter(json => json.level === obj.value);
        }
        if (obj.tag === 'language') {
            newJsonFile = newJsonFile.filter(json => {
                if (json.languages.length > 0){
                    if (json.languages.includes(obj.value)) return json;
                }
            });
        }
        if (obj.tag === 'tool') {
            newJsonFile = newJsonFile.filter(json => {
                if (json.tools.length > 0) {
                    if (json.tools.includes(obj.value)) return json;
                }
            });
        }
    });
    loadHTML(newJsonFile);
}