const SERVER_URL = "https://tiremanapi.devjoe.net";
let TOKEN = null;

function __(path) {
    if(!path.startsWith("/")) path = "/" + path;
    return SERVER_URL + path;
}

export function probeServer() {
    return new Promise((res, rej) => {
        fetch(__("/")).then((resp) => resp.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function attemptLogin(email, password) {
    return new Promise((res, rej) => {
        fetch(__("/auth"), {method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((res) => res.json()).catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

function authHeader() {
    return {
        headers: {
            Authorization: "Basic " + TOKEN
        }
    }
}

export function findToken() {
    if(TOKEN != null)
        return TOKEN;
    if(window.localStorage.token != null)
        return window.localStorage.token;

    return null;
}

export function setApiToken(token) {
    TOKEN = token;
    window.localStorage.token = token;
}

export function getUser() {
    return new Promise((res, rej) => {
        fetch(__("/auth/user"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });

}