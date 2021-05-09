import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDto } from "./dtos/user.dto";
import { User } from "../users/user.model";
import { Connection, In } from "typeorm";
import { Product } from "../product/product.model";
import { Brand } from "../product/brand/brand.model";
import { fullConsoleLog } from "../common/utils";
import { CategoryDto, ProductDto, ProductUnitDto } from "./dtos/product.dto";
import { Model } from "../product/model/model.model";
import { Category } from "../product/category/category.model";
import { query } from "express";
import { slugify } from "../common/utils/slugify";

@Injectable()
export class TransferService {
  constructor(private connection: Connection) {}

  async importUsers(users: UserDto[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const users = await queryRunner.manager
        .getRepository(User)
        .createQueryBuilder("user")
        .select("user.customerId")
        .getMany();
      const willBeDeleteUsers = users
        .filter(
          (user) =>
            !users.some((userDto) => userDto.customerId === user.customerId)
        )
        .map((user) => user.customerId);
      if (willBeDeleteUsers.length) {
        await queryRunner.manager
          .getRepository(User)
          .delete({ customerId: In(willBeDeleteUsers) });
      }
      for (const userDto of users) {
        let user = await queryRunner.manager
          .getRepository(User)
          .findOne({ customerId: +userDto.customerId });
        if (!user) {
          user = new User();
        }
        await queryRunner.manager.save(Object.assign(user, userDto));
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e?.message);
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  async importProducts(products: ProductDto[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const productValues = [];
    const categoryValues = [];
    const productToCategoryValues: {
      productId: number;
      categoryId: number;
    }[] = [];

    const fillCategoryValues = async (
      category: CategoryDto,
      productId: number,
      parentId: number = null
    ) => {
      categoryValues.push({
        id: category.id,
        name: category.name,
        description: category.description,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
        metaKeyword: category.metaKeyword,
        seo: category.seo,
        order: category.order,
        parent: parentId,
      });
      productToCategoryValues.push({
        productId: productId,
        categoryId: category.id,
      });
      for (const child of category.children) {
        await fillCategoryValues(child, productId, category.id);
      }
    };

    const fillProductValues = async (
      product: ProductDto,
      parentId: number = null
    ) => {
      let brand = null;
      if (product.brand) {
        const findBrand = await queryRunner.manager.query(
          `SELECT id FROM brand WHERE brand.name = ?`,
          [product.brand]
        );
        brand = findBrand.length ? findBrand[0].id : null;
      }
      console.log(brand);
      let model = null;
      if (brand && product.model) {
        const findModel = await queryRunner.manager.query(
          `SELECT model.id FROM brand, model WHERE model.brand_id = brand.id AND model.name = ? AND brand.id = ?`,
          [product.model, brand]
        );
        model = findModel.length ? findModel[0].id : null;
      }
      console.log(model);
      if (product.brand && !brand) {
        const brandInsert = await queryRunner.manager.insert(
          Brand,
          new Brand({
            name: product.brand,
            code: slugify(product.brand),
          })
        );
        brand = brandInsert.identifiers[0].id;
      }
      if (product.model && !model && brand) {
        const modelInsert = await queryRunner.manager.insert(
          Model,
          new Model({
            name: product.model,
            brand: brand,
          })
        );
        model = modelInsert.identifiers[0].id;
      }

      productValues.push({
        id: product.id,
        code: product.code,
        equivalentCode: product.equivalentCode,
        name: product.name,
        metaDescription: product.metaDescription,
        metaTitle: product.metaTitle,
        metaKeywords: product.metaKeywords,
        description: product.description,
        seo: product.seo,
        defaultUnit: product.defaultUnit,
        quantity: product.quantity,
        taxRate: product.taxRate,
        image: product.image,
        parent: parentId,
        brand: brand ?? null,
        model: model ?? null,
        currency: product.currency,
      });
      if (product.categories && product.categories.length) {
        await fillCategoryValues(product.categories[0], product.id);
      }
    };

    const executeProductValues = async () => {
      for (const productValue of productValues) {
        await queryRunner.manager.save(Product, productValue);
      }
    };

    const executeCategoryValues = async () => {
      for (const categoryValue of categoryValues) {
        await queryRunner.manager.save(Category, categoryValue);
      }
    };

    const executeProductToCategoryValues = async () => {
      for (const productToCategory of productToCategoryValues) {
        await queryRunner.manager.query(
          `REPLACE INTO product_to_category (product_id, category_id) VALUES (?, ?)`,
          [productToCategory.productId, productToCategory.categoryId]
        );
      }
    };

    const executeProductUnits = async (products: ProductDto[]) => {
      for (const product of products) {
        for (const productUnit of product.units) {
          const executeProductUnit = await queryRunner.manager.query(
            `INSERT INTO product_unit (
          value,
          barcode,
          default_price_order,
          list_price_order,
          multiplier,
          length,
          width,
          height,
          weight,
          product_id) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?) ON DUPLICATE KEY UPDATE 
          barcode = values(barcode),
          default_price_order = values(default_price_order),
          list_price_order = values(list_price_order),
          multiplier = values(multiplier),
          length = values(length),
          width = values(width),
          height = values(height),
          weight = values(weight);`,
            [
              productUnit.value,
              productUnit.barcode,
              productUnit.defaultPriceOrder,
              productUnit.listPriceOrder,
              productUnit.multiplier,
              productUnit.length,
              productUnit.width,
              productUnit.height,
              productUnit.weight,
              product.id,
            ]
          );
          let executedProductUnitId: number = executeProductUnit?.insertId;
          if (!executedProductUnitId || executedProductUnitId === 0) {
            const findProductUnit = await queryRunner.manager.query(
              `SELECT id FROM product_unit WHERE product_id = ? AND value = ?`,
              [product.id, productUnit.value]
            );
            executedProductUnitId = findProductUnit.length
              ? findProductUnit[0].id
              : null;
          }
          if (executedProductUnitId) {
            for (const productPrice of productUnit.prices) {
              await queryRunner.manager.query(
                `INSERT INTO product_price (
          value,
          currency,
          price_order,
          unit_id) VALUES (
          ?,
          ?,
          ?,
          ?) ON DUPLICATE KEY UPDATE 
          value = values(value),
          currency = values(currency),
          price_order = values(price_order);`,
                [
                  productPrice.value,
                  productPrice.currency,
                  productPrice.priceOrder,
                  executedProductUnitId,
                ]
              );
            }
          }
          if (product.children && product.children.length) {
            await executeProductUnits(product.children);
          }
        }
      }
    };

    const executeWarehouses = async (products: ProductDto[]) => {
      for (const product of products) {
        for (const warehouse of product.warehouses) {
          await queryRunner.manager.query(
            `INSERT INTO warehouse (
        product_id,
        quantity,
        warehouse_id,
        date,
        warehouse_name,
        inventory_id) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?) ON DUPLICATE KEY UPDATE 
        product_id = values(product_id),
        quantity = values(quantity),
        warehouse_id = values(warehouse_id),
        date = values(date),
        warehouse_name = values(warehouse_name),
        inventory_id = values(inventory_id);`,
            [
              product.id,
              warehouse.quantity,
              warehouse.warehouseId,
              warehouse.date,
              warehouse.warehouseName,
              warehouse.inventoryId,
            ]
          );
        }
        if (product.children && product.children.length) {
          await executeWarehouses(product.children);
        }
      }
    };

    try {
      for (const productDto of products) {
        await fillProductValues(productDto);
      }
      await executeProductValues();
      await executeCategoryValues();
      await executeProductToCategoryValues();
      await executeProductUnits(products);
      await executeWarehouses(products);
      productValues.length = 0;
      categoryValues.length = 0;
      productToCategoryValues.length = 0;
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e?.message);
    } finally {
      await queryRunner.release();
    }
    return true;
  }
}
