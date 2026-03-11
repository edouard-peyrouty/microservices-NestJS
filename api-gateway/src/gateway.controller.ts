import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import axios from 'axios';

@Controller()
export class GatewayController {

  @All('users')
  async proxyUsersRoot(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:3000${req.url}`,
        data: req.body,
        headers: { 'Content-Type': 'application/json' },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(502).json({ message: 'Service indisponible' });
    }
  }

  @All('users/*path')
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:3000${req.url}`,
        data: req.body,
        headers: { 'Content-Type': 'application/json' },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(502).json({ message: 'Service indisponible' });
    }
  }

  @All('orders')
  async proxyOrdersRoot(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:3001${req.url}`,
        data: req.body,
        headers: { 'Content-Type': 'application/json' },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(502).json({ message: 'Service indisponible' });
    }
  }

  @All('orders/*path')
  async proxyOrders(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:3001${req.url}`,
        data: req.body,
        headers: { 'Content-Type': 'application/json' },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(502).json({ message: 'Service indisponible' });
    }
  }

  @All('auth')
  async proxyAuthRoot(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:3000${req.url}`,
        data: req.body,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization,
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(502).json({ message: 'Service indisponible' });
    }
  }

  @All('auth/*path')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:3000${req.url}`,
        data: req.body,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization,
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(502).json({ message: 'Service indisponible' });
    }
  }

}