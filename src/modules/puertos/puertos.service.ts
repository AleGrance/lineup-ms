import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePuertoDto } from './dto/create-puerto.dto';
import { UpdatePuertoDto } from './dto/update-puerto.dto';
import { Puertos } from 'src/models/puertos.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PuertosService {
  constructor(
    @InjectModel(Puertos)
    private puertoModel: typeof Puertos,
  ) {}
  async create(createPuertoDto: CreatePuertoDto) {
    try {
      return await this.puertoModel.create(createPuertoDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Puertos[]> {
    return this.puertoModel.findAll();
  }

  async findOne(id: number): Promise<Puertos> {
    const puertoFound = await this.puertoModel.findOne({
      where: {
        puertoId: id,
      },
    });

    if (!puertoFound) {
      throw new HttpException('Puerto no encontrada', HttpStatus.NOT_FOUND);
    }

    return puertoFound;
  }

  async update(
    id: number,
    updatePuertoDto: UpdatePuertoDto,
  ): Promise<HttpException> {
    const puertoFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return (
        updatePuertoDto[key] && updatePuertoDto[key] !== puertoFound[key]
      );
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updatePuertoDto.nombre) {
        puertoFound.nombre = updatePuertoDto.nombre;
      }

      // Guardar el puerto con los nuevos valores, disparando los hooks
      await puertoFound.save();

      return new HttpException(
        'Puerto actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} puerto`;
  }
}
