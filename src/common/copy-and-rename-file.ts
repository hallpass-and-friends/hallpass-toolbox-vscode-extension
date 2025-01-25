import fs from 'fs';


export function renameFile(source: string, target: string) {
  if (fs.existsSync(source)) {
    fs.renameSync(source, target);
    return true;
  }
  //else, source does not exist
  return false;
}

export function copyFile(source: string, target: string, overwrite = false) {
  if (fs.existsSync(source)) {
    if (fs.existsSync(target) && !overwrite) {
      return false;
    }
    fs.copyFileSync(source, target);
    return true;
  }
  //else, source does not exist
  return false; 
}

export function copyFileWithBackup(source: string, target: string) {
  if (fs.existsSync(source)) {
    let counter = 0;
    let bakTarget = target;
    while (fs.existsSync(bakTarget)) {
      counter += 1;
      bakTarget = `${bakTarget}.v${counter}.bak`;
    }
    if (bakTarget !== target) {
      renameFile(target, bakTarget);
    }
    //now copy
    fs.copyFileSync(source, target);
    return true;
  }
  //else, source does not exist
  return false; 
}
