import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Auditorias } from 'src/models/auditorias';

@Injectable()
export class AuditoriasService {
  constructor(
    @InjectModel(Auditorias)
    private auditoriaModel: typeof Auditorias,
  ) {}

  async create(createAuditoriaDto: CreateAuditoriaDto) {
    try {
      return await this.auditoriaModel.create(createAuditoriaDto);
    } catch (error) {
      // if (error.name === 'SequelizeUniqueConstraintError') {
      //   throw new HttpException('Error interno', HttpStatus.BAD_REQUEST);
      // }
      return error;
    }
  }

  async findAll(): Promise<Auditorias[]> {
    return this.auditoriaModel.findAll();
  }

  async findOne(id: number): Promise<Auditorias> {
    const auditoriaFound = await this.auditoriaModel.findOne({
      where: {
        auditoriaId: id,
      },
    });

    if (!auditoriaFound) {
      throw new HttpException('Auditoria no encontrada', HttpStatus.NOT_FOUND);
    }

    return auditoriaFound;
  }

  async update(
    id: number,
    updateAuditoriaDto: UpdateAuditoriaDto,
  ): Promise<HttpException> {
    const auditoriaFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['campoModificado'].some((key) => {
      return (
        updateAuditoriaDto[key] &&
        updateAuditoriaDto[key] !== auditoriaFound[key]
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
      if (updateAuditoriaDto.campoModificado) {
        auditoriaFound.campoModificado = auditoriaFound.campoModificado;
      }

      // Guardar la barcaza con los nuevos valores, disparando los hooks
      await auditoriaFound.save();

      return new HttpException(
        'Auditoria actualizada correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auditoria`;
  }
}
