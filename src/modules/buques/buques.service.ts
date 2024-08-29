import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBuqueDto } from './dto/create-buque.dto';
import { UpdateBuqueDto } from './dto/update-buque.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Buques } from 'src/models/buques.model';

@Injectable()
export class BuquesService {
  constructor(
    @InjectModel(Buques)
    private buqueModel: typeof Buques,
  ) {}
  async create(createBuqueDto: CreateBuqueDto) {
    try {
      return await this.buqueModel.create(createBuqueDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Buques[]> {
    return this.buqueModel.findAll({
      order: [['nombre', 'ASC']]
    });
  }

  async findOne(id: number): Promise<Buques> {
    const buquesFound = await this.buqueModel.findOne({
      where: {
        buqueId: id,
      },
    });

    if (!buquesFound) {
      throw new HttpException('Barcaza no encontrada', HttpStatus.NOT_FOUND);
    }

    return buquesFound;
  }

  async update(
    id: number,
    updateBuqueDto: UpdateBuqueDto,
  ): Promise<HttpException> {
    const barcazaFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return updateBuqueDto[key] && updateBuqueDto[key] !== barcazaFound[key];
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updateBuqueDto.nombre) {
        barcazaFound.nombre = updateBuqueDto.nombre;
      }

      // Guardar el buque con los nuevos valores, disparando los hooks
      await barcazaFound.save();

      return new HttpException(
        'Buque actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} buque`;
  }
}
