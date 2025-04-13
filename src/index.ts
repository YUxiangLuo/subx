import { read_line, is_valid, fetch_node_urls } from "./lib";
import { parse_node_urls } from "./parsers";
import { db } from "./db.ts";
import { sing_box_config } from "./configs.ts";

const op = process.argv[2];
switch (op) {
  case "add":
    add_sub();
    break;
  case "update":
    update_subs();
    break;
  case "delete":
    delete_sub();
    break;
  case "generate":
    generate_config(process.argv[3]);
    break;
  default:
    generate_config(process.argv[3]);
    break;
}
type sub = {
  id: number;
  url: string;
  nodes: string;
};

async function delete_sub() {
  const subs = (await db.query(`select * from subs`).all()) as sub[];
  if (subs.length === 0) process.exit();
  console.log(subs.map((x) => ({ id: x.id, url: x.url })));
  process.stdout.write("Enter your sub id: \n->");
  const sub_id = await read_line();
  await db.query(
    `delete from subs where id = ${sub_id};`).run();
  console.log("deleted sub with id: ", sub_id);
  process.exit();
}

async function update_subs() {
  const subs = (await db.query(`select * from subs`).all()) as sub[];
  if (subs.length === 0) process.exit();
  for (const sub of subs) {
    const sub_link = sub.url;
    const node_urls = await fetch_node_urls(sub_link);
    const [_, nodes] = await parse_node_urls(node_urls);
    db
      .query(
        `update subs set nodes = '${JSON.stringify(nodes)}', update_time = '${Date()}'  where id = ${sub.id};`,
      )
      .run();
  }
}

async function generate_config(out_path: string = "out/config.json") {
  const subs = (await db.query(`select * from subs`).all()) as sub[];
  if (subs.length === 0) process.exit(1);

  let nodes_json: any[] = [];
  for (const sub of subs) {
    nodes_json = JSON.parse(sub.nodes);
    sing_box_config.outbounds[0].outbounds = [...sing_box_config.outbounds[0].outbounds, ...nodes_json.map((x) => x.tag)];
    sing_box_config.outbounds = [...sing_box_config.outbounds, ...nodes_json];
  }



  Bun.write(out_path, JSON.stringify(sing_box_config));
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

  db
    .query(
      `insert into subs(url, nodes, update_time) values('${sub_link}', '${JSON.stringify(nodes)}', '${Date()}')`,
    )
    .run();
}
