import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Boxes } from 'src/models/boxes.model';

@Injectable()
export class BoxesService {
  constructor(
    @InjectModel(Boxes)
    private boxesModel: typeof Boxes,
  ) {}

  async create(createBoxDto: CreateBoxDto) {
    try {
      return await this.boxesModel.create(createBoxDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Boxes[]> {
    return this.boxesModel.findAll();
  }

  async findOne(id: number): Promise<Boxes> {
    const boxFound = await this.boxesModel.findOne({
      where: {
        boxId: id,
      },
    });

    if (!boxFound) {
      throw new HttpException('Box no encontrado', HttpStatus.NOT_FOUND);
    }

    return boxFound;
  }

  async update(id: number, updateBoxDto: UpdateBoxDto): Promise<HttpException> {
    const boxFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['capacidad', 'marca'].some((key) => {
      return updateBoxDto[key] && updateBoxDto[key] !== boxFound[key];
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updateBoxDto.capacidad) {
        boxFound.capacidad = updateBoxDto.capacidad;
      }
      if (updateBoxDto.marca) {
        boxFound.marca = updateBoxDto.marca;
      }

      // Guardar el box con los nuevos valores, disparando los hooks
      await boxFound.save();

      return new HttpException('Box actualizado correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} box`;
  }
}
