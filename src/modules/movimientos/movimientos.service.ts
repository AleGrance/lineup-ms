import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Movimientos } from 'src/models/movimientos.model';
import { InjectModel } from '@nestjs/sequelize';
import { Importadores } from 'src/models/importadores.model';
import { Proveedores } from 'src/models/proveedores.model';
import { Productos } from 'src/models/productos.model';
import { Buques } from 'src/models/buques.model';
import { Remolcadores } from 'src/models/remolcadores.model';
import { Boxes } from 'src/models/boxes.model';
import { Puertos } from 'src/models/puertos.model';
import { Estados } from 'src/models/estados';
import { AuditoriasService } from '../auditorias/auditorias.service';
import { FiltroMovimientoDto } from './dto/filtro-movimiento.dto';
import { Op } from 'sequelize';
import { Navieras } from 'src/models/navieras';
import { PaginationMovimientoDto } from './dto/pagination-movimiento.dto';
import { PaginatedMovimientoDto } from './dto/paginated-movimiento.dto';

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
      } else {
        return error;
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
        { model: Navieras, attributes: ['nombre'] },
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
        { model: Navieras, attributes: ['nombre'] },
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
      'barcaza',
      'urlManifiesto',
      'urlBL',
      'urlExpediente',
      'importadorId',
      'proveedorId',
      'productoId',
      'buqueId',
      'navieraId',
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

        if (
          updateMovimientoDto[key] &&
          updateMovimientoDto[key].toFixed(3) !==
            movimientoFound[key].toString()
        ) {
          changes.push({
            campoModificado: key,
            valorAnterior: movimientoFound[key],
            valorActual: updateMovimientoDto[key].toFixed(3),
          });
          movimientoFound[key] = updateMovimientoDto[key]; // Actualiza el valor en el objeto movimientoFound
        }
      } else {
        if (
          updateMovimientoDto[key] &&
          updateMovimientoDto[key] !== movimientoFound[key]
        ) {
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
   * Filtro de busqueda por parámetros
   * @param productoId
   * @param proveedorId
   * @param importadorId
   * @param fechaDesde
   * @param fechaHasta
   */

  async filtrarMovimientos(
    filtroMovimientoDto: FiltroMovimientoDto,
  ): Promise<Movimientos[]> {
    const {
      productoId,
      proveedorId,
      importadorId,
      buqueId,
      estadoId,
      fechaDesde,
      fechaHasta,
    } = filtroMovimientoDto;

    const whereClause: any = {};

    if (productoId) whereClause.productoId = productoId;
    if (proveedorId) whereClause.proveedorId = proveedorId;
    if (importadorId) whereClause.importadorId = importadorId;
    if (buqueId) whereClause.buqueId = buqueId;
    if (estadoId) whereClause.estadoId = estadoId;
    if (fechaDesde)
      whereClause.fechaProbDescarga = {
        [Op.between]: [fechaDesde, fechaHasta],
      };
    // if (fechaHasta) whereClause.fechaProbDescarga = { [Op.lte]: fechaHasta };

    return this.movimientoModel.findAll({
      where: whereClause,
      include: [
        { model: Importadores, attributes: ['razonSocial'] },
        { model: Proveedores, attributes: ['razonSocial'] },
        { model: Productos, attributes: ['nombre'] },
        { model: Buques, attributes: ['nombre'] },
        { model: Navieras, attributes: ['nombre'] },
        { model: Remolcadores, attributes: ['nombre'] },
        { model: Boxes, attributes: ['marca'] },
        { model: Puertos, attributes: ['nombre'] },
        { model: Estados, attributes: ['nombre', 'class'] },
      ],
      order: [['horaInicio', 'ASC']],
    });
  }

  /**
   * Paginación
   */

  // PAGINADO DE PRODUCTOS
  async getMovimientosPaginados(
    paginationMovimientoDto: PaginationMovimientoDto,
  ): Promise<PaginatedMovimientoDto> {
    try {
      const counts = await this.movimientoModel.count();

      var result = {
        data: [],
        recordsTotal: 0,
        recordsFiltered: 0,
      };

      if (!counts) {
        return result;
      }

      result.recordsTotal = counts;

      // Aquí se utiliza el índice de la columna directamente
      // const orderColumnIndex = paginationMovimientoDto.order[0].name;
      // const orderDirection = paginationMovimientoDto.order[0].dir || 'asc';

      // console.log(orderColumnIndex, orderDirection);

      const response = await this.movimientoModel.findAndCountAll({
        offset: paginationMovimientoDto.start,
        limit: paginationMovimientoDto.length,
        // order: [['buque.nombre', 'asc']],
        // order: [
        //   [{ model: Buques, as: 'buque' }, 'nombre', paginationMovimientoDto.order[0].dir || 'asc']
        // ],
        // order: ['Buque', 'nombre', 'DESC'],

        include: [
          { model: Importadores, attributes: ['razonSocial'] },
          { model: Proveedores, attributes: ['razonSocial'] },
          { model: Productos, attributes: ['nombre'] },
          { model: Buques, attributes: ['nombre'] },
          { model: Navieras, attributes: ['nombre'] },
          { model: Remolcadores, attributes: ['nombre'] },
          { model: Boxes, attributes: ['marca'] },
          { model: Puertos, attributes: ['nombre'] },
          { model: Estados, attributes: ['nombre'] },
        ],
      });

      result.recordsFiltered = response.count;
      result.data = response.rows;
      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
