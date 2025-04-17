await Bun.$`sudo rm ./cache.db`;
Bun.spawn(["sudo", "./out/sing-box", "run", "-c", "./out/config.json"]);
