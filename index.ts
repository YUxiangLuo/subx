import { read_line, is_valid, fetch_node_urls } from "./lib";
import { parse_hysteria, parse_trojan } from "./parsers";

process.stdout.write("Enter your sub link: \n->");

const sub_link = await read_line();
const valid = is_valid(sub_link);
// console.log(process.env.PWD);

if (!valid) {
  process.stderr.write("ERROR: bad sub link, it must be a valid https url\n\n");
  process.exit();
}

const node_urls = await fetch_node_urls(sub_link);

const tags: string[] = [];
const nodes: any[] = [];

for (const url of node_urls) {
  if (url.startsWith("hy")) {
    const hs_json = parse_hysteria(url);
    tags.push(hs_json.tag);
    nodes.push(hs_json);
  } else if (url.startsWith("trojan")) {
    const trojan_json = parse_trojan(url);
    tags.push(trojan_json.tag);
    nodes.push(trojan_json);
  }
}

console.log(tags);
console.log(JSON.stringify(nodes));
