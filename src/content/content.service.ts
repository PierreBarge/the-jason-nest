import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';

@Injectable()
export class ContentService {
  paths = {
    main: {
      default: './src/content/assets/content.default.json',
      value: './src/content/assets/content.data.json',
    },
  };

  async checkFile(path: string) {
    return new Promise((resolve) => {
      fs.access(
        path,
        (fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK,
        (err) => {
          if (err) {
            resolve(false);
          }
          resolve(true);
        }),
      );
    });
  }

  async getContent(pathKey: string) {
    return new Promise(async (resolve, reject) => {
      if (await this.checkFile(this.paths[pathKey].value)) {
        fs.readFile(this.paths[pathKey].value, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(JSON.parse(data.toString()));
        });
      } else {
        fs.readFile(this.paths[pathKey].default, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(JSON.parse(data.toString()));
        });
      }
    });
  }

  async setContent(pathKey: string, data: object) {
    const content: string = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      fs.writeFile(this.paths[pathKey].value, content, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(console.log('File successfully updated!'));
      });
    });
  }
}
