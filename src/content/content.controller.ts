import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Content } from './content.type';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private service: ContentService) {}

  @Get()
  async getAll(@Res() res: Response): Promise<void> {
    const data = this.service.getContent('main');
    return data.then((data: string) => {
      res.status(HttpStatus.OK).json(data);
    });
  }

  @Get(':firstname')
  async getByFirstname(
    @Res() res: Response,
    @Param('firstname') params: string,
  ) {
    const data = this.service.getContent('main');
    return data
      .then((data: Content[]) =>
        data.filter(
          (item) => item.firstname.toLowerCase() === params.toLowerCase(),
        ),
      )
      .then((data: Content[]) => {
        res.status(HttpStatus.OK).json(data);
      });
  }

  @Put(':id')
  async getByIdAndChangeValues(
    @Param('id') params: string,
    @Body() body: Content,
    @Res() res: Response,
  ) {
    const data = this.service.getContent('main');
    return data
      .then((data: Content[]) =>
        data.map((data) => {
          if (data.id === parseInt(params)) {
            return body;
          }
          return data;
        }),
      )
      .then((data) => {
        this.service.setContent('main', data);
        res.status(HttpStatus.OK).json(data);
      });
  }

  @Put('firstname/:id')
  async getByIdAndChangeFirstname(
    @Param('id') params: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const data = this.service.getContent('main');
    return data
      .then((data: Content[]) =>
        data.map((data) => {
          if (data.id === parseInt(params)) {
            return { ...data, firstname: body.firstname };
          }
          return data;
        }),
      )
      .then((data) => {
        this.service.setContent('main', data);
        res.status(HttpStatus.OK).json(data);
      });
  }

  @Put('add/cities')
  async addCities(@Res() res: Response) {
    const data = this.service.getContent('main');
    return data
      .then((data: Content[]) =>
        data.map((item) => {
          switch (item.id) {
            case 1:
            case 2:
              return { ...item, city: 'Clermont-Ferrand' };
            case 3:
              return { ...item, city: 'Vichy' };
            case 4:
              return { ...item, city: 'Thiers' };
            case 5:
            case 6:
              return { ...item, city: "Cournon d'Auvergne" };
          }
        }),
      )
      .then((data) => {
        this.service.setContent('main', data);
        res.sendStatus(HttpStatus.OK);
      });
  }
}
