export async function read_line(): Promise<string> {
  let line = "";
  for await (const chunk of console) {
    line = chunk;
    break;
  }
  return line;
}

export function is_valid(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export async function fetch_node_urls(sub_link: string): Promise<string[]> {
  const res = await fetch(sub_link);
  const text = atob(await res.text());
  const node_urls = text
    .split("\r\n")
    .filter((x) => x.length)
    .filter((x) => !x.includes("127.0.0.1"))
    .filter((x) => !x.includes("H6") && !x.includes("IPv6"));

  return node_urls;
}
