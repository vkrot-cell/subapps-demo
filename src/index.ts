if (navigator.serviceWorker) {
  console.log('index.ts: register service worker')
  const policy = window.trustedTypes!!.createPolicy('a', { createScriptURL: (url) => url });
  const url = policy.createScriptURL("/service_worker.js");
  navigator.serviceWorker.register(url as unknown as string);
}

const addCalculator = document.getElementById('buttonAddCalculator');
const openCalculator = document.getElementById('buttonOpenCalculator');

addCalculator!!.addEventListener('click', () => {
  navigator.subApps!!.add({ "/sub/calculator.html": { installURL: "/sub/calculator.html" } })
});
openCalculator!!.addEventListener('click', () => {
  window.open("/sub/calculator.html");
});

const setupDynamicApp = (appName: string) => {
  const capitalized = appName.charAt(0).toUpperCase() + appName.slice(1);

  const addDynamic = document.getElementById(`buttonAdd${capitalized}`);
  const openDynamic = document.getElementById(`buttonOpen${capitalized}`);

  addDynamic!!.addEventListener('click', () => {
    navigator.subApps!!.add({ [`/dynamic/${appName}/app.html`]: { installURL: `/dynamic/${appName}/app.html` } })
  });
  openDynamic!!.addEventListener('click', () => {
    window.open(`/dynamic/${appName}/app.html`);
  });
};

setupDynamicApp('word');
setupDynamicApp('notepad');
setupDynamicApp('photoshop');