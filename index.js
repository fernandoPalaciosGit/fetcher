const Request = require('./http_request');

const get = () => ({
    credentials: 'same-origin',
    method: 'GET',
});
const post = (requestParams) => ({
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(requestParams),
});
const put = (requestParams) => ({
    credentials: 'same-origin',
    method: 'PUT',
    body: JSON.stringify(requestParams),
});


class Fetcher {
    static get(url) {
        return new Request(url, get());
    }

    static post(url, requestParams = {}) {
        return new Request(url, post(requestParams));
    }

    static put(url, requestParams = {}) {
        return new Request(url, put(requestParams));
    }
}

module.exports = Fetcher;
