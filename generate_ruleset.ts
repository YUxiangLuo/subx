import { sleep } from "bun";

await generate_direct_list();
await generate_reject_list();
await generate_proxy_list();
await generate_china_ip();
async function generate_china_ip() {
  const res = await fetch("https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt");
  const text = await res.text();
  let arr = text.split("\n");
  arr.pop();
  arr.shift();
  arr = arr.map(x => x.substring(x.indexOf("'") + 1, x.lastIndexOf("'"))).filter(x => !x.includes(":"));
  console.log(arr[0], arr[1], arr[arr.length - 1]);
  const rule: any = {
    "version": 3,
    "rules": [
      { "ip_cidr": [] }
    ]
  }
  for (const x of arr) {
    rule.rules[0]?.ip_cidr.push(x)
  }
  console.log(rule);
  await Bun.write(
    import.meta.dir + "/rule/china-ip-list.json",
    JSON.stringify(rule),
  );
  sleep(1000);
  await Bun.$`${import.meta.dir}/out/sing-box rule-set compile --output ${import.meta.dir}/rule/china-ip.srs ${import.meta.dir}/rule/china-ip-list.json`;
}
async function generate_proxy_list() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/proxy-list.txt",
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

  await Bun.write(import.meta.dir + "/rule/proxy-list.txt", text);
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
    import.meta.dir + "/rule/proxy-list.json",
    JSON.stringify(rule_set),
  );
  sleep(1000);
  await Bun.$`${import.meta.dir}/out/sing-box rule-set compile --output ${import.meta.dir}/rule/proxy.srs ${import.meta.dir}/rule/proxy-list.json`;
}

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

  await Bun.write(import.meta.dir + "/rule/reject-list.txt", text);
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
    import.meta.dir + "/rule/reject-list.json",
    JSON.stringify(rule_set),
  );
  sleep(1000);
  await Bun.$`${import.meta.dir}/out/sing-box rule-set compile --output ${import.meta.dir}/rule/reject.srs ${import.meta.dir}/rule/reject-list.json`;
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

  await Bun.write(import.meta.dir + "/rule/direct-list.txt", text);
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
    import.meta.dir + "/rule/direct-list.json",
    JSON.stringify(rule_set),
  );
  sleep(1000);
  await Bun.$`${import.meta.dir}/out/sing-box rule-set compile --output ${import.meta.dir}/rule/direct.srs ${import.meta.dir}/rule/direct-list.json`;
}
