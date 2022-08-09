class Promise1 {
	state = "pending"; //pending fulfilled rejected
	callbacks = [];

	resolve(result) {
		setTimeout(() => {
			if (this.state !== "pending") {
				return;
			}
			this.state = "fulfilled";
			this.callbacks.forEach(handle => {
				const succeed = handle[0];
				if (typeof succeed === "function") {
					const x = succeed.call(undefined, result);
					handle[2].resolveWidth(x);
				}
			});
		}, 0);
	}

	reject(reason) {
		setTimeout(() => {
			if (this.state !== "pending") {
				return;
			}
			this.state = "rejected";
			this.callbacks.forEach(handle => {
				const fail = handle[1];
				if (typeof fail === "function") {
					const x = fail.call(undefined, reason);
					handle[2].resolveWidth(x);
				}
			});
		}, 0);
	}

	constructor(fn: (resolve: (result?) => void, reject: (reason?) => void) => void) {
		if (typeof fn !== "function") {
			throw new Error("缺少函数");
		}

		fn(this.resolve.bind(this), this.reject.bind(this));
	}

	then(succeed?: () => void, fail?: () => void) {
		const handle = [];
		if (typeof succeed === "function") {
			handle[0] = succeed;
		}
		if (typeof fail === "function") {
			handle[1] = fail;
		}
		handle[2] = new Promise1(() => {
		});
		this.callbacks.push(handle);
		return handle[2];
	}

	resolveWidth(x) {
		if (this === x) {
			return this.reject(new TypeError());
		}

	}

}

export default Promise1;