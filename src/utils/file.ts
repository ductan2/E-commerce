
import { Fields, File, Files, Part } from "formidable";
import fs from "fs"
import { Request } from 'express';


export const initFolder = (folderUpload: string) => {
  console.log("🚀 ~ file: file.ts:9 ~ initFolder ~ folderUpload:", folderUpload)
  if (!fs.existsSync(folderUpload)) {
    fs.mkdirSync(folderUpload, { recursive: true });
  }

}

export const getFileName = (files: File): string => {
  let nameFile = "";
  if (files && files && Array.isArray(files)) {
    const mediaFiles = files;
    for (const file of mediaFiles) {
      if (file.newFilename) {
        nameFile = file.newFilename;
      }
    }
  }
  if (files && files && !Array.isArray(files)) {
    const mediaFile = files;
    if (mediaFile.newFilename) {
      nameFile = mediaFile.newFilename;
    }
  }
  return nameFile;
};


export const handleuploadImage = async (req: Request, folderUpload: string) => {
  const { default: formidable } = await import('formidable');
  const form = formidable({
    uploadDir: folderUpload,
    keepExtensions: true,
    multiples: true,
    maxFields: 1,
    maxFileSize: 2 * 1024 * 1024,
    filter: ({ name, originalFilename, mimetype }: Part): boolean => {
      console.log("🚀 ~ file: file.ts:55 ~ filter: ~ name", originalFilename)
      if (originalFilename === "") return false;
      // check ext empty file and type file
      console.log("🚀 ~ file: file.ts:55 ~ filter: ~ mimetype", mimetype)

      const valid = name === 'image' && Boolean(mimetype?.includes("image/"))
      if (!valid) {
        form.emit('error' as any, new Error('File type is invalid') as any);
      }
      return valid;
    }
  });
  return new Promise(async (resolve, reject) => {
    try {
      form.parse(req, async (err, fields: Fields, files: Files) => {
        console.log("🚀 ~ file: file.ts:55 ~ filter: ~ files", files)
        if (files === undefined || !files) return reject({
          message: "File is empty",
          status: 400,
        });

        if (err) {
          return reject({
            error: err.message,
            message: "Upload failed!",
            status: 400,
          });
        }
        if (!files.image) {
          return reject({
            message: "File is empty",
            status: 400,
          });
        }

        resolve(files.image);
      });
    } catch (error) {
      reject({
        message: "Upload failed!",
        status: 400,
        error
      });
    }
  });
}
