document.getElementById('window-permission').addEventListener('click', () => {
  window.getScreenDetails().then((screenDetails) => {
    console.log(screenDetails);
  }).catch((error) => {
    console.log(error);
  });
});

if ('launchQueue' in window) {
    launchQueue.setConsumer(async (launchParams) => {
        if (!launchParams.files || launchParams.files.length === 0) {
            return;
        }
        const fileHandle = launchParams.files[0];
        const file = await fileHandle.getFile();
        const reader = file.stream().getReader();
        const decoder = new TextDecoder('utf-8');
        const fileContentElement = document.getElementById('file-content');
        let content = '';

        async function readStream() {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    fileContentElement.textContent = content;
                    break;
                }
                content += decoder.decode(value, { stream: true });
                const lines = content.split('\n');
                if (lines.length > 10) {
                    content = lines.slice(0, 10).join('\n');
                    fileContentElement.textContent = content;
                    await reader.cancel();
                    break;
                }
            }
        }
        await readStream();
    });
}
