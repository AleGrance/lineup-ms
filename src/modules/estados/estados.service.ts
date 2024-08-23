import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Estados } from 'src/models/estados';

@Injectable()
export class EstadosService {
  constructor(
    @InjectModel(Estados)
    private estadoModel: typeof Estados,
  ) {}

  async create(createEstadoDto: CreateEstadoDto) {
    try {
      return await this.estadoModel.create(createEstadoDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Estados[]> {
    return this.estadoModel.findAll();
  }

  async findOne(id: number): Promise<Estados> {
    const estadoFound = await this.estadoModel.findOne({
      where: {
        estadoId: id,
      },
    });

    if (!estadoFound) {
      throw new HttpException('Estado no encontrado', HttpStatus.NOT_FOUND);
    }

    return estadoFound;
  }

  async update(
    id: number,
    updateEstadoDto: UpdateEstadoDto,
  ): Promise<HttpException> {
    const estadoFound = await this.findOne(id);

    console.log(updateEstadoDto);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return updateEstadoDto[key] && updateEstadoDto[key] !== estadoFound[key];
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updateEstadoDto.nombre) {
        estadoFound.nombre = updateEstadoDto.nombre;
      }

      // Guardar la estado con los nuevos valores, disparando los hooks
      await estadoFound.save();

      return new HttpException(
        'Estado actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} estado`;
  }
}
