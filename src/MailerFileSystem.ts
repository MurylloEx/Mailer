import { F_OK } from 'constants';
import { access, readFile } from 'fs';

export async function fexists(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    access(filePath, F_OK, (error) => resolve(!error));
  });
}

export async function fread(filePath: string): Promise<string> {
  return new Promise<string>((resolve) => {
    readFile(filePath, 'utf8', 
      (error, data) => resolve(error ? '' : data));
  });
}
