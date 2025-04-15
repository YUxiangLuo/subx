import { sleep } from "bun";

await generate_direct_list();
await generate_reject_list();

async function generate_reject_list() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/reject-list.txt",
  );
  const text = await res.text();

  // difficult to type my data, so give any to it
  const rule_set: any = {
    rules: [
      {
        domain: [],
        domain_suffix: [],
        domain_regex: [],
      },
    ],
    version: 3,
  };

  await Bun.write(import.meta.dir + "/reject-list.txt", text);
  const items = text.split("\n");
  for (const item of items) {
    if (item.startsWith("full:")) {
      rule_set.rules[0].domain.push(item.replace("full:", ""));
    } else if (item.startsWith("regexp:")) {
      rule_set.rules[0].domain_regex.push(item.replace("regexp:", ""));
    } else {
      if (item) rule_set.rules[0].domain_suffix.push(item);
    }
  }
  await Bun.write(
    import.meta.dir + "/reject-list.json",
    JSON.stringify(rule_set),
  );
  sleep(1000);
  await Bun.$`/home/alice/pros/subx/out/sing-box rule-set compile --output /home/alice/pros/subx/rule/reject.srs /home/alice/pros/subx/rule/reject-list.json`;
}

async function generate_direct_list() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/direct-list.txt",
  );
  const text = await res.text();

  // difficult to type my data, so give any to it
  const rule_set: any = {
    rules: [
      {
        domain: [],
        domain_suffix: [".cn"],
        domain_regex: [],
      },
    ],
    version: 3,
  };

  await Bun.write(import.meta.dir + "/direct-list.txt", text);
  const items = text.split("\n");
  for (const item of items) {
    if (item.startsWith("full:")) {
      rule_set.rules[0].domain.push(item.replace("full:", ""));
    } else if (item.startsWith("regexp:")) {
      rule_set.rules[0].domain_regex.push(item.replace("regexp:", ""));
    } else {
      if (item) rule_set.rules[0].domain_suffix.push(item);
    }
  }
  await Bun.write(
    import.meta.dir + "/direct-list.json",
    JSON.stringify(rule_set),
  );
  sleep(1000);
  await Bun.$`/home/alice/pros/subx/out/sing-box rule-set compile --output /home/alice/pros/subx/rule/direct.srs /home/alice/pros/subx/rule/direct-list.json`;
}
