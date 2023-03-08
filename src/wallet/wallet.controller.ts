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
import { JsonResponse } from 'src/helpers';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express';
import { validateParams, validateWallet } from './schemas/wallet.validate';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard('auth'))
  @Get()
  async getAllWallet(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.walletService.getAllWallet();
      return res.status(200).json(JsonResponse(false, 'query success', data));
    } catch (error) {
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @UseGuards(AuthGuard('auth'))
  @Post()
  async postWallet(@Req() req: Request, @Res() res: Response) {
    try {
      const { body } = req;
      await validateWallet.validateAsync({
        ...body,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        userId: req.user._id.toString(),
      });
      const checkNameWallet = await this.walletService.filterWallet({
        name: body.name,
      });
      if (!checkNameWallet) {
        const dataCreate = await this.walletService.createWallet({
          ...body,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          userId: req.user._id.toString(),
        });
        return res.status(201).json(JsonResponse(false, 'created', dataCreate));
      }
      return res.status(500).json(JsonResponse(false, 'name duplicated'));
    } catch (error) {
      if (error.isJoi) {
        return res.status(422).json(JsonResponse(true, error.message));
      }
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @UseGuards(AuthGuard('auth'))
  @Put(':id')
  async updateWallet(@Req() req: Request, @Res() res: Response) {
    try {
      const { body } = req;
      const { id } = req.params;
      const dataFind = await this.walletService.filterWallet({ id });
      if (dataFind) {
        await validateWallet.validateAsync({
          ...body,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          userId: req.user._id.toString(),
        });
        const dataUpdate = await this.walletService.updateWallet(id, {
          ...body,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          userId: req.user._id.toString(),
        });
        return res.status(200).json(JsonResponse(false, 'updated', dataUpdate));
      }
      return res.status(404).json(JsonResponse(false, 'not found'));
    } catch (error) {
      if (error.isJoi) {
        return res.status(422).json(JsonResponse(true, error.message));
      }
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }

  @UseGuards(AuthGuard('auth'))
  @Delete(':id')
  async deleteWallet(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;
      const dataFind = await this.walletService.filterWallet({ id });
      if (dataFind) {
        await validateParams.validateAsync({ id });
        await this.walletService.deleteWallet(id);
        return res.status(200).json(JsonResponse(false, 'deleted'));
      }
      return res.status(404).json(JsonResponse(false, 'not found'));
    } catch (error) {
      if (error.isJoi) {
        return res.status(422).json(JsonResponse(true, error.message));
      }
      return res.status(500).json(JsonResponse(true, error.message));
    }
  }
}
