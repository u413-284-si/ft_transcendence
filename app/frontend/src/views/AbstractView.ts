export default class {
	constructor() {
	}

	setTitle(title: string) {
		document.title = title;
	}

	async createHTML() {
		return "";
	}

	async updateHTML() {
		document.querySelector("#app")!.innerHTML = await this.createHTML();
	}

	async render() {

	}
}