if (navigator.serviceWorker) {
  console.log('index.ts: register service worker')
  const policy = window.trustedTypes!!.createPolicy('a', { createScriptURL: (url) => url });
  const url = policy.createScriptURL("/service_worker.js");
  navigator.serviceWorker.register(url as unknown as string);
}

const addCalculator = document.getElementById('buttonAddCalculator');
const openCalculator = document.getElementById('buttonOpenCalculator');

addCalculator!!.addEventListener('click', () => {
  navigator.subApps!!.add({ "/sub/calculator.html?a=b": { installURL: "/sub/calculator.html" } })
});
openCalculator!!.addEventListener('click', () => {
  window.open("/sub/calculator.html?a=b");
});

const setupDynamicApp = (appName: string) => {
  const capitalized = appName.charAt(0).toUpperCase() + appName.slice(1);

  const addDynamic = document.getElementById(`buttonAdd${capitalized}`);
  const openDynamic = document.getElementById(`buttonOpen${capitalized}`);

  addDynamic!!.addEventListener('click', () => {
    navigator.subApps!!.add({ [`/dynamic/${appName}.html`]: { installURL: `/dynamic/${appName}.html` } })
  });
  openDynamic!!.addEventListener('click', () => {
    window.open(`/dynamic/${appName}.html`);
  });
};

setupDynamicApp('word');
setupDynamicApp('notepad');
setupDynamicApp('photoshop');