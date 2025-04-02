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
