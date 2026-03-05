import multer from 'multer';
import { Request } from 'express';

/*
This code configures Multer to:
- Store uploaded files in the "public/temp" folder.
- Rename files with a unique name (timestamp + random number).
- Make upload available to be used in Express routes.
*/

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, './public/temp');
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({
  storage: storage,
});
