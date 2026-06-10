if (navigator.serviceWorker) {
  console.log('index.ts: register service worker')
  const policy = window.trustedTypes!!.createPolicy('a', { createScriptURL: (url) => url });
  const url = policy.createScriptURL("/service_worker.js");
  navigator.serviceWorker.register(url as unknown as string);
}

const addCalculator = document.getElementById('buttonAddCalculator');
const openCalculator = document.getElementById('buttonOpenCalculator');
const removeCalculator = document.getElementById('buttonRemoveCalculator');

addCalculator!!.addEventListener('click', () => {
  navigator.subApps!!.add({ "/sub/calculator.html": { installURL: "/sub/calculator.html" } })
});
removeCalculator!!.addEventListener('click', () => {
  navigator.subApps!!.remove(["/sub/calculator.html"]);
});
openCalculator!!.addEventListener('click', () => {
  window.open("/sub/calculator.html");
});

const dynamicSubApps = ['word', 'notepad', 'photoshop'];

const setupDynamicApp = (appName: string) => {
  const capitalized = appName.charAt(0).toUpperCase() + appName.slice(1);

  const addDynamic = document.getElementById(`buttonAdd${capitalized}`);
  const openDynamic = document.getElementById(`buttonOpen${capitalized}`);
  const removeDynamic = document.getElementById(`buttonRemove${capitalized}`);
  const startUrl = `/dynamic/${appName}/app.html`

  addDynamic!!.addEventListener('click', () => {
    navigator.subApps!!.add({[startUrl]: {installURL: startUrl}})
  });
  removeDynamic!!.addEventListener('click', () => {
    navigator.subApps!!.remove([startUrl])
  });
  openDynamic!!.addEventListener('click', () => {
    window.open(startUrl);
  });
};

for (const appName of dynamicSubApps) {
  setupDynamicApp(appName);
}

const addAll = document.getElementById('buttonAddAll');
addAll!!.addEventListener('click', () => {

  let subAppAdds: Record<string, { installURL: string }> = {
    "/sub2/calculator.html": { installURL: "/sub2/calculator.html" },
    "/sub/calculator.html": { installURL: "/sub/calculator.html" } 
  };

  for (const appName of dynamicSubApps) {
    const startUrl = `/dynamic/${appName}/app.html`
    subAppAdds[startUrl] = { installURL: startUrl };
  }

  navigator.subApps!!.add(subAppAdds);
});

const removeAll = document.getElementById('buttonRemoveAll');
removeAll!!.addEventListener('click', () => {
  let subAppStartUrls = ["/sub2/calculator.html", "/sub/calculator.html", ];
  for (const appName of dynamicSubApps) {
    subAppStartUrls.push(`/dynamic/${appName}/app.html`);
  }

  navigator.subApps!!.remove(subAppStartUrls);
});

const listAll = document.getElementById('buttonListAll');
listAll!!.addEventListener('click', () => {
  navigator.subApps!!.list().then((res) => {
    console.log(JSON.stringify(res));
  })
});