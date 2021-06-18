# VK AUTH
Este servicio permite crear usuarios, hacer login en las aplicaciones, comprobar si las sesiones son correctas.

## Set Up
### Variables de entorno necesarias
```js
AUTH_KEY // Clave para encriptar y comparar contraseñas
MONGO_URI // Ruta a base de datos
AMQP_URL // Ruta de RabbitMQ
AMQP_QUEUE // Cola de RabbitMQ
CREATE_USER_EMAIL_BASEURL // URL para validar el usuario
CREATE_USER_EMAIL_FROM // Email from
CREATE_USER_EMAIL_SUBJECT // Email subject
CREATE_USER_EMAIL_HTML // Web que se enviará por email para validar el usuario
```
En el caso de levantar la aplicación en desarrollo, hace uso de ".env" así que es necesario crear el archivo en la raíz del proyecto.

### Instalar  
`npm i`

## Docs

### Comandos

#### Levantar producción
`npm start`

#### Levantar dev
`npm run dev`

#### Lanzar test
`npm run test`

#### Lanzar linters
`npm run test`

### Rutas   
[POST]**/user/create** -> Crea un nuevo usuario (Envia un email para que el usuario valide su cuenta)
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
[GET]**/user/validate-by-email/:token`** -> Valida el usuario con el token generado
```js
// Los parámetros van en la ruta
```

```js
response = {
      message
    }
```

[POST]**/auth/login/local** -> Permite hacer login con usuario y contraseña
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
[GET]**/auth/check-token** -> Comprueba si la sesión es correcta
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
## Stack
- Node
- Test: SuperTest y Jest
- DBDriver: Mongoose (Mediante la librería vkMongo)
- Lint: ESLint y Prettier
