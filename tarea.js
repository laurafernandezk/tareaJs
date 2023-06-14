class Producto {
  sku; // Identificador único del producto
  nombre; // Su nombre
  categoria; // Categoría a la que pertenece este producto
  precio; // Su precio
  stock; // Cantidad disponible en stock

  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;

    // Si no me definen stock, pongo 10 por default
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  productos; // Lista de productos agregados
  categorias; // Lista de las diferentes categorías de los productos en el carrito
  precioTotal; // Lo que voy a pagar al finalizar mi compra

  // Al crear un carrito, empieza vació
  constructor() {
    this.productos = [];
    this.categorias = [];
    this.precioTotal = 0;
  }

  eliminarProducto = (sku, cantidad) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundIncart = this.productos.find(
          (product) => product.sku === sku
        );
        const productIndex = this.productos.findIndex(
          (product) => product.sku === sku
        );
        if (foundIncart) {
          if (cantidad <= foundIncart) {
            const newCart = this.productos.filter(
              (product) => product.sku !== sku
            );
            resolve(newCart);
          } else {
            this.productos[productIndex].cantidad -= cantidad
            resolve(this.productos);
          }
        } else {
          reject(new Error(`Product ${sku} not found in Cart`));
        }
      }, 2000);
    });
  };

  /**
   * función que agrega @{cantidad} de productos con @{sku} al carrito
   */
  async agregarProducto(sku, cantidad) {
    console.log(`Agregando ${cantidad} ${sku}`);

    // Busco el producto en la "base de datos"
    try {
      const producto = await findProductBySku(sku);

      console.log("Producto encontrado", producto);

      const existInCart = this.productos.find(
        (product) => product.sku === producto.sku
      );

      if (existInCart) {
        const indiceProducto = this.productos.findIndex(
          (product) => product.sku === existInCart.sku
        );
        this.productos[indiceProducto].cantidad += cantidad;
        this.precioTotal = this.precioTotal + producto.precio * cantidad;
      }
      // Creo un producto nuevo
      else {
        const nuevoProducto = new ProductoEnCarrito(
          sku,
          producto.nombre,
          cantidad
        );
        this.productos.push(nuevoProducto);
        this.precioTotal = this.precioTotal + producto.precio * cantidad;
        this.categorias.push(producto.categoria);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  sku; // Identificador único del producto
  nombre; // Su nombre
  cantidad; // Cantidad de este producto en el carrito

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
        console.log("found product", foundProduct);
      } else {
        reject(new Error(`Product ${sku} not found`));
      }
    }, 1500);
  });
}

const carrito = new Carrito();
carrito.agregarProducto("WE328NJ", 4);
carrito.agregarProducto("UI999TY", 2);
carrito
  .eliminarProducto("WE328NJ", 2)
  .then((respuesta) => console.log("carrito final", respuesta))
  .catch((error) => console.log(error));
