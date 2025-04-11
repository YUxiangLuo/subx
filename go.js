setTimeout(async () => {
    await Bun.$`firefox http://localhost:9090`;
}, 1000);
Bun.spawn(["sudo", "./out/sing-box",  "run",  "-c",  "./out/config.json"]);