import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CallService } from './call.service';
import { Request, Response } from 'express';
import { exportToExcel, JsonResponse, uploadFileHelper } from 'src/helpers';
import { createCall, updateCall } from './schema/call.validate';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CallSwagger } from 'src/swagger';
import { CallSchema } from './schema/call.schema';

@ApiTags('call')
@Controller('api')
export class CallController {
  constructor(private callService: CallService) {}

  @UseGuards(AuthGuard('auth'))
  @ApiBearerAuth('auth')
  @Get('call')
  async getCall(@Req() req: Request, @Res() res: Response) {
    try {
      const dataResult: CallSchema[] = await this.callService.getCall();
      return res
        .status(200)
        .json(JsonResponse(false, 'query success', dataResult));
    } catch (error) {
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @UseGuards(AuthGuard('auth'))
  @ApiBearerAuth('auth')
  @ApiParam({ name: 'id', type: 'string' })
  @Get('call/:id')
  async getById(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;
      const dataResult: CallSchema[] = await this.callService.filter({ id });
      return res
        .status(200)
        .json(JsonResponse(false, 'query success', dataResult));
    } catch (error) {
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @ApiBearerAuth('auth')
  @ApiBody({ type: CallSwagger })
  @UseGuards(AuthGuard('auth'))
  @Post('call')
  async postCall(@Req() req: Request | any, @Res() res: Response) {
    try {
      const { body } = req;
      await createCall.validateAsync({
        ...body,
        username: req.user.fullname,
        userId: req.user._id.toString(),
      });
      const dataCreated: CallSchema = await this.callService.createCall({
        ...req.body,
        username: req.user.fullname,
        userId: req.user._id.toString(),
      });
      return res.status(201).json(JsonResponse(false, 'created', dataCreated));
    } catch (error) {
      if (error.isJoi) {
        return res.status(422).json(JsonResponse(true, error.message));
      }
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @ApiBearerAuth('auth ')
  @UseGuards(AuthGuard('auth'))
  @ApiBody({ type: CallSwagger })
  @ApiParam({ name: 'id', type: 'string' })
  @Put('call/:id')
  async updateCall(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;
      const { body } = req;
      await updateCall.validateAsync({
        id,
        ...body,
      });
      await this.callService.update(body, id);
      return res.status(200).json(JsonResponse(false, 'updated'));
    } catch (error) {
      if (error.isJoi) {
        return res.status(422).json(JsonResponse(true, error.message));
      }
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @UseGuards(AuthGuard('auth'))
  @ApiBearerAuth('auth')
  @ApiParam({ name: 'id', type: 'string' })
  @Delete('call/:id')
  async deleteCall(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;
      await this.callService.delete({ id });
      return res.status(200).json(JsonResponse(false, 'deleted'));
    } catch (error) {
      if (error.isJoi) {
        return res.status(422).json(JsonResponse(true, error.message));
      }
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @Get('call/download/:name')
  async downloadFileReport(@Req() req: Request, @Res() res: Response) {
    const fileName = req.params.name;
    const directoryPath = '../../Demo/demo-nest/filesave/';
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        return res.status(500).json(JsonResponse(true, err.message));
      }
    });
  }

  @Post('call/upload')
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    try {
      await uploadFileHelper(req, res);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (req.file == undefined) {
        return res.status(400).send({ message: 'Please upload a file!' });
      }

      res.status(200).json(JsonResponse(false, 'upload completed'));
    } catch (err) {
      if (err.code == 'LIMIT_FILE_SIZE') {
        return res
          .status(500)
          .json(
            JsonResponse(
              true,
              'File size cannot be larger than 2MB!',
              err.message,
            ),
          );
      }

      res.status(500).json(JsonResponse(true, 'upload fail', err.message));
    }
  }

  @Get('/:excel')
  async excelFunction(@Req() req: Request, @Res() res: Response) {
    const key = req.params.excel;
    switch (key) {
      case 'export-excel':
        try {
          const today = new Date();
          const dataReult = await this.callService.getCall();
          const workSheetColumnName = ['username', 'is-call', 'time'];
          const date =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate();
          const time =
            today.getHours() +
            ':' +
            today.getMinutes() +
            ':' +
            today.getSeconds();
          const path = `../../Demo/demo-nest/filesave/excel-${date}_${time}.xlsx`;
          const workSheetName = 'is-call';
          exportToExcel(dataReult, workSheetColumnName, workSheetName, path);
          return res.status(200).json(JsonResponse(false, 'export success'));
        } catch (error) {
          return res.status(500).json(JsonResponse(true, error.message));
        }
      case 'list-excel':
        try {
          const directoryPath = '../../Demo/demo-nest/filesave/';
          const fsPromise = fs.promises;
          const fileInfos = [];

          const files = await fsPromise.readdir(directoryPath);

          files.forEach((file) => {
            fileInfos.push({
              name: file,
              url: process.env.BASE_URL + '/api/call/download/' + file,
            });
          });

          return res
            .status(200)
            .json(JsonResponse(false, 'get list file', fileInfos));
        } catch (error) {
          return res.status(500).json(JsonResponse(true, error.message));
        }
      default:
        return res.status(404).json(JsonResponse(true, 'not found'));
    }
  }

  // async exportExcel(@Req() req: Request, @Res() res: Response) {
  //   try {
  //     const current = new Date();
  //     const dataReult = await this.callService.getCall();
  //     const workSheetColumnName = ['username', 'is-call', 'time'];
  //     const time = current.toLocaleTimeString();
  //     const path = `../../Demo/demo-nest/filesave/excel-${time}.xlsx`;
  //     const workSheetName = 'is-call';
  //     exportToExcel(dataReult, workSheetColumnName, workSheetName, path);
  //     return res.status(200).json(JsonResponse(false, 'export success'));
  //   } catch (error) {
  //     return res.status(500).json(JsonResponse(true, error.message));
  //   }
  // }

  // async listExcel(@Req() req: Request, @Res() res: Response) {
  //   try {
  //     const directoryPath = '../../Demo/demo-nest/filesave/';
  //     const fsPromise = fs.promises;
  //     const fileInfos = [];

  //     const files = await fsPromise.readdir(directoryPath);

  //     files.forEach((file) => {
  //       fileInfos.push({
  //         name: file,
  //         url: process.env.BASE_URL + file,
  //       });
  //     });

  //     res.status(200).json(JsonResponse(false, 'get list file', fileInfos));
  //   } catch (error) {
  //     return res.status(500).json(JsonResponse(true, error.message));
  //   }
  // }
}
