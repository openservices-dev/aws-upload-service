import { Request } from 'express';

export const base64encode = (str: string): string => {
  return Buffer.from(str).toString('base64');
}

export const getFileFilter = (regexp: string) => {
  return (req: Request, file: any, cb: (err: unknown, isAccepted: boolean) => void) => {
    if (new RegExp(regexp, 'i').test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}

export const fileFilter = (req: Request, file: any, cb: (err: unknown, isAccepted: boolean) => void) => {
  const re = new RegExp('(image|video)/.+', 'i');
  
  if (re.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const getDimensions = (height: number, width: number, maxHeight: number, maxWidth: number): { height: number, width: number } => {
  if (typeof height === 'undefined' || typeof width === 'undefined') {
    return {
      width: maxWidth,
      height: maxHeight
    };
  }

  const mw = Math.max(maxWidth, maxHeight);
  const mh = Math.min(maxWidth, maxHeight);

  const w = Math.max(width, height);
  const h = Math.min(width, height);

  let rw = width;
  let rh = height;

  if (w > mw) {
    rh = Math.ceil(h * (mw / w));
    rw = mw;
  } else if (h > mh) {
    rw = Math.ceil(w * (mh / h));
    rh = mh;
  }

  return {
    height: width > height ? rh : rw,
    width: width > height ? rw : rh,
  };
}

export function shouldFilterBy(variable: unknown): boolean {
  return typeof variable !== 'undefined' && variable !== null;
}
