import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBarcazaDto } from './dto/create-barcaza.dto';
import { UpdateBarcazaDto } from './dto/update-barcaza.dto';
import { Barcazas } from 'src/models/barcazas.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BarcazasService {
  constructor(
    @InjectModel(Barcazas)
    private barcazaModel: typeof Barcazas,
  ) {}

  async create(createBarcazaDto: CreateBarcazaDto) {
    try {
      return await this.barcazaModel.create(createBarcazaDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Barcazas[]> {
    return this.barcazaModel.findAll();
  }

  async findOne(id: number): Promise<Barcazas> {
    const barcazaFound = await this.barcazaModel.findOne({
      where: {
        barcazaId: id,
      },
    });

    if (!barcazaFound) {
      throw new HttpException('Barcaza no encontrada', HttpStatus.NOT_FOUND);
    }

    return barcazaFound;
  }

  async update(
    id: number,
    updateBarcazaDto: UpdateBarcazaDto,
  ): Promise<HttpException> {
    const barcazaFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return (
        updateBarcazaDto[key] && updateBarcazaDto[key] !== barcazaFound[key]
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
      if (updateBarcazaDto.nombre) {
        barcazaFound.nombre = updateBarcazaDto.nombre;
      }

      // Guardar la barcaza con los nuevos valores, disparando los hooks
      await barcazaFound.save();

      return new HttpException(
        'Barcaza actualizada correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} barcaza`;
  }
}
