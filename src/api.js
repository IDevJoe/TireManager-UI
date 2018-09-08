const SERVER_URL = "https://tiremanapi.devjoe.net";

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