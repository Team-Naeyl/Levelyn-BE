import { pipe } from "@fxts/core";
import { join } from "node:path";
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

export default () => pipe(
    join(__dirname, "..", "..", "game.system.yaml"),
    path => readFileSync(path, "utf8"),
    data => load(data) as Record<string, any>
);