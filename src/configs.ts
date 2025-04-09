export const sing_box_config: any = {
  log: {
    disabled: false,
    level: "info",
    timestamp: true,
  },
  dns: {
    client_subnet: "114.114.114.0/24",
    strategy: "ipv4_only",
    disable_cache: false,
    cache_capacity: 10000,
    final: "googledns",
    servers: [
      {
        type: "udp",
        tag: "googledns",
        server: "8.8.8.8",
        detour: "auto",
      },
      {
        type: "udp",
        tag: "alidns",
        server: "223.5.5.5",
        detour: "direct",
      },
    ],
    rules: [
      {
        rule_set: ["china-site"],
        action: "route",
        server: "alidns",
      },
    ],
  },
  inbounds: [
    {
      type: "tun",
      tag: "tun-in",
      interface_name: "tun0",
      address: ["172.18.0.1/30"],
      mtu: 9000,
      auto_route: true,
      strict_route: true,
    },
  ],
  outbounds: [
    {
      type: "urltest",
      tag: "auto",
      outbounds: [],
    },
    {
      type: "direct",
      tag: "direct",
      domain_resolver: "alidns",
    },
  ],
  route: {
    auto_detect_interface: true,
    rules: [
      {
        action: "sniff",
      },
      {
        protocol: "dns",
        action: "hijack-dns",
      },
      {
        domain: ["localhost"],
        process_path: ["/usr/bin/qbittorrent", "/usr/bin/NetworkManager"],
        ip_is_private: true,
        action: "route",
        outbound: "direct"
      },
      {
        rule_set: ["china-ip", "china-site"],
        action: "route",
        outbound: "direct",
      },
    ],
    rule_set: [
      {
        type: "remote",
        tag: "china-site",
        format: "binary",
        url: "https://raw.githubusercontent.com/senshinya/singbox_ruleset/main/rule/China/China.srs",
      },
      {
        type: "remote",
        tag: "china-ip",
        format: "binary",
        url: "https://raw.githubusercontent.com/senshinya/singbox_ruleset/main/rule/ChinaIPs/ChinaIPs.srs",
      },
    ],
  },
};
