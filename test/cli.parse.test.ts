import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.92.0/testing/asserts.ts";
import { Cli } from "../src/cli.ts";
import { ParseError, ValidError } from "../src/cli/error.ts";

Deno.test('ParseError when executing Cli.parse("012")', () => {
  assertThrows(
    () => {
      Cli.parse("012");
    },
    ParseError,
    "One of major, minor or patch is empty",
  );
});

Deno.test('TypeError when executing Cli.parse("0.1ho.2")', () => {
  assertThrows(
    () => {
      Cli.parse("0.1ho.2");
    },
    ValidError,
    "Incorrect value",
  );
});

Deno.test('Valid test when Cli.parse("0.1.2")', () => {
  assertEquals(Cli.parse("0.1.2"), { major: 0, minor: 1, patch: 2 });
});
