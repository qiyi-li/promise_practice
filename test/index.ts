import * as chai from "chai";
import {describe, it} from "mocha";
import Promise from "../src/promise";
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");

chai.use(sinonChai);

const assert: any = chai.assert;

describe("Promise's", () => {
	it("是一个类", () => {
		assert.isFunction(Promise);
		assert.isObject(Promise.prototype);
	});

	it("new promise() 不传函数会报错", () => {
		assert.throw(() => {
			// @ts-ignore
			new Promise();
		});
	});

	it("new Promise(fn) 会生成一个对象，对象有 then 方法", () => {
		const promise = new Promise(() => {
		});
		assert.isFunction(promise.then);
	});

	it("new Promise(fn) 中的fn立即执行", () => {
		let fn = sinon.fake();
		new Promise(fn);
		assert(fn.called);
	});

	it("Promise 传入的fn，接受两个函数 resolve reject", (done) => {

		new Promise((resolve, reject) => {
			assert.isFunction(resolve);
			assert.isFunction(reject);
			done();
		});
	});

	it("promise.then(success) 中的 success 会在 resolve 被调用的时候执行", (done) => {
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

	it("promise.then(null,fail) 中的 fail 会在 reject 被调用的时候执行", (done) => {
		const fail = sinon.fake();
		const promise = new Promise((resolve, reject) => {
			//该函数没有执行
			assert.isFalse(fail.called);
			reject();
			//@ts-ignore
			setTimeout(() => {
				assert.isTrue(fail.called);
				done();
				//	该函数执行了
			}, 0);
		});
		promise.then(null, fail);
	});

	it("then(success,fail) 中 success、fail 如果不是函数就忽略", () => {
		const promise = new Promise((resolve) => {
			resolve();
		});
		promise.then(null, null);
	});

	it("如果 success 是函数，必须在 promise 完成 fulfilled 后被调用，并且把promise的值作为第一个参数；此函数在promise完成之前绝对不能被调用；此函数绝对不能被调用超过一次", (done) => {
		const succeed = sinon.fake();
		const promise = new Promise((resolve) => {
			assert.isFalse(succeed.called);
			resolve(233);
			resolve(233);
			setTimeout(() => {
				assert(promise.state === "fulfilled");
				assert.isTrue(succeed.calledOnce);
				assert(succeed.calledWith(233));
				done();
			}, 0);
		});
		promise.then(succeed);
	});

	it("如果 fail 是函数，必须在 promise 完成 rejected 后被调用，并且把promise的值作为第一个参数；此函数在promise完成之前绝对不能被调用；此函数绝对不能被调用超过一次", (done) => {
		const fail = sinon.fake();
		const promise = new Promise((resolve, reject) => {
			assert.isFalse(fail.called);
			reject(233);
			reject(233);
			setTimeout(() => {
				assert(promise.state === "rejected");
				assert.isTrue(fail.calledOnce);
				assert(fail.calledWith(233));
				done();
			}, 0);
		});
		promise.then(null, fail);
	});

	it("再代码执行完毕之前，不得调用then传入的两个函数", (done) => {
		const succeed = sinon.fake();
		const promise = new Promise((resolve) => {
			resolve();
		});
		promise.then(succeed);
		assert.isFalse(succeed.called);
		setTimeout(() => {
			assert.isTrue(succeed.called);
			done();
		}, 0);
	});

	it("再代码执行完毕之前，不得调用then传入的两个函数", (done) => {
		const fail = sinon.fake();
		const promise = new Promise((resolve, reject) => {
			reject();
		});
		promise.then(null, fail);
		assert.isFalse(fail.called);
		setTimeout(() => {
			assert.isTrue(fail.called);
			done();
		}, 0);
	});

	it("this是undefined", (done) => {
		const promise = new Promise((resolve) => {
			resolve();
		});
		promise.then(() => {
			"use strict";
			console.log("this", this);
			assert(this === undefined);
			done();
		});
	});

	it("then 可以在同一个 promise 里被多次调用", (done) => {
		const promise = new Promise((resolve, reject) => {
			resolve();
		});
		const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
		promise.then(callbacks[0]);
		promise.then(callbacks[1]);
		promise.then(callbacks[2]);
		setTimeout(() => {
			assert(callbacks[0].called);
			assert(callbacks[1].called);
			assert(callbacks[2].called);
			assert(callbacks[1].calledAfter(callbacks[0]));
			assert(callbacks[2].calledAfter(callbacks[1]));
			done();
		}, 0);
	});

	it("then 必须返回一个promise", () => {
		const promise = new Promise((resolve) => {
			resolve();
		});
		const promiseReturn = promise.then(() => {
		});
		assert(promiseReturn instanceof Promise);
	});

	it("如果 then(success,fail) 中的 success 返回一个值 x ，则运行 [[Resolve]](promise2, x)", () => {

	});
});
