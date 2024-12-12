import crypto from 'crypto';
import stream from 'stream';
import { exec } from 'child_process';
import OS from 'os';
import fs from 'fs';

class ExiftoolStrategy implements Services.Metadata.Strategy {
  public async getMetadata(file: unknown): Promise<unknown> {
    const filename = crypto.randomBytes(8).toString('hex');

    if (file instanceof Buffer) {
      await this.saveBuffer(file, filename);
    } else if (stream.isReadable(file as any)) {
      await this.saveReadable(file as any, filename);
    }

    const data = await this.runExiftool(filename);

    await this.deleteFile(filename);

    return data;
  }

  protected saveBuffer(buffer: Buffer, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${OS.tmpdir()}/${filename}`, buffer, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  protected async saveReadable(readable: NodeJS.ReadableStream, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(`${OS.tmpdir()}/${filename}`);

      readable.pipe(writable);

      writable.on('finish', () => {
        resolve();
      });

      writable.on('error', (err) => {
        reject(err);
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
