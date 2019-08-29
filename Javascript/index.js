window.addEventListener('load', function() {
    console.log('All assets are loaded');
    showData().then(response =>{
        createElementsForData(response);
    })
    .catch(error => console.log(error););

    
});

const apiURL="https://reqres.in/api/users";
async function showData (){
    let users = await getUsersList("GET",apiURL);
    //console.log(usersObj.data[0].id);
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