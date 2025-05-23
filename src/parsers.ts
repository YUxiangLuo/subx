type shadowsocks = {
  type: string;
  tag: string;
  server: string;
  server_port: number;
  method: string;
  password: string;
  domain_resolver: string;
};

export function parse_shadowsocks(ss_url: string): shadowsocks {
  const u = new URL(ss_url);
  const [method, password] = atob(u.username).split(":") as [string, string];
  return {
    type: "shadowsocks",
    tag: decode_hash(u.hash),
    server: u.hostname,
    server_port: Number(u.port),
    method,
    password,
    domain_resolver: "local",
  };
}

type hysteria = {
  type: string;
  tag: string;

  server: string;
  server_port: number;
  password: string;
  tls: {
    enabled: boolean;
    server_name: string;
    insecure: boolean;
  };
  domain_resolver: string;
};

export function parse_hysteria(url: string): hysteria {
  const u = new URL(url);
  return {
    type: "hysteria2",
    tag: decode_hash(u.hash),
    server: u.hostname,
    server_port: Number(u.port),
    password: u.username,
    tls: {
      enabled: true,
      server_name: u.searchParams.get("sni") || "",
      insecure: true,
    },
    domain_resolver: "local",
  };
}

type trojan = {
  type: string;
  tag: string;

  server: string;
  server_port: number;
  password: string;
  tls: {
    enabled: boolean;
    insecure: boolean;
    server_name: string;
    utls: {
      enabled: boolean;
      fingerprint: string;
    };
  };
  multiplex: {
    enabled: boolean;
  };
  domain_resolver: string;
};

export function parse_trojan(trojan_url: string): trojan {
  const u = new URL(trojan_url);

  const server_name = u.searchParams.get("sni") || "";
  const fp = u.searchParams.get("fp") || " ";

  const trojan_obj: trojan = {
    type: "trojan",
    tag: decode_hash(u.hash),
    server: u.hostname,
    server_port: Number(u.port),
    password: u.username,
    tls: {
      enabled: true,
      insecure: true,
      server_name,
      utls: {
        enabled: true,
        fingerprint: fp,
      },
    },
    multiplex: {
      enabled: true,
    },
    domain_resolver: "local",
  };

  return trojan_obj;
}

export function parse_node_urls(node_urls: string[]): [string[], any[]] {
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
    } else if (url.startsWith("ss://")) {
      const ss_json = parse_shadowsocks(url);
      tags.push(ss_json.tag);
      nodes.push(ss_json);
    }
  }

  return [tags, nodes];
}

function decode_hash(hash: string): string {
  return decodeURIComponent(hash.replace("#", "")).replaceAll(" ", "");
}
