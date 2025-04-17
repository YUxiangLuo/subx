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
        "tag": "alidns",
        "type": "udp",
        "server": "223.5.5.5",
        "detour": "direct"
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
        "server": "alidns"
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
    { "type": "direct", "tag": "direct", "domain_resolver": "alidns" },
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
      { "rule_set": ["ads-site"], "action": "reject" },
      {
        "process_path": ["/usr/bin/qbittorrent"],
        "action": "route",
        "outbound": "direct"
      },
      { "ip_is_private": true, "action": "route", "outbound": "direct" },
      {
        "rule_set": ["china-ip", "china-site"],
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
        "tag": "ads-site",
        "format": "binary",
        "path": "./rule/reject.srs"
      },
      {
        "type": "local",
        "tag": "proxy-site",
        "format": "binary",
        "path": "./rule/proxy.srs"
      },
      {
        "type": "remote",
        "tag": "china-ip",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/senshinya/singbox_ruleset/main/rule/ChinaIPs/ChinaIPs.srs"
      }
    ]
  }

};
