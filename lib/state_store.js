'use strict';

const _ = require('lodash');
const async = require('async');
const constants = require('@containership/containership.cloud.constants');
const ContainershipAPI = require('@containership/containership.api-bridge');
const KubernetesAPI = require('@containership/containership.k8s.api-bridge');

const APIBridge = process.env.CS_ORCHESTRATOR === 'kubernetes' ? KubernetesAPI : ContainershipAPI;
const api = new APIBridge('localhost', 8080);

const state_store = {
    get_loadbalancers(callback) {
        return api.getDistributedKey(constants.myriad.LOADBALANCERS, callback);
    },

    get_firewalls(callback) {
        return api.getDistributedKey(constants.myriad.FIREWALLS, callback);
    },

    get_applications(callback) {
        return api.getApplications(callback);
    },

    subscribe_firewalls() {
        return api.subscribeDistributedKey(constants.myriad.FIREWALLS);
    },

    subscribe_loadbalancers() {
        return api.subscribeDistributedKey(constants.myriad.LOADBALANCERS);
    }
}

module.exports = state_store;
