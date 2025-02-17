import { Request, Response } from 'express';
import multer from 'multer';
import { Crop, Image, MediaInterface } from '../../interfaces/media';
import { Media } from '../models';
import { errorResponse, successResponse } from '../utils/responses';
import mediaRouter from './router';
import {
  createMediaRecord,
  removeImage,
  storeImage,
} from '../utils/media.helper';
import { ImageStorageResult } from '../../interfaces/misc';

class customStorage {
  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, file?: Partial<Express.Multer.File>) => void,
  ): Promise<void> {
    try {
      req.body.uploadResult = await storeImage(
        file,
        req.body.filename,
        JSON.parse(req.body.crops),
      );

      cb(null, file);
    } catch (e) {
      cb(e as Error);
    }
  }

  _removeFile(
    req: Request,
    file: any,
    cb: (error: Error | null) => void,
  ): void {
    try {
      delete file.buffer;
      cb(null);
    } catch (e) {
      cb(e as Error);
    }
  }
}

const upload = multer({
  storage: new customStorage(),
  limits: { fileSize: 5242880 /* bytes */ }, // 5mb
});

mediaRouter.get('/media/image/:id', async (req: Request, res: Response) => {
  let { id } = req.params;

  const data = await Media.findById(parseInt(id));

  if (data) {
    const basePath = `${process.env.ASSETS_URI}${data.path}/`;

    successResponse(res, {
      data,
      full: `${basePath}${data.filename}`,
      thumbnail: `${basePath}thumbs/${data.filename}`,
    });
  } else {
    errorResponse(res, 'Image not found', 404);
  }
});

mediaRouter.get('/media/:page?', async (req: Request, res: Response) => {
  let { page } = req.params;

  if (!page) {
    page = '1';
  }

  const media = await Media.findAll(parseInt(page));

  const { total } = media;

  const contents: Image[] = media.contents.map((image: MediaInterface) => {
    const basePath = `${process.env.ASSETS_URI}${image.path}/`;

    return {
      data: image,
      full: `${basePath}${image.filename}`,
      thumbnail: `${basePath}thumbs/${image.filename}`,
    };
  });

  successResponse(res, {
    contents,
    total,
    page: parseInt(page),
  });
});

mediaRouter.get(
  '/media/getValidFileName/:name',
  async (req: Request, res: Response) => {
    const validName = await Media.getNewFileName(req.params.name);

    successResponse(res, { validName });
  },
);

mediaRouter.post(
  '/media/create',
  upload.single('file'),
  async (req: Request, res: Response) => {
    const uploadResult = req.body.uploadResult as ImageStorageResult;

    if (!uploadResult.success) {
      errorResponse(res, 'upload error');
      return;
    }

    const newMedia = await createMediaRecord(
      req.file as unknown as Express.Multer.File,
      req.body.filename,
      req.body.alt,
      req.body.s3Data,
    );

    if (newMedia.success) {
      successResponse(res, newMedia);
    } else {
      errorResponse(res, newMedia.error?.message as string);
    }
  },
);

mediaRouter.delete('/media/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await removeImage(parseInt(id));

  if (result.success) {
    await result.media?.destroy();
  }

  successResponse(res, result);
});

mediaRouter.patch('/media/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    errorResponse(res, 'Invalid Image Id', 400);
    return;
  }

  const media = await Media.findById(Number(id));

  if (!media) {
    errorResponse(res, 'Image not found', 404);
    return;
  }

  const { alt } = req.body;

  if (req.body.crops) {
    const crops: { [key: string]: Crop } = req.body.crops;
    // TODO: handle crop updates
  }

  media.alt = alt;

  await media.save();

  successResponse(res, media);
});

export default mediaRouter;
