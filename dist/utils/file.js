"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleuploadImage = exports.getFileName = exports.initFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const initFolder = (folderUpload) => {
    console.log("🚀 ~ file: file.ts:9 ~ initFolder ~ folderUpload:", folderUpload);
    if (!fs_1.default.existsSync(folderUpload)) {
        fs_1.default.mkdirSync(folderUpload, { recursive: true });
    }
};
exports.initFolder = initFolder;
const getFileName = (files) => {
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
exports.getFileName = getFileName;
const handleuploadImage = async (req, folderUpload) => {
    const { default: formidable } = await import('formidable');
    const form = formidable({
        uploadDir: folderUpload,
        keepExtensions: true,
        multiples: true,
        maxFields: 1,
        maxFileSize: 2 * 1024 * 1024,
        filter: ({ name, originalFilename, mimetype }) => {
            console.log("🚀 ~ file: file.ts:55 ~ filter: ~ name", originalFilename);
            if (originalFilename === "")
                return false;
            // check ext empty file and type file
            console.log("🚀 ~ file: file.ts:55 ~ filter: ~ mimetype", mimetype);
            const valid = name === 'image' && Boolean(mimetype?.includes("image/"));
            if (!valid) {
                form.emit('error', new Error('File type is invalid'));
            }
            return valid;
        }
    });
    return new Promise(async (resolve, reject) => {
        try {
            form.parse(req, async (err, fields, files) => {
                console.log("🚀 ~ file: file.ts:55 ~ filter: ~ files", files);
                if (files === undefined || !files)
                    return reject({
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
        }
        catch (error) {
            reject({
                message: "Upload failed!",
                status: 400,
                error
            });
        }
    });
};
exports.handleuploadImage = handleuploadImage;
