import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImportadorDto } from './dto/create-importadore.dto';
import { UpdateImportadorDto } from './dto/update-importadore.dto';
import { Importadores } from 'src/models/importadores.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ImportadoresService {
  constructor(
    @InjectModel(Importadores)
    private importadorModel: typeof Importadores,
  ) {}

  async create(createImportadorDto: CreateImportadorDto) {
    try {
      return await this.importadorModel.create(createImportadorDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El ruc ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Importadores[]> {
    return this.importadorModel.findAll({
      order: [['razonSocial', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Importadores> {
    const importadorFound = await this.importadorModel.findOne({
      where: {
        importadorId: id,
      },
    });

    if (!importadorFound) {
      throw new HttpException('Importador no encontrado', HttpStatus.NOT_FOUND);
    }

    return importadorFound;
  }

  async update(
    id: number,
    updateImportadorDto: UpdateImportadorDto,
  ): Promise<HttpException> {
    const importadorFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['razonSocial', 'ruc'].some((key) => {
      return (
        updateImportadorDto[key] &&
        updateImportadorDto[key] !== importadorFound[key]
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
      if (updateImportadorDto.razonSocial) {
        importadorFound.razonSocial = updateImportadorDto.razonSocial;
      }
      if (updateImportadorDto.ruc) {
        importadorFound.ruc = updateImportadorDto.ruc;
      }

      // Guardar el importador con los nuevos valores, disparando los hooks
      await importadorFound.save();

      return new HttpException(
        'Importador actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} importadore`;
  }
}
