export const sing_box_config: any = {
  log: {
    disabled: false,
    level: "info",
    timestamp: true,
  },
  dns: {
    strategy: "ipv4_only",
    disable_cache: false,
    cache_capacity: 10000,
    final: "onedns",
    servers: [
      {
        type: "https",
        tag: "onedns",
        server: "1.1.1.1",
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
        rule_set: ["geosite-cn"],
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
      auto_redirect: true,
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
        process_path: ["/usr/bin/qbittorrent"],
        ip_is_private: true,
        rule_set: ["geoip-cn", "geosite-cn"],
        action: "route",
        outbound: "direct",
      },
    ],
    rule_set: [
      {
        type: "remote",
        tag: "geosite-cn",
        format: "binary",
        url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/refs/heads/rule-set/geosite-cn.srs",
      },
      {
        type: "remote",
        tag: "geoip-cn",
        format: "binary",
        url: "https://raw.githubusercontent.com/SagerNet/sing-geoip/refs/heads/rule-set/geoip-cn.srs",
      },
    ],
  },
};
