'use strict';

const nginx = require('./lib/nginx');
const state_store = require('./lib/state_store');

function start_nginx(callback) {
    nginx.write_config((err) => {
        if (err) {
            process.stderr.write(`${err.message}\n`);
        } else {
            nginx.start();
        }

        if(callback) {
            return callback();
        }
    });
}

start_nginx(() => {
    const subscribers = {
        firewalls: state_store.subscribe_firewalls(),
        loadbalancers: state_store.subscribe_loadbalancers()
    };

    let coalescing = false;

    const propagate_updates = () => {
        if(!coalescing) {
            setTimeout(() => {
                coalescing = false;
                start_nginx();
            }, process.env.SUBSCRIBE_COALESCING_INTERVAL || 1000);

            coalescing = true;
        }
    };

    subscribers.firewalls.on('message', propagate_updates);
    subscribers.loadbalancers.on('message', propagate_updates);
});
