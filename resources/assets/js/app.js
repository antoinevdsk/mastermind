window.Popper = require('popper.js').default;
require('bootstrap');
window.$ = window.jQuery = require('jquery');

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use( VueRouter );

Vue.component('mastermind', require('./components/mastermind.vue'));

var router = new VueRouter({
    mode: 'history',
    routes: []
});

var app = new Vue({
    router,
    el: '#app'
});