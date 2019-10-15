/* eslint-disable no-restricted-properties */
const Request = require('od-modules/utils/fetcher/http_request');
const HOTEL_INFO_HTML = '<div>hotel_info</div>';
const HOTEL_INFO_JSON = {hotel: HOTEL_INFO_HTML};
const mockApiResponse = (response) => ({
    ok: true,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(response),
});
const testHeaders = () => ({
    method: 'GET',
    headers: {
        'Content-Type': 'text/html;charset=UTF-8',
    },
});

describe('Test Http Request module', () => {
    let request;
    let response;

    afterEach(() => {
        sinon.restore();
    });

    context('Should request different Content Types', () => {
        it('Should return a Promise that resolves json', async() => {
            response = mockApiResponse(HOTEL_INFO_JSON);
            sinon.spy(response, 'json');
            sinon.stub(window, 'fetch').resolves(response);
            request = new Request();
            const result = await request.json();
            sinon.assert.calledOnce(window.fetch);
            sinon.assert.calledOnce(response.json);
            expect(result).to.be.equal(HOTEL_INFO_JSON);
        });

        it('Should return a Promise that resolves USVString object (text)', async() => {
            response = mockApiResponse(HOTEL_INFO_HTML);
            sinon.spy(response, 'text');
            sinon.stub(window, 'fetch').resolves(response);
            request = new Request();
            const result = await request.text();
            sinon.assert.calledOnce(window.fetch);
            sinon.assert.calledOnce(response.text);
            expect(result).to.be.equal(HOTEL_INFO_HTML);
        });
    });

    it('Should change headers before request', async() => {
        response = mockApiResponse(HOTEL_INFO_JSON);
        sinon.stub(window, 'fetch').resolves(response);
        request = new Request();
        await request.headers({method: 'GET'}).text();
        sinon.assert.calledWithExactly(window.fetch, sinon.match.any, testHeaders());
    });
});
