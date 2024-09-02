import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNavieraDto } from './dto/create-naviera.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Navieras } from 'src/models/navieras';
import { UpdateNavieraDto } from '../Navieras/dto/update-Naviera.dto';

@Injectable()
export class NavierasService {
  constructor(
    @InjectModel(Navieras)
    private navieraModel: typeof Navieras,
  ) {}
  async create(createNavieraDto: CreateNavieraDto) {
    try {
      return await this.navieraModel.create(createNavieraDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Navieras[]> {
    return this.navieraModel.findAll({
      order: [['nombre', 'ASC']]
    });
  }

  async findOne(id: number): Promise<Navieras> {
    const navieraFound = await this.navieraModel.findOne({
      where: {
        navieraId: id,
      },
    });

    if (!navieraFound) {
      throw new HttpException('Naviera no encontrada', HttpStatus.NOT_FOUND);
    }

    return navieraFound;
  }

  async update(
    id: number,
    updateNavieraDto: UpdateNavieraDto,
  ): Promise<HttpException> {
    const navieraFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return updateNavieraDto[key] && updateNavieraDto[key] !== navieraFound[key];
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updateNavieraDto.nombre) {
        navieraFound.nombre = updateNavieraDto.nombre;
      }

      // Guardar el Naviera con los nuevos valores, disparando los hooks
      await navieraFound.save();

      return new HttpException(
        'Naviera actualizada correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} naviera`;
  }
}
