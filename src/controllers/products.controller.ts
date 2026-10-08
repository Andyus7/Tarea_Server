import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../conf/dbConnection.ts";

interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  brand: string | null;
  img: string | null;
  active: boolean | number;
}

export class ProductsController {
  /**
   * Valida si un valor representa un número entero positivo mayor que cero.
   */
  private isValidPositiveInteger(value: unknown): boolean {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
  }

  /**
   * Valida si un valor representa un precio numérico válido mayor que cero.
   */
  private isValidPrice(value: unknown): boolean {
    if (typeof value !== "number" || isNaN(value)) {
      return false;
    }
    return value > 0;
  }

  /**
   * GET /api/v1/products/getAll
   * Obtiene todos los productos activos (por defecto active = TRUE, o según query param active).
   */
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      let activeFilter = 1;

      if (req.query.active !== undefined) {
        const queryActive = String(req.query.active).toLowerCase();
        if (queryActive === "true" || queryActive === "1") {
          activeFilter = 1;
        } else if (queryActive === "false" || queryActive === "0") {
          activeFilter = 0;
        } else {
          res.status(400).json({
            message: "El parámetro query 'active' debe ser booleano ('true' o 'false')",
          });
          return;
        }
      }

      const [products] = await pool.execute<ProductRow[]>(
        "SELECT id, name, price, stock, description, brand, img, active FROM products WHERE active = ?",
        [activeFilter]
      );

      res.status(200).json(products);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * GET /api/v1/products/getById/:id
   * Obtiene un único producto activo por su identificador.
   */
  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!this.isValidPositiveInteger(id)) {
        res.status(400).json({ message: "El ID debe ser un entero positivo" });
        return;
      }

      const [rows] = await pool.execute<ProductRow[]>(
        "SELECT id, name, price, stock, description, brand, img, active FROM products WHERE id = ? AND active = TRUE",
        [Number(id)]
      );

      const product = rows[0];
      if (!product) {
        res.status(404).json({ message: "Producto no encontrado o inactivo" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * POST /api/v1/products/create
   * Crea un nuevo producto con active = TRUE.
   */
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, price, stock, description, brand, img } = req.body;

      if (typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto" });
        return;
      }

      if (!this.isValidPrice(price)) {
        res.status(400).json({ message: "El precio debe ser un número mayor a cero" });
        return;
      }

      if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
        res.status(400).json({ message: "El stock debe ser un entero mayor o igual a cero" });
        return;
      }

      if (typeof description !== "string" || description.trim() === "") {
        res.status(400).json({ message: "La descripción es obligatoria y debe ser un texto" });
        return;
      }

      const brandValue = brand !== undefined && brand !== null ? String(brand) : null;
      const imgValue = img !== undefined && img !== null ? String(img) : null;

      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, TRUE)",
        [name.trim(), price, Number(stock), description.trim(), brandValue, imgValue]
      );

      res.status(201).json({
        message: "Producto creado exitosamente",
        id: result.insertId,
        product: {
          id: result.insertId,
          name: name.trim(),
          price,
          stock: Number(stock),
          description: description.trim(),
          brand: brandValue,
          img: imgValue,
          active: true,
        },
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PUT /api/v1/products/update/:id
   * Actualiza todos los campos de un producto activo existente.
   */
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!this.isValidPositiveInteger(id)) {
        res.status(400).json({ message: "El ID debe ser un entero positivo" });
        return;
      }

      const { name, price, stock, description, brand, img } = req.body;

      if (typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ message: "El nombre es obligatorio y debe ser un texto" });
        return;
      }

      if (!this.isValidPrice(price)) {
        res.status(400).json({ message: "El precio debe ser un número mayor a cero" });
        return;
      }

      if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
        res.status(400).json({ message: "El stock debe ser un entero mayor o igual a cero" });
        return;
      }

      if (typeof description !== "string" || description.trim() === "") {
        res.status(400).json({ message: "La descripción es obligatoria y debe ser un texto" });
        return;
      }

      const brandValue = brand !== undefined && brand !== null ? String(brand) : null;
      const imgValue = img !== undefined && img !== null ? String(img) : null;

      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE",
        [name.trim(), price, Number(stock), description.trim(), brandValue, imgValue, Number(id)]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Producto no encontrado o inactivo" });
        return;
      }

      res.status(200).json({
        message: "Producto actualizado exitosamente",
        id: Number(id),
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * DELETE /api/v1/products/delete/:id
   * Baja lógica de un producto activo (cambia active a FALSE).
   */
  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!this.isValidPositiveInteger(id)) {
        res.status(400).json({ message: "El ID debe ser un entero positivo" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE",
        [Number(id)]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Producto no encontrado o ya inactivo" });
        return;
      }

      res.status(200).json({
        message: "Producto dado de baja exitosamente",
        id: Number(id),
      });
    } catch (error) {
      console.error("Error al dar de baja el producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  /**
   * PATCH /api/v1/products/change-price/:id
   * Modifica exclusivamente el precio de un producto activo.
   */
  public changePrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!this.isValidPositiveInteger(id)) {
        res.status(400).json({ message: "El ID debe ser un entero positivo" });
        return;
      }

      const bodyKeys = Object.keys(req.body);
      if (!bodyKeys.includes("price") || bodyKeys.length !== 1) {
        res.status(400).json({
          message: "El cuerpo debe contener únicamente el campo 'price'",
        });
        return;
      }

      const { price } = req.body;

      if (!this.isValidPrice(price)) {
        res.status(400).json({ message: "El precio debe ser un número mayor a cero" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET price = ? WHERE id = ? AND active = TRUE",
        [price, Number(id)]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Producto no encontrado o inactivo" });
        return;
      }

      res.status(200).json({
        message: "Precio del producto actualizado exitosamente",
        id: Number(id),
        newPrice: price,
      });
    } catch (error) {
      console.error("Error al actualizar el precio del producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
}

