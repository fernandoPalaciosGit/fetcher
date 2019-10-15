/* eslint-disable no-restricted-properties */
const Fetcher = require('od-modules/utils/fetcher');
const URL_REQUEST = '/travel/test';
const SUCCESS_RESPONSE = {results: [{name: 'hotel_one'}]};
const HTTP_PARAMS_REQUEST = {
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
};
const CLIENT_PARAMS_REQUEST = {order: 'olset'};
const getParamRequests = (params = {}) => (Object.assign({}, HTTP_PARAMS_REQUEST, params));
const mockApiResponse = (successRequest = true, {response = {}, status = 200}) => ({
    ok: successRequest,
    json: () => Promise.resolve(response),
    status,
    url: URL_REQUEST,
});

describe('Test Fetcher http requests from windows.fetch', () => {
    afterEach(() => {
        sinon.restore();
    });

    context('on request success', () => {
        beforeEach(() => {
            sinon.stub(window, 'fetch').resolves(mockApiResponse(true, {response: SUCCESS_RESPONSE}));
        });

        it('Should launch get', async() => {
            const response = await Fetcher.get(URL_REQUEST).json();
            sinon.assert.calledOnce(window.fetch);
            sinon.assert.calledWithExactly(window.fetch, URL_REQUEST, getParamRequests({
                method: 'GET',
            }));
            expect(response).to.be.eql(SUCCESS_RESPONSE);
        });

        it('Should launch put', async() => {
            const response = await Fetcher.put(URL_REQUEST, CLIENT_PARAMS_REQUEST).json();
            sinon.assert.calledOnce(window.fetch);
            sinon.assert.calledWithExactly(window.fetch, URL_REQUEST, getParamRequests({
                method: 'PUT',
                body: JSON.stringify(CLIENT_PARAMS_REQUEST),
            }));
            expect(response).to.be.eql(SUCCESS_RESPONSE);
        });

        it('Should launch post', async() => {
            const response = await Fetcher.post(URL_REQUEST, CLIENT_PARAMS_REQUEST).json();
            sinon.assert.calledOnce(window.fetch);
            sinon.assert.calledWithExactly(window.fetch, URL_REQUEST, getParamRequests({
                method: 'POST',
                body: JSON.stringify(CLIENT_PARAMS_REQUEST),
            }));
            expect(response).to.be.eql(SUCCESS_RESPONSE);
        });
    });

    context('on request failed should call Odigeo.Utils.loggerMessage', () => {
        const STATUS_FAIL = 404;
        const ERROR_MESSAGE = `Request: '${URL_REQUEST}', status: ${STATUS_FAIL}`;

        beforeEach(() => {
            sinon.stub(window, 'fetch').resolves(mockApiResponse(false, {status: STATUS_FAIL}));
            sinon.replace(Odigeo.Utils, 'loggerMessage', sinon.fake());
        });

        const checkLogger = () => {
            sinon.assert.calledOnce(Odigeo.Utils.loggerMessage);
            sinon.assert.calledWithExactly(Odigeo.Utils.loggerMessage, ERROR_MESSAGE);
        };

        const checkError = ({status, url, ok}) => {
            expect(status).to.be.eql(STATUS_FAIL);
            expect(url).to.be.contains(URL_REQUEST);
            expect(ok).to.be.false;
        };

        it('When launch get', () => {
            Fetcher.get(URL_REQUEST).json()
                .catch((error) => {
                    checkLogger();
                    checkError(error);
                });
        });

        it('When launch put', () => {
            Fetcher.put(URL_REQUEST, CLIENT_PARAMS_REQUEST).json()
                .catch((error) => {
                    checkLogger();
                    checkError(error);
                });
        });

        it('When launch post', () => {
            Fetcher.post(URL_REQUEST, CLIENT_PARAMS_REQUEST).json()
                .catch((error) => {
                    checkLogger();
                    checkError(error);
                });
        });
    });
});
