import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.92.0/testing/asserts.ts";
import { Github } from "../src/github.ts";

Deno.test("Not available that version when Github#download({ major: 0, minor: 1, patch: 100})", async () => {
  const version = {
    major: 0,
    minor: 1,
    patch: 100,
  };
  await assertThrowsAsync(
    async () => {
      await (new Github()).download(version);
    },
    Error,
    `${Object.values(version).join(".")} version is not available`,
  );
});

Deno.test("File is being downloaded when Github#download({ major: 1, minor: 8, patch: 3})", async () => {
  const version = {
    major: 1,
    minor: 8,
    patch: 3,
  };
  const outputDir = "./test/tmp";
  await (new Github()).download(version, outputDir);

  const paths: string[] = [];
  for await (const file of Deno.readDir(outputDir)) {
    paths.push(file.name);
  }
  const path = paths.find((v) => v.match(/^deno-[0-9]+\.[0-9]+\.[0-9]+\.zip$/));
  const filename = `deno-${Object.values(version).join(".")}.zip`;

  await assertEquals(filename, path);

  // After process for clean-up
  Deno.removeSync(`${outputDir}/${filename}`);
});
