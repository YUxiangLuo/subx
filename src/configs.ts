export const sing_box_config: any = {
  "log": { "disabled": false, "level": "info", "timestamp": true },
  "dns": {
    "final": "onedns",
    "strategy": "ipv4_only",
    "servers": [
      {
        "type": "udp",
        "tag": "onedns",
        "server": "1.1.1.1",
        "detour": "select"
      },
      { "type": "fakeip", "tag": "fakeip", "inet4_range": "198.18.0.0/15" },
      {
        "tag": "local",
        "type": "udp",
        "server": "223.5.5.5"
      }
    ],
    "rules": [
      {
        "type": "logical",
        "mode": "and",
        "rules": [
          { "rule_set": ["china-site"], "invert": true },
          { "query_type": ["A", "AAAA"] }
        ],
        "action": "route",
        "server": "fakeip"
      },
      {
        "rule_set": ["china-site"],
        "action": "route",
        "server": "local"
      }
    ]
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "interface_name": "tun0",
      "address": ["172.18.0.1/30"],
      "mtu": 9000,
      "auto_route": true,
      "strict_route": true,
      "auto_redirect": true
    }
  ],
  "outbounds": [
    {
      "type": "selector",
      "tag": "select",
      "outbounds": [
      ],
      "interrupt_exist_connections": true
    },
    { "type": "direct", "tag": "direct" },
  ],
  "experimental": {
    "clash_api": {
      "external_controller": "0.0.0.0:9090",
      "external_ui": "dashboard"
    },
    "cache_file": {
      "enabled": true,
      "store_fakeip": true,
    },
  },
  "route": {
    "final": "select",
    "auto_detect_interface": true,
    "rules": [
      { "action": "sniff" },
      { "protocol": "dns", "action": "hijack-dns" },
      {
        "process_path": ["/usr/bin/qbittorrent"],
        "action": "route",
        "outbound": "direct"
      },
      {
        "process_path": ["/usr/lib/systemd/systemd-resolved"],
        "action": "reject"
      },
      { "ip_is_private": true, "action": "route", "outbound": "direct" },
      {
        "rule_set": ["china-ip"],
        "action": "route",
        "outbound": "direct"
      }
    ],
    "rule_set": [
      {
        "type": "local",
        "tag": "china-site",
        "format": "binary",
        "path": "./rule/direct.srs"
      },
      {
        "type": "local",
        "tag": "china-ip",
        "format": "binary",
        "path": "./rule/china-ip.srs"
      }
    ]
  }
};
