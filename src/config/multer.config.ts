import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const fileMulterConfig = {
  storage: diskStorage({
    destination: './uploads/files',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'binary').toString(
      'utf-8',
    );
    cb(null, true);
  },
};

export const avatarMulterConfig = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  },
};
