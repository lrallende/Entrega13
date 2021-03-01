import express from "express"
// import io from "socket.io"
import moment from 'moment'
import path from 'path'
import { Producto } from './producto'
import {CommonRoutesConfig} from './rutas/common.route.config'
import {UsersRoutes} from './rutas/users.route.config'
import handlebars from 'express-handlebars'
import { Archivo, Mensaje } from './mensaje'

const routes: Array<CommonRoutesConfig> = []

let chatMensajes = new Archivo('mensajes')

const app = express()
app.set("port", process.env.PORT || 8080);
var http = require("http").Server(app);
let io = require("socket.io")(http);

let productos: Producto [] = []
routes.push(new UsersRoutes(app, productos))

app.use(express.static('public'))

app.engine(
    "hbs", 
    handlebars({
        extname: ".hbs",
        defaultLayout: "ingresar.hbs", 
        layoutsDir: path.join(__dirname,  '..', 'views', 'layouts'),
        partialsDir: path.join(__dirname, '..', 'views', 'partials')
    })
)

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'hbs')

io.on("connection", function(socket: any) {
    socket.emit('coneccion', 'Bienvenidx, coloque su nombre:')
    // socket.emit("recargProd", productos)
    let mensajes = chatMensajes.leer().then(
        (messagesSolved)=>io.emit("recargMsg", messagesSolved)   
    )
    
    socket.on('bienvenida', (data: any) => {
        console.log(data);
    });
    
    
    socket.on("newProd", function(message: any) {
        // console.log(message);
        let id = (productos.length + 1).toString()
        const {title, price, thumbnail, nombre} = message
        const prod = {
                    id,
                    title,
                    price: parseInt(price),
                    thumbnail
        }
        productos.push(prod)
        io.emit("recargProd", productos)
        console.log(`${nombre} ha agregado un producto`)
        console.log(productos)
    });
    
    socket.on("newMsg", function (message: Mensaje) {
        
        const { email, mensaje, id } = message
        const fecha = moment().format('DD/MM/YYYY hh:mm:ss')
        const msg = {
                    id,
                    email,
                    fecha,
                    mensaje
        }
        chatMensajes.guardar(msg)
            .then(function (response) {
                mensajes = chatMensajes.leer()
                return  mensajes
            })
            .then(function (response) {
                return io.emit("recargMsg", response)
        })

    });
    
});

http.listen(8080, () => {
    console.log('Escuchando en 8080')
}).on('error', console.log);