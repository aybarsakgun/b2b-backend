import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Md5 } from 'ts-md5';
import * as jimp from 'jimp';
import { Readable } from 'stream';
import { Response } from 'express';

@Injectable()
export class ImageService {
  async resize(size: string, imageName: string, res: Response) {
    const cacheId = this.getCacheId(size, imageName);
    const suffix = this.getSuffix(imageName);

    let image;
    let buffer;

    try {
      image = await jimp.read(`${this.cachePath}/${cacheId}.${suffix}`);
      buffer = await image.getBufferAsync('image/png');
    } catch (e) {
      buffer = await this.createImage(size, imageName);
    }

    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.setHeader('ETag', `"${cacheId}"`);
    res.setHeader('Expires', `${new Date(Date.now() + 2592000000).toUTCString()}`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.removeHeader('transfer-encoding');
    res.removeHeader('Access-Control-Allow-Origin');

    return stream.pipe(res);
  }

  getCacheId(size, name): string {
    return Md5.hashStr(`${size}_${name}`) as string;
  }

  getSuffix(name): string {
    return name.split('.')[1];
  }

  get imagePath(): string {
    return 'public/images';
  }

  get cachePath(): string {
    return 'var/cache/images';
  }

  async createImage(size: string, imageName: string) {
    let height: number;
    let width: number;

    if (size.includes('-')) {
      const [h, w] = size.split('-');
      height = +h;
      width = +w;
    } else {
      height = +size;
      width = +size;
    }

    let image;
    try {
      image = await jimp.read(`${this.imagePath}/${imageName}`);
    } catch (e) {
      throw new HttpException(imageName + ' Not Found', HttpStatus.NOT_FOUND);
    }

    await image.contain(width, height);

    const cacheId = this.getCacheId(size, imageName);
    const suffix = this.getSuffix(imageName);

    await image.writeAsync(`${this.cachePath}/${cacheId}.${suffix}`);

    return image.getBufferAsync('image/png');
  }
}
