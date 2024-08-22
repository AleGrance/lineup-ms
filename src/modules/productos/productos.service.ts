import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Productos } from 'src/models/productos.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Productos)
    private productoModel: typeof Productos,
  ) {}
  async create(createProductoDto: CreateProductoDto) {
    try {
      return await this.productoModel.create(createProductoDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Productos[]> {
    return this.productoModel.findAll();
  }

  async findOne(id: number): Promise<Productos> {
    const productoFound = await this.productoModel.findOne({
      where: {
        productoId: id,
      },
    });

    if (!productoFound) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }

    return productoFound;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<HttpException> {
    const productoFound = await this.findOne(id);

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['nombre'].some((key) => {
      return updateProductoDto[key] && updateProductoDto[key] !== productoFound[key];
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updateProductoDto.nombre) {
        productoFound.nombre = updateProductoDto.nombre;
      }

      // Guardar el producto con los nuevos valores, disparando los hooks
      await productoFound.save();

      return new HttpException(
        'Producto actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
