import crypto from 'crypto';
import { exec } from 'child_process';
import OS from 'os';
import fs from 'fs';

class ExiftoolStrategy implements Services.Metadata.Strategy {
  public async getMetadata(file: unknown): Promise<unknown> {
    if (!Buffer.isBuffer(file)) {
      throw new Error('ImageStrategy requires file to be instance of Buffer!');
    }

    const filename = crypto.randomBytes(8).toString('hex');

    await this.saveFile(file, filename);

    const data = await this.runExiftool(filename);

    await this.deleteFile(filename);

    return data;
  }

  protected async saveFile(file: unknown, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${OS.tmpdir()}/${filename}`, file as Buffer, function(err) {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  protected async runExiftool(filename: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      exec(`exiftool -j ${OS.tmpdir()}/${filename}`, (error, stdout, stderr) => {
        if (error) {
            reject(error.message);
            return;
        }
        if (stderr) {
            reject(stderr);
            return;
        }

        resolve(JSON.parse(stdout).shift());
      });
    });
  }

  protected async deleteFile(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(`${OS.tmpdir()}/${filename}`, (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }
}

export default ExiftoolStrategy;
