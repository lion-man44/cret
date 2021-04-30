import { readline } from "https://deno.land/x/readline/mod.ts";
import { cac } from "https://unpkg.com/cac/mod.ts";

import { Github } from "./src/github.ts";
import { Cli } from "./src/cli.ts";
import { Version } from "./src/github/types.ts";

async function install(question: string = "Which the version do you want?") {
  const prefixLine = "       ";
  const github = new Github();
  const versions = (await github.getVersions()).map((version) =>
    prefixLine + version + "\n"
  ).slice(0, 7);
  await Cli.write("\n")
    .then((_: void) => Cli.write(versions.join(""), Cli.COLOR.FgCyan))
    .then((_: void) => Cli.write("\n"))
    .then((_: void) => Cli.write(question, Cli.COLOR.Reset))
    .then((_: void) => Cli.write("\n>  "));

  const rl = readline(Deno.stdin);
  const input: string = await new TextDecoder().decode((await rl.next()).value);
  await Cli.install(input);
  await Cli.write("\nYou need to write following the `.bash_profile`\n")
    .then((_: void) => Cli.write("export PATH=$HOME/.cret/bin:$PATH"))
}

async function uninstall(inputVersion: string) {
  Cli.uninstall(inputVersion)
}

async function lsRemote() {
  const versions = (await Cli.lsRemote()).map(v => v + "\n")
  await Cli.write(versions.join(""), Cli.COLOR.FgCyan)
}

async function ls() {
  const installed = (Cli.ls()).map((version) => version + "\n");
  const now = Cli.now();
  await Cli.write(`now: ${now}\n`)
    .then((_: void) => Cli.write("\n"))
    .then((_: void) => Cli.write(installed.join(""), Cli.COLOR.FgGreen))
}

async function use(inputVersion: string) {
  Cli.use(inputVersion);
}

const cli = cac("cret");
cli
  .command("install", "install new Deno version")
  .action((_otherFiles, _options) => install());
cli
  .command("uninstall <version>", "Remove your Deno version")
  .action((version, _otherFiles, _options) => uninstall(version));
cli
  .command("ls-remote", "List up Deno version")
  .action((options) => lsRemote());
cli
  .command("ls", "list up installed")
  .action((_) => ls());
cli
  .command("use <version>", "Change your Deno version")
  .action((version, _otherFiles, _options) => use(version));
cli.help()
cli.version("1.0.0")

cli.parse();
