// const test = require('ava')
// let mod = require('../src/add.js')
import { add } from '../src/add';
// import test from 'ava';


// test('foo', t => {
//   if(mod.add(3, 4) === 7)
//     t.pass()
// })

var assert = require('assert');
// var add = require('../src/add.js')
// import assert from 'assert';

describe('add', function () {
    it('should add to numbers from an es module', function () {
      assert.equal(add(3,4), 7);
    });
});
