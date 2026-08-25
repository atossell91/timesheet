import { App } from './app.js'

async function init() {
    const app = new App();
    await app.run();
}

document.addEventListener("DOMContentLoaded", async () => {
    init();
});
