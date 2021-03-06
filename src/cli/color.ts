const COLOR = {
  Reset: "0m",
  Bright: "1m",
  Dim: "2m",
  Underscore: "4m",
  Blink: "5m",
  Reverse: "7m",
  Hidden: "8m",

  FgBlack: "30m",
  FgRed: "31m",
  FgGreen: "32m",
  FgYellow: "33m",
  FgBlue: "34m",
  FgMagenta: "35m",
  FgCyan: "36m",
  FgWhite: "37m",

  BgBlack: "40m",
  BgRed: "41m",
  BgGreen: "42m",
  BgYellow: "43m",
  BgBlue: "44m",
  BgMagenta: "45m",
  BgCyan: "46m",
  BgWhite: "47m",
} as const;
type Color = typeof COLOR[keyof typeof COLOR];
export { COLOR };
