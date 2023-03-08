import * as bcrypt from 'bcrypt';
import * as multer from 'multer';
import * as util from 'util';
import * as xlsx from 'xlsx';
import * as path from 'path';
import { CallSchema } from 'src/call/schema/call.schema';

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALTWORKFACTOR));
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    throw Error(error);
  }
};

export const JsonResponse = (
  error: boolean,
  message: string,
  data?: any,
  accessToken?: string,
  refreshToken?: string,
) => {
  return {
    result: {
      error,
      message,
      data,
      accessToken,
      refreshToken,
    },
  };
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../Demo/demo-nest/filesave/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('file');

export const uploadFileHelper = util.promisify(uploadFile);

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

export const exportToExcel = (
  item: CallSchema[],
  workSheetColumnNames: string[],
  workSheetName: string,
  filePath: string,
) => {
  const data = item.map((user) => {
    return [user.username, user.isCall, user.createdAt];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};
