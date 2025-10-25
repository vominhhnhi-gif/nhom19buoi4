import multer from 'multer';

const storage = multer.memoryStorage(); // giữ file trong buffer thay vì lưu vào disk
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn 5MB
  },
});