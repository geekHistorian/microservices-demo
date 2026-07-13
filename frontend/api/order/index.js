const http = require('http');

module.exports = async function (context, req) {
    return new Promise((resolve, reject) => {
        const postData = req.body ? JSON.stringify(req.body) : '';

        const options = {
            hostname: '68.155.193.56',
            port: 80,
            path: '/order',
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const backendReq = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => { 
                data += chunk; 
            });
            
            res.on('end', () => {
                let parsed;
                try { 
                    parsed = JSON.parse(data); 
                } catch(e) { 
                    parsed = data; 
                }
                
                context.res = { 
                    status: res.statusCode, 
                    body: parsed 
                };
                resolve();
            });
        });

        backendReq.on('error', (e) => {
            context.res = { 
                status: 500, 
                body: { error: "Failed to connect to Order Service: " + e.message } 
            };
            resolve();
        });

        backendReq.write(postData);
        backendReq.end();
    });
};
