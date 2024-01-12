let searchLogin = document.getElementById("searchLogin");
let userAvatar = document.getElementById("userAvatar");
let userUrlGithubElem = document.getElementById("userUrlGithub");
let userBlog = document.getElementById("userBlog");
let userName = document.getElementById("userName");
let userLogin = document.getElementById("userLogin");
let userCity = document.getElementById("userCity");
let userEmail = document.getElementById("userEmail");
let userFollowers = document.getElementById("userFollowers");
let userFollowing = document.getElementById("userFollowing");

searchLogin.addEventListener("keypress", keyPress);
document.getElementById("brnSearch").addEventListener("click", searchBtn);

const method = "GET";
const url = "https://api.github.com/users/{userLogin}";
const urlGithub = "https://github.com/{userLogin}";


function checkEmptyData(data, nameData) {
    return !data ? `No ${nameData}` : data;
}

function checkSearchInput() {
    if (searchLogin.value !== "") {
        requestResponseHandler();  // обработчик ответа запроса
    }
    else {
        alert("You didn't enter anything!");
    }
}


function searchBtn() {
    checkSearchInput();
}

function keyPress(e) {
    // если нажат enter
    if (["NumpadEnter", "Enter"].includes(e.code)) {
        checkSearchInput();
    }
}

function sendRequest(method, url, body=null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = "json";
        xhr.onload = () => {
            if (xhr.status > 400) {
                reject(xhr.status);
            }
            else {
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => { reject(xhr.status); };
        xhr.send(JSON.stringify(body));
    });
}

function requestResponseHandler() {
    // заменяем шаблонную строку url на url с логином пользователя
    const userUrl = url.replace("{userLogin}", searchLogin.value);

    // отправляем запрос и обрабатываем ответ
    sendRequest(method, userUrl)
        .then(data => parseData(data))
        .catch(err => {
            const strError = (err == "404") ? "No such url exists!" : err;
            alert(strError);
        });
}

function parseData(userObj) {
    console.log(userObj);

    // аватарка
    if (userObj.avatar_url) {
        userAvatar.src = userObj.avatar_url;
    }

    // имя
    userName.innerText = userObj.name;

    // логин
    userLogin.innerText = userObj.login;

    // url гитхаба
    const userUrlGithub = urlGithub.replace("{userLogin}", searchLogin.value);
    userUrlGithubElem.innerText = userUrlGithub;
    userUrlGithubElem.href = userUrlGithub;

    // блог
    userBlog.innerText = checkEmptyData(userObj.blog, "blog")
    userBlog.addEventListener("click", (event) => event.preventDefault());
    userBlog.classList.add("disabled-link");

    // город
    let location = userObj.location;
    let city = checkEmptyData(location, "city");
    city = (city === location) ? location.substr(0, location.indexOf(",")) : city;
    userCity.innerText = city;

    // email
    userEmail.innerText = checkEmptyData(userObj.email, "email");

    // подписчики
    userFollowers.innerText = userObj.followers;

    // подписки
    userFollowing.innerText = userObj.following;
}
