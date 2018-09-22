import swal from 'sweetalert2';
const SERVER_URL = process.env.NODE_ENV === "production" ? "https://tiremanapi.devjoe.net" : "http://localhost:8000";
let TOKEN = null;
let OFFLINE_MODE = false;

const electron = window.require('electron');

function __(path) {
    if(!path.startsWith("/")) path = "/" + path;
    return SERVER_URL + path;
}

function fetchFromCache(name) {
    return electron.ipcRenderer.sendSync('get_cache', name);
}

function setCache(name, data) {
    console.log("Set new cache for \"" + name + "\". ", data);
    return electron.ipcRenderer.sendSync('set_cache', [name, data]);
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
            .catch(e => {
                OFFLINE_MODE = true;
                console.log("Operating in offline mode.");
                swal("This client is now operating in offline mode.");
                res({laravel: null, offline_mode: true});
            })
            .then((j) => {
                res(j);
            });
    });
}

export function isOffline() {
    return OFFLINE_MODE;
}

export function attemptLogin(email, password) {
    if(OFFLINE_MODE) {
        console.log("Not processing login - In offline mode.");
        return new Promise((res, rej) => {
            res({code: 400, message: "This client is operating in offline mode. Sign-in is not possible."});
        });
    }
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

function processRequestQueue() {
    let request_queue = fetchFromCache("rqueue");
    if(request_queue.length === 0) return;
    console.log("[Request Queue] Syncing offline data with server");
    let c = 1;
    request_queue.forEach((e) => {
        let num = c + "";
        if(e.options.headers === undefined) e.options.headers = {Authorization: "Basic " + TOKEN};
        else e.options.headers.Authorization = "Basic " + TOKEN;
        e.options.method = e.method;
        fetch(__(e.path), e.options).then((ee) => {
            console.log("[Request Queue] [" + num + "/" + request_queue.length + "] " + e.method + " " + e.path, ee);
        }).catch(e => console.error(e));
        c++;
    });
    setCache("rqueue", []);
}

function addToRequestQueue(path, method = "GET", options = {}) {
    let queue = fetchFromCache("rqueue");
    queue.push({path: path, method: method, options: options});
    setCache("rqueue", queue);
}

function downloadTiresCache() {
    fetch(__("/tires"), authHeader()).then(e => e.json())
        .catch(e => console.error(e))
        .then((j) => {
            console.log("Set new tire cache. ", j.tires);
            electron.ipcRenderer.sendSync('set_cache', ['tires', {max_age: j.cache_exp, tires: j.tires}]);
        });
}

function downloadCutsCache() {
    fetch(__("/cuts"), authHeader()).then(e => e.json())
        .catch(e => console.error(e))
        .then((j) => {
            setCache("cuts", j.cuts);
        });
}

export function setApiToken(token) {
    TOKEN = token;
    window.localStorage.token = token;

    // Download necessary caches
    let request_queue = fetchFromCache("rqueue");
    if(request_queue == null) {
        setCache("rqueue", []);
    }
    if(token != null && !OFFLINE_MODE) {
        getUser().then((e) => {
            if(e.code !== 200) return;
            downloadTiresCache();
            downloadCutsCache();
            processRequestQueue();
        });
    }
}

export function getUser() {
    if(OFFLINE_MODE) return new Promise((res, rej) => {
        if(TOKEN != null && TOKEN !== "null")
            res({code: 200, user: {name: "[OFFLINE]"}});
        else
            res({code: 401});
    });
    return new Promise((res, rej) => {
        fetch(__("/auth/user"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function getTire(serial, includearchived=false) {
    if(OFFLINE_MODE) return new Promise((res, rej) => {
        if(includearchived) return res({code: 404});
        let cache = fetchFromCache('tires');
        let resu = cache.tires.find((e) => e.serial === serial);
        if(resu === undefined) return res({code: 404});
        res({code: 200, tire: resu})
    });
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + (includearchived ? '?inc_archived=1' : '')), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function getTag(serial) {
    if(OFFLINE_MODE) return new Promise((res, rej) => {
        res({code: 200, image: null});
    });
    return new Promise((res, rej) => {
        fetch(__("/tires/" + encodeURIComponent(serial) + "/tag"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                res(j);
            });
    });
}

export function deleteTire(serial) {
    let tires = fetchFromCache("tires");
    let t = tires.tires.find((e) => e.serial === serial);
    let i = tires.tires.indexOf(t);
    tires.tires.splice(i, 1);
    setCache("tires", tires);
    if(OFFLINE_MODE) {
        addToRequestQueue("/tires/" + encodeURIComponent(serial), "DELETE");
        return;
    }
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
    //
    let tires = fetchFromCache("tires");
    let tire = tires.tires.find((e) => e.serial === serial);
    let keys = Object.keys(json);
    keys.forEach((e) => {
        tire[e] = json[e];
    });
    setCache("tires", tires);
    //
    if(OFFLINE_MODE) {
        addToRequestQueue("/tires/" + encodeURIComponent(serial), "PATCH", defopts);
        return;
    }
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
    //
    let tires = fetchFromCache("tires");
    let tire = tires.tires.find((e) => e.serial === serial);
    if(add) tire.race_count++;
    else tire.race_count--;
    setCache("tires", tires);
    //
    if(OFFLINE_MODE) {
        addToRequestQueue("/tires/" + encodeURIComponent(serial) + (add ? "/increment" : "/decrement"), "POST", defopts);
        return;
    }
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
                downloadTiresCache();
            });
    });
}

export function fetchCutTemplates() {
    if(OFFLINE_MODE) return new Promise((res, rej) => {
        let cache = fetchFromCache("templates");
        if(cache === null) return res({code: 200, templates: []});
        res({code: 200, templates: cache});
    });
    return new Promise((res, rej) => {
        fetch(__("/cuts/templates"), authHeader()).then(e => e.json())
            .catch(e => rej(e))
            .then((j) => {
                setCache("templates", j.templates);
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
                downloadCutsCache();
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
                downloadCutsCache();
            });
    });
}

export function fetchTireCuts(serial) {
    if(OFFLINE_MODE) return new Promise((res, rej) => {
        let cache = fetchFromCache("cuts");
        if(cache == null) return res({code: 200, cuts: [{id: -1, name: "-- NOT AVAILABLE --"}]});
        let resu = cache.filter((e) => e.tire !== null).filter((e) => e.tire.serial === serial);
        if(resu == null) return res({code: 200, cuts: []});
        res({code: 200, cuts: resu});
    });
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
                downloadCutsCache();
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
                downloadTiresCache();
            });
    });
}