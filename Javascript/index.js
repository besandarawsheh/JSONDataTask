window.addEventListener('load', function() {
    console.log('All assets are loaded');
    showData()
    .catch(error =>{ alert(error);});
    let paginationLinks=document.getElementById(pagination);
    paginateLinks().catch(error => this.alert(error));
});

let pageNumber={
    num:1,
    getPageNum(){
        pageNum=this.num;
        return pageNum;
    },
    setPageNum(num){
        this.num=num || 1;
    }
}
const apiURL="https://reqres.in/api/users";
const usersLocations=[{lat:31.900445,lng:35.211745},{lat:31.904453,lng:35.203037},{lat:31.899800,lng:35.208879},{lat:31.899727,lng:35.196525},{lat:31.905822,lng:35.205268},{lat:31.904014,lng:35.203890
},{lat:31.901935,lng:35.208190},{lat:31.905578,lng:35.203111},{lat:31.904748,lng:35.201910},{lat:31.904973,lng:35.205854}];
// let user={
//     id:
// }

async function showData (){
    let users = await getUsersList("GET",`${apiURL}?page=2&per_page=4`);
    let allUsers=await getUsersList("GET",`${apiURL}?per_page=12`);
    let usersObj=JSON.parse(users).data;
    let allUsersList=JSON.parse(allUsers).data;
    let usersList= document.getElementById("users-list");
    let usersTable= document.getElementById("usersTableBody");
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
            showProfile(id)});
    }
    for (x in usersObj) {
        let id= usersObj[x].id;
        let row = document.createElement('tr');
        let col1 = document.createElement('td');
        let col2 = document.createElement('td');
        let col3 = document.createElement('td');
        col1.textContent=usersObj[x].email;
        col2.textContent=usersObj[x].first_name;
        col3.textContent=usersObj[x].last_name;
        row.append(col1,col2,col3);
        usersTable.appendChild(row);
        row.addEventListener('click',function(){
            showProfile(id);
            initMap(id);
        
        });
        //console.log(usersObj[location]);
    }
    setLocations(usersObj);
}

function getUsersList (method,url){
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
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

async function showProfile(id){
    let user = await getUsersList("GET",`${apiURL}/${id}`);
    let userObj=JSON.parse(user);
    let profile=document.getElementById("userProfile");
    //profile.classList.remove('d-none');
    profile.style.display=flex;
    return profile;
    console.log(`element ${id} is clicked`);
}
function infoWindowContent(id){
    //return showProfile(id)
}
var displayedLocations=[];
function setLocations(usersObj){
    //let locations = await getUsersList("GET",apiURL);
    let j=0;
    
    for (x in usersObj){
        if(usersObj[x].id==11||usersObj[x].id==12){
            usersObj[x].location=usersLocations[0];
            displayedLocations.push({location:usersLocations[0],name:`${usersObj[x].first_name} ${usersObj[x].last_name}`,ID:usersObj[x].id});
        }
        else{
            usersObj[x].location=usersLocations[usersObj[x].id -1];
            displayedLocations.push({location:usersLocations[usersObj[x].id -1],name:`${usersObj[x].first_name} ${usersObj[x].last_name}`,ID:usersObj[x].id})
        }
        //console.log(usersObj[x].location);
        initMap();
    }
}
function initMap(){
    let infowindow =  new google.maps.InfoWindow({});
    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:displayedLocations[0].location.lat,lng:displayedLocations[0].location.lng},
        zoom: 14
    });
    //add markers to users locations
    var marker, x;
    for (x in displayedLocations) {
        marker = new google.maps.Marker({
        position: new google.maps.LatLng(displayedLocations[x].location.lat, displayedLocations[x].location.lng),
        map: map,
        title: displayedLocations[x].name
        });	 
        google.maps.event.addListener(marker,'click',(function(marker){
            return function(){
                //var content=infoWindowContent(displayedLocations[x].ID);
                infowindow.setContent("content");
                infowindow.open(map,marker);
            }
        })(marker));
    }//for     

    return;
}

async function paginateLinks(){
    
}