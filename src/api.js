const SERVER_URL = "http://localhost:8000";
let TOKEN = null;

function __(path) {
    if(!path.startsWith("/")) path = "/" + path;
    return SERVER_URL + path;
}

export function parseValidation(firstState, validation) {
    let keys = Object.keys(validation);
    for(let k in keys) {
        let key = keys[k];
        firstState[key] = validation[key][0];
    }
    return firstState;
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

export function getTire(serial, includearchived=false) {
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + (includearchived ? '?inc_archived=1' : '')), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function getTag(serial) {
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + "/tag"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function deleteTire(serial) {
    let defopts = authHeader();
    defopts.method = "DELETE";
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial)), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function edit(serial, json) {
    let defopts = authHeader();
    defopts.method = "PATCH";
    defopts.headers["Content-Type"] = "application/json; charset=UTF-8";
    defopts.body = JSON.stringify(json);
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial)), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function modRaces(serial, add = true) {
    let defopts = authHeader();
    defopts.method = "POST";
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + (add ? "/increment" : "/decrement") ), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function registerTire(json) {
    let defopts = authHeader();
    defopts.method = "PUT";
    defopts.headers["Content-Type"] = "application/json; charset=UTF-8";
    defopts.body = JSON.stringify(json);
    return new Promise((res, rej) => {
        fetch(__("/tires"), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function fetchCutTemplates() {
    return new Promise((res, rej) => {
        fetch(__("/cuts/templates"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function deleteCut(id) {
    let defopts = authHeader();
    defopts.method = "DELETE";
    return new Promise((res, rej) => {
        fetch(__("/cuts/" + encodeURIComponent(id)), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function addCutTemplate(json) {
    if(json.name === "") return new Promise((res, rej) => {});
    let defopts = authHeader();
    defopts.method = "PUT";
    defopts.headers["Content-Type"] = "application/json; charset=UTF-8";
    defopts.body = JSON.stringify(json);
    return new Promise((res, rej) => {
        fetch(__("/cuts/templates"), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function fetchTireCuts(serial) {
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + "/cuts"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function addTireCut(serial, json) {
    if(json.name === "") return new Promise((res, rej) => {});
    let defopts = authHeader();
    defopts.method = "PUT";
    defopts.headers["Content-Type"] = "application/json; charset=UTF-8";
    defopts.body = JSON.stringify(json);
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + "/cuts"), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function recoverTire(serial) {
    let defopts = authHeader();
    defopts.method = "POST";
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + "/recover"), defopts).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}