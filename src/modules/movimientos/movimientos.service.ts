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
import { Estados } from 'src/models/estados';
import { AuditoriasService } from '../auditorias/auditorias.service';
import { FiltroMovimientoDto } from './dto/filtro-movimiento.dto';
import { Op } from 'sequelize';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectModel(Movimientos)
    private movimientoModel: typeof Movimientos,
    private auditService: AuditoriasService,
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
        { model: Estados, attributes: ['nombre', 'class'] },
      ],
      order: [['horaInicio', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Movimientos> {
    const movimientoFound = await this.movimientoModel.findOne({
      where: {
        movimientoId: id,
      },
      include: [
        { model: Importadores, attributes: ['razonSocial'] },
        { model: Proveedores, attributes: ['razonSocial'] },
        { model: Productos, attributes: ['nombre'] },
        { model: Buques, attributes: ['nombre'] },
        { model: Barcazas, attributes: ['nombre'] },
        { model: Remolcadores, attributes: ['nombre'] },
        { model: Boxes, attributes: ['marca'] },
        { model: Puertos, attributes: ['nombre'] },
        { model: Estados, attributes: ['nombre'] },
      ],
    });

    if (!movimientoFound) {
      throw new HttpException('Movimiento no encontrada', HttpStatus.NOT_FOUND);
    }

    return movimientoFound;
  }

  async update(
    id: number,
    updateMovimientoDto: UpdateMovimientoDto,
    usuarioResponsable: string, // Identificador del usuario que realiza el cambio
  ): Promise<HttpException> {
    const movimientoFound = await this.findOne(id);

    // console.log('MOVIMIENTO ENCONTRADO', movimientoFound);

    const changes = [];
    [
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
    ].forEach((key) => {

      // Para el campo cantidad se valida cambiando el formato del valor porque al comparar entre entornos genera diferencias por
      // mas que no exista por ej: 2000 vs 2000.000
      if (key == 'cantidad') {

        // console.log('Anterior', movimientoFound[key].toString());
        // console.log('Actual', updateMovimientoDto[key].toFixed(3));

        if (updateMovimientoDto[key] && updateMovimientoDto[key].toFixed(3) !== movimientoFound[key].toString()) {
          changes.push({
            campoModificado: key,
            valorAnterior: movimientoFound[key],
            valorActual: updateMovimientoDto[key].toFixed(3),
          });
          movimientoFound[key] = updateMovimientoDto[key]; // Actualiza el valor en el objeto movimientoFound
        }
        
      } else {
        if (updateMovimientoDto[key] && updateMovimientoDto[key] !== movimientoFound[key]) {
          changes.push({
            campoModificado: key,
            valorAnterior: movimientoFound[key],
            valorActual: updateMovimientoDto[key],
          });
          movimientoFound[key] = updateMovimientoDto[key]; // Actualiza el valor en el objeto movimientoFound
        }
      }

        
      
    });



    if (changes.length === 0) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await movimientoFound.save();

      for (const change of changes) {
        const createAuditoriaDto = {
          campoModificado: change.campoModificado,
          valorAnterior: change.valorAnterior,
          valorActual: change.valorActual,
          usuarioResponsable,
          movimientoId: id,
        };
        await this.auditService.create(createAuditoriaDto);
      }

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

  /**
   * Filtro por parámetros
   * @param productoId
   * @param proveedorId
   * @param importadorId
   * @param fechaDesde
   * @param fechaHasta
   */

  async filtrarMovimientos(filtroMovimientoDto: FiltroMovimientoDto): Promise<Movimientos[]> {
    const { productoId, proveedorId, importadorId, buqueId, estadoId, fechaDesde, fechaHasta } = filtroMovimientoDto;

    const whereClause: any = {};

    if (productoId) whereClause.productoId = productoId;
    if (proveedorId) whereClause.proveedorId = proveedorId;
    if (importadorId) whereClause.importadorId = importadorId;
    if (buqueId) whereClause.buqueId = buqueId;
    if (estadoId) whereClause.estadoId = estadoId;
    if (fechaDesde) whereClause.fechaProbDescarga = { [Op.between]: [fechaDesde, fechaHasta] };
    // if (fechaHasta) whereClause.fechaProbDescarga = { [Op.lte]: fechaHasta };

    return this.movimientoModel.findAll({
      where: whereClause,
      include: [
        { model: Importadores, attributes: ['razonSocial'] },
        { model: Proveedores, attributes: ['razonSocial'] },
        { model: Productos, attributes: ['nombre'] },
        { model: Buques, attributes: ['nombre'] },
        { model: Barcazas, attributes: ['nombre'] },
        { model: Remolcadores, attributes: ['nombre'] },
        { model: Boxes, attributes: ['marca'] },
        { model: Puertos, attributes: ['nombre'] },
        { model: Estados, attributes: ['nombre', 'class'] },
      ],
      order: [['horaInicio', 'ASC']],
    });
  }
}
