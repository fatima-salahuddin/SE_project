const http = require('http');

const sellerId = 1; // Assuming seller ID 1 exists
const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/sellers/${sellerId}/products`,
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:');
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
