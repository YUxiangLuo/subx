import { read_line, is_valid, fetch_node_urls } from "./lib";
import { parse_hysteria, parse_shadowsocks, parse_trojan } from "./parsers";
import { bun_db } from "./db.ts";
import { sing_box_config } from "./configs.ts";

const op = process.argv[2];
if (op == "add") {
  process.stdout.write("Enter your sub link: \n->");

  const sub_link = await read_line();
  const valid = is_valid(sub_link);
  const pwd = process.env.PWD;
  console.log(pwd);

  if (!valid) {
    process.stderr.write(
      "ERROR: bad sub link, it must be a valid https url\n\n",
    );
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
    } else if(url.startsWith("ss://")) {
      const ss_json = parse_shadowsocks(url);
      tags.push(ss_json.tag);
      nodes.push(ss_json);
    }
  }

  bun_db
    .query(
      `insert into subs(url, nodes) values('${sub_link}', '${JSON.stringify(nodes)}')`,
    )
    .run();
} else {
  const subs: any = await bun_db.query(`select * from subs`).all();
  for (const sub of subs) {
    const nodes_json: any[] = JSON.parse(sub.nodes);
    console.log(nodes_json);
    sing_box_config.outbounds[0].outbounds = nodes_json.map((x) => x.tag);
    sing_box_config.outbounds = [...sing_box_config.outbounds, ...nodes_json];
  }
  console.log(sing_box_config);
  Bun.write("./out/sing_box_config.json", JSON.stringify(sing_box_config));
}
