import * as chai from 'chai';
import {describe, it} from 'mocha';
import Promise from '../src/promise';
import * as sinon from 'sinon';
import sinonChai = require("sinon-chai")
chai.use(sinonChai);

const assert: any = chai.assert;

describe('Promise\'s', () => {
  it('是一个类', () => {
    assert.isFunction(Promise);
    assert.isObject(Promise.prototype);
  });

  it('new promise() 不传函数会报错', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise();
    });
  });

  it('new Promise(fn) 会生成一个对象，对象有 then 方法', () => {
    const promise = new Promise(() => {
    });
    assert.isFunction(promise.then);
  });

  it('new Promise(fn) 中的fn立即执行', () => {
    let fn = sinon.fake();
    new Promise(fn);
    assert(fn.called);
  });

  it('Promise 传入的fn，接受两个函数 resolve reject', (done) => {

    new Promise((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
      done();
    });
  });

  it('promise.then(success) 中的 success 会在 resolve 被调用的时候执行', (done) => {
    const success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      //该函数没有执行
      assert.isFalse(success.called);
      resolve();
      //@ts-ignore
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
        //	该函数执行了
      }, 0);
    });
    promise.then(success);
  });
});
