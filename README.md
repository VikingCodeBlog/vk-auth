# VK AUTH
Este servicio permite crear usuarios, hacer login en las aplicaciones, comprobar si las sesiones son correctas.

## Set Up
### Variables de edntorno necesarias   
```js
AUTH_KEY // Clave para encriptar y comparar contraseñas
MONGO_URI // Ruta a base de datos
```
### Instalar  
`npm i`

### Levantar  
`node index`

## Docs

### Rutas   
[POST]**/create** -> Crea un nuevo usuario
```js
request.body = {
    name,  
    password,  
    email,  
    nikName, // Optional  
    telf,  // Optional
    surname 
}
```
```js
response = { // User model
    _id,
    name,
    surname,
    data: { // UserData model
        _id
        user
        email
        lastConnection
}
```

[POST]**/authenticate** -> Permite hacer login con usuario y contraseña
```js
request.body = {
    email,
    password
}
```

```js
response = {
    mensaje,
    token
}
```
[GET]**/checkAuth** -> Comprueba si la sesión es correcta
```js
request.headers['access-token']
```

```js
response = {
    mensaje
    decoded: {
        check,
        userId,
        iat,
        exp
    }
}
```