if (navigator.serviceWorker) {
  console.log('index.ts: register service worker')
  const policy = window.trustedTypes!!.createPolicy('a', { createScriptURL: (url) => url });
  const url = policy.createScriptURL("/service_worker.js");
  navigator.serviceWorker.register(url as unknown as string);
}

const appNameMap: Record<string, string> = {
  "/sub/calculator.html": "CalculatorFirst",
  "/sub2/calculator.html": "Calculator2",
  "/dynamic/word/app.html": "Word",
  "/dynamic/notepad/app.html": "Notepad",
  "/dynamic/photoshop/app.html": "Photoshop",
};

async function getManifestId(installUrl: string): Promise<string> {
  const storedId = localStorage.getItem(`manifestId:${installUrl}`);
  if (storedId) {
    return storedId;
  }

  try {
    const listResult = await window.subApps!!.list();
    const expectedName = appNameMap[installUrl];
    if (expectedName) {
      for (const [manifestId, info] of Object.entries(listResult)) {
        if (info.appName.startsWith(expectedName) || info.appName === expectedName) {
          localStorage.setItem(`manifestId:${installUrl}`, manifestId);
          return manifestId;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  return installUrl;
}

function handleAdd(installUrls: string[]) {
  window.subApps!!.add(installUrls)
    .then((response) => {
      for (const error of Object.values(response.failedApps)) {
        console.log(error);
      }
      for (const [url, manifestId] of Object.entries(response.installedApps)) {
        localStorage.setItem(`manifestId:${url}`, manifestId);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function handleRemove(installUrls: string[]) {
  const manifestIds: string[] = [];
  for (const url of installUrls) {
    const manifestId = await getManifestId(url);
    manifestIds.push(manifestId);
  }

  window.subApps!!.remove(manifestIds)
    .then((response) => {
      for (const error of Object.values(response.failedApps)) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const addCalculator = document.getElementById('buttonAddCalculator');
const openCalculator = document.getElementById('buttonOpenCalculator');
const removeCalculator = document.getElementById('buttonRemoveCalculator');

addCalculator!!.addEventListener('click', () => {
  handleAdd(["/sub/calculator.html"]);
});
removeCalculator!!.addEventListener('click', () => {
  handleRemove(["/sub/calculator.html"]);
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
  const updateCheckbox = document.getElementById(`checkboxUpdate${capitalized}`) as HTMLInputElement;
  const startUrl = `/dynamic/${appName}/app.html`

  addDynamic!!.addEventListener('click', () => {
    handleAdd([startUrl]);
  });
  removeDynamic!!.addEventListener('click', () => {
    handleRemove([startUrl]);
  });
  openDynamic!!.addEventListener('click', () => {
    window.open(startUrl);
  });

  updateCheckbox!!.addEventListener('change', () => {
    const state = updateCheckbox.checked ? 'updated' : 'original';
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'SET_TITLE',
            appName: appName,
            state: state
          });
        }
      });
    }
  });
};

for (const appName of dynamicSubApps) {
  setupDynamicApp(appName);
}

const addAll = document.getElementById('buttonAddAll');
addAll!!.addEventListener('click', () => {
  const subAppUrls = [
    "/sub2/calculator.html",
    "/sub/calculator.html"
  ];
  for (const appName of dynamicSubApps) {
    subAppUrls.push(`/dynamic/${appName}/app.html`);
  }
  handleAdd(subAppUrls);
});

const removeAll = document.getElementById('buttonRemoveAll');
removeAll!!.addEventListener('click', () => {
  const subAppUrls = [
    "/sub2/calculator.html",
    "/sub/calculator.html"
  ];
  for (const appName of dynamicSubApps) {
    subAppUrls.push(`/dynamic/${appName}/app.html`);
  }
  handleRemove(subAppUrls);
});

const listAll = document.getElementById('buttonListAll');
const listAllOutput = document.getElementById('listAllOutput');
listAll!!.addEventListener('click', () => {
  window.subApps!!.list()
    .then((res) => {
      listAllOutput!!.textContent = JSON.stringify(res);
    })
    .catch((err) => {
      console.log(err);
    });
});