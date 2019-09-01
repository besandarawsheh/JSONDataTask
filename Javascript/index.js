window.addEventListener('load', function() {
    console.log('All assets are loaded');
    showData()
    .catch(error =>{ alert(error);});
});

const apiURL="https://reqres.in/api/users";
async function showData (){
    let users = await getUsersList("GET",`${apiURL}?per_page=4`);
    //let allUsers=await getUsersList("GET",`${apiURL}?per_page=12`);
    let usersObj=JSON.parse(users).data;
    //let allUsersList=JSON.parse(allUsers).data;
    let usersList= document.getElementById("users-list");
    let usersTable= document.getElementById("usersTableBody");
    // for (i in allUsersList){
    //     let element =document.createElement('li');
    //     let userfullName =document.createElement('span');
    //     let userImg = document.createElement('img');
    //     userImg.src=allUsersList[i].avatar;
    //     userfullName.textContent=`${allUsersList[i].first_name} ${allUsersList[i].last_name}`;
    //     element.append(userImg,userfullName);
    //     usersList.appendChild(element);
    // }
    for (x in usersObj) {
        ///fill usersList with data
        let element =document.createElement('li');
        let userfullName =document.createElement('span');
        let userImg = document.createElement('img');
        userImg.src=usersObj[x].avatar;
        userfullName.textContent=`${usersObj[x].first_name} ${usersObj[x].last_name}`;
        element.append(userImg,userfullName);
        usersList.appendChild(element);
        ///Fill table with data
        let row =document.createElement('tr');
        let col1 = document.createElement('td');
        let col2 = document.createElement('td');
        let col3 = document.createElement('td');
        col1.textContent=usersObj[x].email;
        col2.textContent=usersObj[x].first_name;
        col3.textContent=usersObj[x].last_name;
        row.append(col1,col2,col3);
        usersTable.appendChild(row);
    }
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