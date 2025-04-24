'use strict';
/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
const {
    validate
} = require("../dist/helpers");
const {
    required,
    rule,
    length,
} = require('../dist/rules');

const http = require("http");
const host = '0.0.0.0';
const port = 1234;

const server = http.createServer(function(req, resp) {
    function headers(contenType) {
        return  {
            'Access-Control-Allow-Origin': '*', 
            'Content-Type': contenType
        };
    }

    function Ok() {
        resp.writeHead(200, headers('text/plain'));
        resp.end('Ok');
    }

    if (req.method == 'GET') {
        Ok();
        return;
    }

    if (req.method == 'OPTIONS') {
        resp.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': 86400,
        });
        resp.end('');
        return;
    }

    let data = "";
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        if (req.url == '/check-password') {
            try {
                data = JSON.parse(data);
                const errors = validatePassword.bind(data)();
                if (Object.keys(errors).length > 0) {
                    resp.writeHead(400, headers('application/json'));
                    resp.end(JSON.stringify(errors));
                    return;
                }
            }
            catch (err) {
                console.log('error: ', err);
                resp.writeHead(400, headers('text/plain'));
                resp.end('An error happened!!!');
                return;
            }
        }
        Ok();
    });
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

function validatePassword() {
    const errors = {};
    const _validate = (value, rules, inputName) => {
        const errMsg = validate(value, rules, inputName);
        if (typeof(errMsg) == 'string') {
            errors[inputName] = errMsg;
            return false;
        }
        return true;
    };
    const valids = {
        password: false,
    };
    
    const rules = {
        password: [
            required,
            length(8),
            rule(
                value => {
                    return /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z\d\s]/.test(value);
                },
                'The password must contain capital and non capital letter, number and non-alphanumeric characters'
            ),
        ],
        confirmPassword: [
            required.if(() => valids.password),
            rule(
                value => this.password === value,
                'must be the same as `Password` above'
            ),
        ],
    };
    
    for (let inputName in rules) {
        valids[inputName] = _validate(this[inputName], rules[inputName], inputName);
    }

    return errors;
}