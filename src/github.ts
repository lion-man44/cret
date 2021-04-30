import { download } from "https://deno.land/x/download@v1.0.1/mod.ts";
import { Tag, Version } from "./github/types.ts";

export class Github {
  /**
    To express prefix URL for ZIP source.
    example: https://github.com/denoland/deno/releases/download/v1.8.3/deno-aarch64-apple-darwin.zip
   */
  static readonly PREFIX_DOWNLOAD_URL =
    "https://github.com/denoland/deno/releases/download";
  /**
    Deno.build contains important information about the OS.
    example:
      {
        target: "x86_64-apple-darwin",
        arch: "x86_64",
        os: "darwin",
        vendor: "apple",
        env: undefined
      }
   */
  static readonly TARGET = Deno.build.target;
  /**
    Pull the tag name from GitHub.
    The API version used 3.
   */
  static readonly TAGS_URL = "https://api.github.com/repos/denoland/deno/tags";

  async getVersions(): Promise<string[]> {
    const json: Tag[] = await this.getTags();
    const names: string[] = json.map(({ name }: { name: string }) =>
      name.replace(/v/, "")
    );
    return names;
  }

  async download(version: Version, dir: string = "/tmp") {
    const semanticVersion: string = Object.values(version).join(".");
    const versions: string[] = await this.getVersions();
    if (!versions.find((v) => v === semanticVersion)?.length) {
      throw new Error(`${semanticVersion} version is not available`);
    }
    const filename = `deno-${semanticVersion}.zip`;
    return await download(
      `${Github.PREFIX_DOWNLOAD_URL}/v${semanticVersion}/deno-${Github.TARGET}.zip`,
      { file: filename, dir: dir },
    );
  }

  private async fetch(url: string): Promise<Response> {
    return await globalThis.fetch(url);
  }

  private async getTags(): Promise<Tag[]> {
    const res = await this.fetch(Github.TAGS_URL);
    const buffers = new Uint8Array(await res.arrayBuffer());
    return JSON.parse(new TextDecoder().decode(buffers));
  }
}
