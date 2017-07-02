'use strict';
const request_module = require('supertest');

module.exports.request = request_module('http://localhost:3000');