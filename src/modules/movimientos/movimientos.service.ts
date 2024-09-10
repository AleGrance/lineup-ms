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
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

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
        { model: Boxes, attributes: ['nombre'] },
        { model: Puertos, attributes: ['nombre'] },
        { model: Estados, attributes: ['nombre', 'class'] },
      ],
      order: [
        ['fechaProbDescarga', 'ASC'],
        ['horaInicio', 'ASC'],
      ],
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
        { model: Boxes, attributes: ['nombre'] },
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

    let changes = [];

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
        if (updateMovimientoDto[key] && updateMovimientoDto[key].toFixed(3) !== movimientoFound[key].toString()) {
          changes.push({
            campoModificado: key,
            valorAnterior: movimientoFound[key],
            valorActual: updateMovimientoDto[key].toFixed(3),
          });
          movimientoFound[key] = updateMovimientoDto[key]; // Actualiza el valor en el objeto movimientoFound
        }
      }
      
      if ((key == 'urlManifiesto' || key == 'urlBL' || key == 'urlExpediente') && updateMovimientoDto[key]) {

        // console.log(key, updateMovimientoDto[key]);
        // console.log(key, movimientoFound[key]);

        // Se registra un nuevo archivo
        if (!movimientoFound[key]) {
          changes.push({
            campoModificado: key,
            valorAnterior: null,
            valorActual: updateMovimientoDto[key],
          });
          movimientoFound[key] = updateMovimientoDto[key]; // Actualiza el valor en el objeto movimientoFound
        }
         
      } 

      if(key == 'horaInicio' || key == 'horaFin') {      
        if (updateMovimientoDto[key] && updateMovimientoDto[key].toString() !== movimientoFound[key].toString().slice(0,5)) {
          changes.push({
            campoModificado: key,
            valorAnterior: movimientoFound[key].toString().slice(0,5),
            valorActual: updateMovimientoDto[key],
          });
          movimientoFound[key] = updateMovimientoDto[key]; // Actualiza el valor en el objeto movimientoFound
        }
      }
      
      if (key != 'urlManifiesto' && key != 'urlBL' && key != 'urlExpediente' && key != 'cantidad' && key != 'horaInicio' && key != 'horaFin') {
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
        // console.log('se inserta auditoria', change);
        
        const createAuditoriaDto = {
          campoModificado: change.campoModificado,
          valorAnterior: change.valorAnterior,
          valorActual: change.valorActual,
          usuarioResponsable,
          movimientoId: id,
        };

        // Insertar registro de auditoria
        try {
          await this.auditService.create(createAuditoriaDto);
        } catch (error) {
          return error;
        }
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

  async filtrarMovimientos(filtroMovimientoDto: FiltroMovimientoDto): Promise<Movimientos[]> {
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
        { model: Boxes, attributes: ['nombre'] },
        { model: Puertos, attributes: ['nombre'] },
        { model: Estados, attributes: ['nombre', 'class'] },
      ],
      order: [
        ['fechaProbDescarga', 'ASC'],
        ['horaInicio', 'ASC'],
      ],
    });
  }

  /**
  * Paginación
  */

  // PAGINADO DE PRODUCTOS
  async getMovimientosPaginados(paginationMovimientoDto: PaginationMovimientoDto): Promise<PaginatedMovimientoDto> {
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
      let [tabla, campo] = '';
      let orderDirection = '';

      if (paginationMovimientoDto.order.length > 0) {
        [tabla, campo] = paginationMovimientoDto.order[0].name.split('.');
        orderDirection = paginationMovimientoDto.order[0].dir || 'asc';

        console.log(tabla, campo, orderDirection);
      }

      const response = await this.movimientoModel.findAndCountAll({
        offset: paginationMovimientoDto.start,
        limit: paginationMovimientoDto.length,
        order: !paginationMovimientoDto.order[0]
          ? []
          : [[tabla, campo, orderDirection]],

        include: [
          { model: Importadores, attributes: ['razonSocial'] },
          { model: Proveedores, attributes: ['razonSocial'] },
          { model: Productos, attributes: ['nombre'] },
          { model: Buques, attributes: ['nombre'] },
          { model: Navieras, attributes: ['nombre'] },
          { model: Remolcadores, attributes: ['nombre'] },
          { model: Boxes, attributes: ['nombre'] },
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

  /**
   * Reporte en linea
   */

  async getMovimientosLinea(): Promise<Movimientos[]> {
    console.log('movimientos en linea');

    const hoy = new Date();

    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const primerDiaMesFormated = moment(primerDiaMes, 'yyyy-MM-dd');
    const hoyFormated = moment(hoy, 'yyyy-MM-dd');

    // Sumar 15 días a la fecha de hoy
    const fechaMas15Dias = hoyFormated.add(15, 'days');

    return this.movimientoModel.findAll({
      where: {
        fechaProbDescarga: {
          [Op.between]: [primerDiaMesFormated, fechaMas15Dias],
        },
        horaInicio: { [Op.not]: null },
      },
      include: [
        { model: Importadores, attributes: ['razonSocial'] },
        { model: Proveedores, attributes: ['razonSocial'] },
        { model: Productos, attributes: ['nombre'] },
        { model: Buques, attributes: ['nombre'] },
        { model: Navieras, attributes: ['nombre'] },
        { model: Remolcadores, attributes: ['nombre'] },
        { model: Boxes, attributes: ['nombre'] },
        { model: Puertos, attributes: ['nombre'] },
        { model: Estados, attributes: ['nombre', 'class'] },
      ],
      order: [
        ['fechaProbDescarga', 'ASC'],
        ['horaInicio', 'ASC'],
      ],
    });
  }

  /**
   * Eliminar archivo adjunto
   */

  async removeFile(id: number, body: any, usuarioResponsable: string): Promise<HttpException> {
    const movimientoFound = await this.findOne(id);

    const campoModificado = body.campoModificado;

    // Ruta completa del archivo a eliminar
    const filePath = path.join('./', movimientoFound[campoModificado]);

    const change = {
      campoModificado: campoModificado,
      valorAnterior: movimientoFound[campoModificado],
      valorActual: null,
    };
    
    movimientoFound[campoModificado] = null;
    
    try {
      // Actualizar el campo del registro del movimiento
      await movimientoFound.save();
      
      const createAuditoriaDto = {
        campoModificado: change.campoModificado,
        valorAnterior: change.valorAnterior,
        valorActual: change.valorActual,
        usuarioResponsable,
        movimientoId: id,
      };

      // Insertar registro de auditoria
      try {
        await this.auditService.create(createAuditoriaDto);
      } catch (error) {
        return error;
      }

      // Eliminar el archivo
      if (fs.existsSync(filePath)) {
        console.log('Elimina el archivo', filePath);
        
        try {
          fs.unlinkSync(filePath); // Elimina el archivo
          return new HttpException('Movimiento actualizado correctamente', HttpStatus.OK);
        } catch (error) {
          throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

    } catch (error) {
      // throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
      return error
    }

    

    
  }
}
