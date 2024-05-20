import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import { Request, Response } from "express";

export const form = formidable({
    uploadDir: __dirname + "/../uploads",
    keepExtensions: true,
    minFileSize: 0,
    allowEmptyFiles: true,
  });

  export function formUpload(form: IncomingForm, req: Request): Promise<{content: string, image: string}> {
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(new Error(err))
            }
      
            let memoContent: string = "" 
            let memoImage: string = "" 
            if (fields.content) {
              memoContent = fields.content[0];
            }      
            if (Array.isArray(files.photo)) {
              memoImage = files.photo[0].newFilename;
            }
      
            resolve({
                content: memoContent,
                image: memoImage,
            })
    
          });
    })
  }