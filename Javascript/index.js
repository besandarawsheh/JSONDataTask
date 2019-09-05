window.addEventListener('load', function() {
    console.log('All assets are loaded');
    
    showTable(pagination.current_page,pagination.per_page).catch(error =>{ console.log(error);});
    showMenu().catch(error=>console.log(error));
    //let paginationLinks=document.getElementById(pagination);
    paginateLinks().catch(error => console.log(error));
    //initMap().catch(error=>this.console.log(error));
});
const apiURL="https://reqres.in/api/users";
var map,displayedLocations=[];
const usersLocations=[
    {lat:31.900445,lng:35.211745},
    {lat:31.904453,lng:35.203037},
    {lat:31.899800,lng:35.208879},
    {lat:31.899727,lng:35.196525},
    {lat:31.905822,lng:35.205268},
    {lat:31.904014,lng:35.203890},
    {lat:31.901935,lng:35.208190},
    {lat:31.905578,lng:35.203111},
    {lat:31.904748,lng:35.201910},
    {lat:31.904973,lng:35.205854}];//usersLocations
var pagination={
    page:1,
    per_page:4,
    total_pages:Math.ceil(this.total/this.per_page),
    total:12,
    current_page:1,
    first_page:1,
    last_page:this.total_pages,
    max_shown_pages:3
}//pagination
async function showMenu(){
    let allUsers = await getUsersList("GET",`${apiURL}?per_page=12`);
    let allUsersList=JSON.parse(allUsers).data;
    let usersList= document.getElementById("users-list");
    for (i in allUsersList){
        let element =document.createElement('li');
        let userfullName =document.createElement('span');
        let userImg = document.createElement('img');
        userImg.src=allUsersList[i].avatar;
        userfullName.textContent=`${allUsersList[i].first_name} ${allUsersList[i].last_name}`;
        element.append(userImg,userfullName);
        usersList.appendChild(element);
        let id=allUsersList[i].id;
        element.addEventListener('click',function(){
            //showProfile(id)});
        });
    }//for
}//showMenu
async function showTable (pageIndex,per_page){
    let users = await getUsersList("GET",`${apiURL}?page=${pageIndex}&per_page=${per_page}`);
    let usersObj=JSON.parse(users).data;
    let loader=document.getElementById("loader");
    loader.classList.add("hide-loader");
    let usersTable= document.getElementById("usersTableBody");
    let rows= usersTable.children;
    console.log(usersObj);
    for (x=0;x<per_page;x++) {
        let id= usersObj[x].id;
        var col1,col2,col3;
        if (rows.length<=per_page){
            var row = document.createElement('tr');
            row.id=`row-${x}`;
            col1 = document.createElement('td');
            col2 = document.createElement('td');
            col3 = document.createElement('td');
            col1.id=`col-1${x}`;
            col2.id=`col-2${x}`;
            col3.id=`col-3${x}`;
            row.append(col1,col2,col3);
            usersTable.appendChild(row);
        }//if
        else{
            row=document.getElementById(`row-${x}`);
            col1=document.getElementById(`col-1${x}`);
            col2=document.getElementById(`col-2${x}`);
            col3=document.getElementById(`col-3${x}`);
            console.log(col1,col2,col3);
        }//else
        col1.textContent=usersObj[x].email;
        col2.textContent=usersObj[x].first_name;
        col3.textContent=usersObj[x].last_name;
        
        (function(x){
            row.addEventListener('click',function(){
                changeMapCenter(displayedLocations[x].location.lat,displayedLocations[x].location.lng,17);
            });
        }(x));
    }//for
    //setLocations(usersObj);
}//showTable
function getUsersList (method,url){
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              //setTimeout(()=>resolve(xhr.response),5000);
              resolve(xhr.response);
            }//if 
            else {
                reject(this.status);
            }//else
        };//onload
        xhr.onerror = function () {
            reject(this.status);
        };//onerror
        xhr.send();
    });//promise
}//getUsersList 
function setLocations(){
    //let locations = await getUsersList("GET",apiURL);
    return new Promise( async function (resolve, reject) {
        let users = await getUsersList("GET",`${apiURL}?page=${pagination.current_page}&per_page=4`);
        let usersObj =JSON.parse(users).data;
        let j=0;
        displayedLocations.length=0;
        for (x in usersObj){
            if(usersObj[x].id==11||usersObj[x].id==12){
                usersObj[x].location=usersLocations[0];
                displayedLocations.push({location:usersLocations[0],name:`${usersObj[x].first_name} ${usersObj[x].last_name}`,ID:usersObj[x].id});
            }//if
            else{
                usersObj[x].location=usersLocations[usersObj[x].id -1];
                displayedLocations.push({location:usersLocations[usersObj[x].id -1],name:`${usersObj[x].first_name} ${usersObj[x].last_name}`,ID:usersObj[x].id})
            }//else
        }//for
        resolve(displayedLocations);
    });//returned promise
}//setLocations
async function initMap(){
    let displayedLocations= await setLocations();
    console.log(displayedLocations[0].location.lat);
    let infowindow = new google.maps.InfoWindow({});
    map = new google.maps.Map(document.getElementById('map'));
    changeMapCenter(displayedLocations[0].location.lat,displayedLocations[0].location.lng,14);
    console.log(map.getZoom());
    //add markers to users locations
    var marker, x;
    for (x in displayedLocations) {
        marker = new google.maps.Marker({
        position: new google.maps.LatLng(displayedLocations[x].location.lat, displayedLocations[x].location.lng),
        map: map,
        title: displayedLocations[x].name
        });//marker	 
        //add listener to the marker
        google.maps.event.addListener(marker,'click',(function(marker,x){
            return async function () {
                //console.log(displayedLocations[x].ID);
                let user = await getUser(`${apiURL}/${displayedLocations[x].ID}`).catch(error=>console.log(error));
                let content=document.createElement('div');
                content.classList="d-flex flex-column align-items-center p-1";
                let keys =Object.keys(user.data);
                for(var i=0; i<keys.length-1; i++){
                    var key = keys[i];
                    //console.log(key, yourObject[key]);
                    let userdata =document.createElement('div');
                    userdata.classList="d-flex space-between my-1";
                    let userDataTitle=document.createElement('span');
                    let userDataDescription=document.createElement('span');
                    userDataTitle.textContent=key;
                    userDataDescription.textContent=user.data[key];
                    userdata.append(userDataTitle,userDataDescription);
                    content.appendChild(userdata);
                }//for
                infowindow.setContent(content);
                infowindow.open(map, marker);
                return user;
            }//returned function
         })(marker,x));//marker listener
    }//for     
    //return;
}//initmap
function changeMapCenter(Lat,Lng,Zoom){
    map.setCenter({
		lat : Lat,
		lng : Lng
    });
    map.setZoom(Zoom);
}//changeMapCenter
async function paginateLinks(){
    let list=document.getElementById("pagination");
    let listItems=list.children;
    for (i=0;i<listItems.length;i++){
        (function(i){
            listItems[i].addEventListener("click",function(){
            let index=pagination.current_page;
            //make prev page index not active
            var prevElement=document.getElementsByClassName("active-link");
            prevElement[0].classList.toggle("active-link");
            ///toggle active class for current clicked page index
            switch(listItems[i].id){
                case "first":
                    var firstElem=document.getElementById("one");
                    firstElem.classList.toggle("active-link");
                    if(index==1){
                        break;
                    }
                    showTable(1,4);
                    initMap();
                    pagination.current_page=1;
                    break;
                case "last":
                    var lastElem=document.getElementById("three");
                    lastElem.classList.toggle("active-link");
                    if(index==3){
                        break;
                    }
                    showTable(3,4);
                    initMap();
                    pagination.current_page=3;
                    break;
                case "prevPage":
                    if(index==1){
                        listItems[i+1].classList.toggle("active-link");
                        break;
                    }
                    listItems[index].classList.toggle("active-link");
                    console.log(listItems[index].id+"Here I'm");
                    showTable(listItems[index].textContent,4);
                    initMap();
                    //showPage(listItems[index].id);
                    pagination.current_page=index-1;
                    break;
                case "nextPage":
                        if(index==3){
                            listItems[index+1].classList.toggle("active-link");
                            break;
                        }
                        else{
                            listItems[index+2].classList.toggle("active-link");
                            showTable(listItems[index+2].textContent,4);
                            initMap();
                            //showPage(listItems[index+2].id);
                            pagination.current_page=index+1;
                        }
                    break;

                default:
                    listItems[i].classList.toggle("active-link");
                    pagination.current_page=listItems[i].textContent;
                    showTable(listItems[i].textContent,4);
                    initMap();
                    //showPage(listItems[i].id);
            }//switch
        });}(i));//closure
    }//for
}//paginateLinks
async function getUser (url){
    let user= await getUsersList("GET",url);
    let result = JSON.parse(user);
    return result;
}//getUser