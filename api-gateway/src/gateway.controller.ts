import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import axios from 'axios';

@Controller()
export class GatewayController {

  private async proxy(url: string, req: Request, res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url,
        data: req.body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization,
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        // Le service a répondu avec une erreur HTTP (401, 404, 400...)
        res.status(error.response.status).json(error.response.data);
      } else {
        // Le service est vraiment inaccessible
        res.status(502).json({ message: 'Service indisponible' });
      }
    }
  }

  @All('users')
  async proxyUsersRoot(@Req() req: Request, @Res() res: Response) {
    await this.proxy(`http://localhost:3000${req.url}`, req, res);
  }

  @All('users/*path')
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    await this.proxy(`http://localhost:3000${req.url}`, req, res);
  }

  @All('orders')
  async proxyOrdersRoot(@Req() req: Request, @Res() res: Response) {
    await this.proxy(`http://localhost:3001${req.url}`, req, res);
  }

  @All('orders/*path')
  async proxyOrders(@Req() req: Request, @Res() res: Response) {
    await this.proxy(`http://localhost:3001${req.url}`, req, res);
  }

  @All('auth')
  async proxyAuthRoot(@Req() req: Request, @Res() res: Response) {
    await this.proxy(`http://localhost:3000${req.url}`, req, res);
  }

  @All('auth/*path')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    await this.proxy(`http://localhost:3000${req.url}`, req, res);
  }

}