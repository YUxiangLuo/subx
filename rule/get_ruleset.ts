import { sleep } from "bun";

const res = await fetch("https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/direct-list.txt");
const text = await res.text();


// difficult to type my data, so give any to it
const rule_set: any = {
    rules: [
        {
            "domain": [
            ],
            "domain_suffix": [
                ".cn"
            ],
            "domain_regex": [
                
            ]
        }
    ],
    version: 2,
}

Bun.write("./direct-list.txt", text);
const items = text.split("\n");
for (const item of items) {
    if (item.startsWith("full:")) {
        rule_set.rules[0].domain.push(item.replace("full:", ""));
    } 
    else if (item.startsWith("regexp:")) {
        rule_set.rules[0].domain_regex.push(item.replace("regexp:", ""))
    } 
    else {
        if(item) rule_set.rules[0].domain_suffix.push(item);
    }
}
console.log(rule_set);
await Bun.write("./direct-list.json", JSON.stringify(rule_set));
sleep(1000);
await Bun.$`../sing-box rule-set compile --output direct.srs ./direct-list.json`;
