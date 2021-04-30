import { existsSync } from "https://deno.land/std/fs/mod.ts";
import * as semver from "https://deno.land/x/semver/mod.ts";

import { COLOR } from "./cli/color.ts";
import { ParseError, ValidError } from "./cli/error.ts";
import { Version } from "./github/types.ts";
import { Github } from "./github.ts";

export class Cli {
  static readonly ESC = "\u001B[";
  static readonly X1B = "\x1b[";
  static readonly COLOR = COLOR;
  static readonly HOME_DIRECTORY = ".cret";
  static readonly HOME = Deno.env.get("HOME");
  static readonly MAIN_DIR = Cli.HOME + "/" + Cli.HOME_DIRECTORY;
  static readonly LINK_BIN_DIR = Cli.MAIN_DIR + "/bin";
  static readonly VERSIONS_DIR = Cli.MAIN_DIR + "/versions";

  static async write(str: string, color?: string): Promise<void> {
    let text = "";
    if (color === undefined) text = str;
    else text = this.X1B + color + str;
    await Deno.stdout.write(await new TextEncoder().encode(text));
  }

  static parse(input: string): Version {
    const [major, minor, patch]: number[] = input.split(".").map((v) => +v);
    if (
      major === undefined || minor === undefined || patch === undefined
    ) {
      throw new ParseError("One of major, minor or patch is empty");
    }
    if (
      !Number.isInteger(major) ||
      !Number.isInteger(minor) ||
      !Number.isInteger(patch)
    ) {
      throw new ValidError("Incorrect value");
    }
    return { major, minor, patch };
  }

  static async install(inputVersion: string) {
    const versions = Cli.parse(inputVersion);
    const version = Object.values(versions).join(".");

    const installDir = `${this.VERSIONS_DIR}/${version}/bin`;
    const filename = `deno-${version}.zip`;
    const fullpath = `${installDir}/${filename}`;

    Deno.mkdirSync(this.LINK_BIN_DIR, { recursive: true });
    Deno.mkdirSync(installDir, { recursive: true });

    await (new Github()).download(versions, installDir);

    await Cli.unzip(fullpath, installDir);
    Deno.removeSync(fullpath);
  }

  static uninstall(inputVersion: string) {
    const versions = Cli.parse(inputVersion);
    const version = Object.values(versions).join(".");

    const now = this.now();
    if (version === now) Deno.removeSync(`${this.LINK_BIN_DIR}/deno`)
    const dir = `${this.VERSIONS_DIR}/${version}`
    Deno.removeSync(dir, { recursive: true });
    Cli.write(`Success deleted version ${version}`)
  }

  static use(inputVersion: string) {
    const versions = Cli.parse(inputVersion);
    const version = Object.values(versions).join(".");

    const installDir = `${this.MAIN_DIR}/versions/${version}/bin`;
    if (!existsSync(installDir)) return;
    const linkBin = `${this.LINK_BIN_DIR}/deno`;
    if (existsSync(linkBin)) Deno.removeSync(linkBin);
    Deno.symlinkSync(`${installDir}/deno`, linkBin);
  }

  static ls(): string[] {
    const names: string[] = [];

    for (const version of Deno.readDirSync(this.VERSIONS_DIR)) {
      names.push(version.name);
    }
    return names.sort(semver.compare);
  }

  static now(): string {
    const filepath = this.LINK_BIN_DIR + "/deno";
    if (!existsSync(filepath)) return "none";

    const symlinkBin = Deno.realPathSync(filepath);
    const regex = /versions\/([0-9]+\.[0-9]+\.[0-9]+)/
    const match = symlinkBin.match(regex);
    if (!match) return "none (Failed to parse)"
    return match[1]
  }

  static lsRemote() {
    return (new Github).getVersions()
  }

  private static async unzip(
    filepath: string,
    outputDir: string,
  ): Promise<void> {
    const cmd: Deno.Process = Deno.run({
      cmd: ["unzip", filepath, "-d", outputDir],
    });
    await cmd.status();
    cmd.close();
  }

  private alreadyInstalled() {
  }
}
