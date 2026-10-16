import { spawnSync } from 'node:child_process';
import { presidentEnvironment } from './president-environment.mjs';
const env = presidentEnvironment();
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { env, stdio: 'inherit', windowsHide: true });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
