class Promise1 {
	succeed: unknown = null
	fail: unknown = null

	resolve() {
		setTimeout(() => {
			console.log('this.succeed', this.succeed)
			// @ts-ignore
			this.succeed()
		}, 0)
	}

	reject() {
		setTimeout(() => {
			// @ts-ignore
			this.fail()
		}, 0)
	}

	constructor(fn: (resolve: () => void, reject: () => void) => void) {
		if (typeof fn !== 'function') {
			throw new Error('缺少函数')
		}

		fn(this.resolve.bind(this), this.reject.bind(this))
	}

	then(succeed?: () => void, fail?: () => void) {
		this.succeed = succeed || this.succeed
		this.fail = fail || this.fail
	}

}

export default Promise1