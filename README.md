# devsaider-server

Nombre clave: Proyecto Devsaider
Autor: Sebastián Morales (@nzkdevsaider)

# Uso

`node api`

# Rutas

## `/shein/get-item` (POST) 

`{ url: "url de us.shein.com"}` para obtener un objeto con los detalles del producto.

**Retorna:** 

```json
{
    "name": "Nombre del producto",
    "price": "Precio del producto",
}
```

