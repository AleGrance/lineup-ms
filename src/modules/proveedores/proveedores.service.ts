import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { Proveedores } from 'src/models/proveedores.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectModel(Proveedores)
    private proveedorModel: typeof Proveedores,
  ) {}

  async create(createProveedoreDto: CreateProveedoreDto) {
    try {
      return await this.proveedorModel.create(createProveedoreDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El ruc ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Proveedores[]> {
    return this.proveedorModel.findAll({
      order: [['razonSocial', 'ASC']]
    });
  }

  async findOne(id: number): Promise<Proveedores> {
    const proveedorFound = await this.proveedorModel.findOne({
      where: {
        proveedorId: id,
      },
    });

    if (!proveedorFound) {
      throw new HttpException('proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    return proveedorFound;
  }

  async update(
    id: number,
    updateProveedoreDto: UpdateProveedoreDto,
  ): Promise<HttpException> {
    const proveedorFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['razonSocial', 'ruc'].some((key) => {
      return (
        updateProveedoreDto[key] &&
        updateProveedoreDto[key] !== proveedorFound[key]
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
      if (updateProveedoreDto.razonSocial) {
        proveedorFound.razonSocial = updateProveedoreDto.razonSocial;
      }
      if (updateProveedoreDto.ruc) {
        proveedorFound.ruc = updateProveedoreDto.ruc;
      }

      // Guardar el proveedor con los nuevos valores, disparando los hooks
      await proveedorFound.save();

      return new HttpException(
        'Proveedor actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} proveedore`;
  }
}
