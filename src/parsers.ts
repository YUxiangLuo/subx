// {"type":"shadowsocks","tag":"🇭🇰HongKongMetro10","server":"061a43b9-2e7f-93ab-5ed1-8e9e582bd574.ss03.net","server_port":22360,"method":"chacha20-ietf-poly1305","password":"eb6dcd58-e34a-4994-964e-2966d4d6ad5f","domain_resolver":"alidns"}

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
    domain_resolver: "alidns"
  }
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
    domain_resolver: "alidns",
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
    domain_resolver: "alidns",
  };

  return trojan_obj;
}

function decode_hash(hash: string): string {
  return decodeURIComponent(hash.replace("#", "")).replaceAll(" ", "");
}
