import fs from 'fs';

export function makeDirectory(target: string) {
  if (fs.existsSync(target)) {
    return false; //no need to make directory (it already exists)
  }
  fs.mkdirSync(target, { recursive: true });
  return true;
}