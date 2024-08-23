import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Movimientos } from 'src/models/movimientos.model';
import { InjectModel } from '@nestjs/sequelize';
import { Importadores } from 'src/models/importadores.model';
import { Proveedores } from 'src/models/proveedores.model';
import { Productos } from 'src/models/productos.model';
import { Buques } from 'src/models/buques.model';
import { Barcazas } from 'src/models/barcazas.model';
import { Remolcadores } from 'src/models/remolcadores.model';
import { Boxes } from 'src/models/boxes.model';
import { Puertos } from 'src/models/puertos.model';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectModel(Movimientos)
    private movimientoModel: typeof Movimientos,
  ) {}
  async create(createMovimientoDto: CreateMovimientoDto) {
    try {
      return await this.movimientoModel.create(createMovimientoDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Movimientos[]> {
    return this.movimientoModel.findAll({
      include: [
        { model: Importadores, attributes: ['razonSocial'] },
        { model: Proveedores, attributes: ['razonSocial'] },
        { model: Productos, attributes: ['nombre'] },
        { model: Buques, attributes: ['nombre'] },
        { model: Barcazas, attributes: ['nombre'] },
        { model: Remolcadores, attributes: ['nombre'] },
        { model: Boxes, attributes: ['marca'] },
        { model: Puertos, attributes: ['nombre'] },
      ],
    });
  }

  async findOne(id: number): Promise<Movimientos> {
    const movimientoFound = await this.movimientoModel.findOne({
      where: {
        movimientoId: id,
      },
    });

    if (!movimientoFound) {
      throw new HttpException('Movimiento no encontrada', HttpStatus.NOT_FOUND);
    }

    return movimientoFound;
  }

  async update(
    id: number,
    updateMovimientoDto: UpdateMovimientoDto,
  ): Promise<HttpException> {
    console.log(updateMovimientoDto);
    const movimientoFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = [
      'cantidad',
      'fechaProbDescarga',
      'fechaArribo',
      'horaInicio',
      'horaFin',
      'urlManifiesto',
      'urlBL',
      'urlExpediente',
      'importadorId',
      'proveedorId',
      'productoId',
      'buqueId',
      'barcazaId',
      'remolcadorId',
      'boxId',
      'puertoId',
      'estadoId',
    ].some((key) => {
      return (
        updateMovimientoDto[key] &&
        updateMovimientoDto[key] !== movimientoFound[key]
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
      if (updateMovimientoDto.cantidad) {
        movimientoFound.cantidad = updateMovimientoDto.cantidad;
      }

      if (updateMovimientoDto.fechaProbDescarga) {
        movimientoFound.fechaProbDescarga =
          updateMovimientoDto.fechaProbDescarga;
      }

      if (updateMovimientoDto.fechaArribo) {
        movimientoFound.fechaArribo = updateMovimientoDto.fechaArribo;
      }

      if (updateMovimientoDto.horaInicio) {
        movimientoFound.horaInicio = updateMovimientoDto.horaInicio;
      }

      if (updateMovimientoDto.horaFin) {
        movimientoFound.horaFin = updateMovimientoDto.horaFin;
      }

      if (updateMovimientoDto.urlManifiesto) {
        movimientoFound.urlManifiesto = updateMovimientoDto.urlManifiesto;
      }

      if (updateMovimientoDto.urlBL) {
        movimientoFound.urlBL = updateMovimientoDto.urlBL;
      }

      if (updateMovimientoDto.urlExpediente) {
        movimientoFound.urlExpediente = updateMovimientoDto.urlExpediente;
      }

      if (updateMovimientoDto.importadorId) {
        movimientoFound.importadorId = updateMovimientoDto.importadorId;
      }

      if (updateMovimientoDto.proveedorId) {
        movimientoFound.proveedorId = updateMovimientoDto.proveedorId;
      }

      if (updateMovimientoDto.productoId) {
        movimientoFound.productoId = updateMovimientoDto.productoId;
      }

      if (updateMovimientoDto.buqueId) {
        movimientoFound.buqueId = updateMovimientoDto.buqueId;
      }

      if (updateMovimientoDto.barcazaId) {
        movimientoFound.barcazaId = updateMovimientoDto.barcazaId;
      }

      if (updateMovimientoDto.remolcadorId) {
        movimientoFound.remolcadorId = updateMovimientoDto.remolcadorId;
      }

      if (updateMovimientoDto.boxId) {
        movimientoFound.boxId = updateMovimientoDto.boxId;
      }

      if (updateMovimientoDto.puertoId) {
        movimientoFound.puertoId = updateMovimientoDto.puertoId;
      }

      if (updateMovimientoDto.estadoId) {
        movimientoFound.estadoId = updateMovimientoDto.estadoId;
      }

      // Guardar el movimiento con los nuevos valores, disparando los hooks
      await movimientoFound.save();

      return new HttpException(
        'Movimiento actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} movimiento`;
  }
}
