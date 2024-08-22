import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRemolcadoreDto } from './dto/create-remolcadore.dto';
import { UpdateRemolcadoreDto } from './dto/update-remolcadore.dto';
import { Remolcadores } from 'src/models/remolcadores.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RemolcadoresService {
  constructor(
    @InjectModel(Remolcadores)
    private remolcadorModel: typeof Remolcadores,
  ) {}

  async create(createRemolcadoreDto: CreateRemolcadoreDto) {
    try {
      return await this.remolcadorModel.create(createRemolcadoreDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Remolcadores[]> {
    return this.remolcadorModel.findAll();
  }

  async findOne(id: number): Promise<Remolcadores> {
    const remolcadorFound = await this.remolcadorModel.findOne({
      where: {
        remolcadorId: id,
      },
    });

    if (!remolcadorFound) {
      throw new HttpException('Remolcador no encontrado', HttpStatus.NOT_FOUND);
    }

    return remolcadorFound;
  }

  async update(
    id: number,
    updateRemolcadoreDto: UpdateRemolcadoreDto,
  ): Promise<HttpException> {
    const remolcadorFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return (
        updateRemolcadoreDto[key] &&
        updateRemolcadoreDto[key] !== remolcadorFound[key]
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
      if (updateRemolcadoreDto.nombre) {
        remolcadorFound.nombre = updateRemolcadoreDto.nombre;
      }

      // Guardar el remolcador con los nuevos valores, disparando los hooks
      await remolcadorFound.save();

      return new HttpException(
        'Remolcador actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} remolcador`;
  }
}
