import { read_line, is_valid, fetch_node_urls } from "./lib";
import { parse_node_urls } from "./parsers";
import { bun_db } from "./db.ts";
import { sing_box_config } from "./configs.ts";

const pwd = process.env.PWD;

const op = process.argv[2];
if (op == "add") {
  add_sub();
} else if (op == "update") {
  update_subs();
} else {
  generate_config();
}

type sub = {
  id: number;
  url: string;
  nodes: string;
};
async function update_subs() {
  const subs = (await bun_db.query(`select * from subs`).all()) as sub[];
  if (subs.length === 0) process.exit();
  for (const sub of subs) {
    const sub_link = sub.url;
    const node_urls = await fetch_node_urls(sub_link);
    const [_, nodes] = await parse_node_urls(node_urls);
    bun_db
      .query(
        `update subs set nodes = '${JSON.stringify(nodes)}', update_time = '${Date()}'  where id = ${sub.id};`,
      )
      .run();
  }
}

async function generate_config() {
  const subs = (await bun_db.query(`select * from subs`).all()) as sub[];
  if (subs.length === 0) process.exit(1);
  console.log(subs);

  for (const sub of subs) {
    const nodes_json: any[] = JSON.parse(sub.nodes);
    sing_box_config.outbounds[0].outbounds = nodes_json.map((x) => x.tag);
    sing_box_config.outbounds = [...sing_box_config.outbounds, ...nodes_json];
  }
  Bun.write(
    process.env.PWD + "/sing_box_config.json",
    JSON.stringify(sing_box_config),
  );
}

async function add_sub() {
  process.stdout.write("Enter your sub link: \n->");

  const sub_link = await read_line();
  const valid = is_valid(sub_link);

  if (!valid) {
    process.stderr.write(
      "ERROR: bad sub link, it must be a valid https url\n\n",
    );
    process.exit();
  }

  const node_urls = await fetch_node_urls(sub_link);
  const [tags, nodes] = await parse_node_urls(node_urls);
  console.log(tags);

  bun_db
    .query(
      `insert into subs(url, nodes, update_time) values('${sub_link}', '${JSON.stringify(nodes)}', '${Date()}')`,
    )
    .run();
}
