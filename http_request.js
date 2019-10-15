const getJsonHeaders = () => ({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});
const getTextHeaders = () => ({
    headers: {
        'Content-Type': 'text/html;charset=UTF-8',
    },
});
const getErrorMessage = ({url, status}) => `Request: '${url}', status: ${status}`;
const checkStatus = (response) => {
    if (response.ok) {
        return response;
    } else {
        Odigeo.Utils.loggerMessage(getErrorMessage(response));
        return Promise.reject(response);
    }
};
// eslint-disable-next-line no-restricted-properties
const request = (url, params) => window.fetch(url, params)
    .then((response) => checkStatus(response));

class Request {
    constructor(url, httpParams = {}) {
        this.url = url;
        this.httpParams = httpParams;
    }

    json() {
        return request(this.url, {...this.httpParams, ...getJsonHeaders()})
            .then((response) => response.json());
    }

    text() {
        return request(this.url, {...this.httpParams, ...getTextHeaders()})
            .then((response) => response.text());
    }

    headers(headers = {}) {
        Object.assign(this.httpParams, headers);
        return this;
    }
}

module.exports = Request;
