import express from 'express'
import { Producto } from '../producto'
import { CommonRoutesConfig } from './common.route.config'
import  bodyParser from 'body-parser'

var jsonParser = bodyParser.json()

export class UsersRoutes extends CommonRoutesConfig {
    productos: Producto []
    constructor(app: express.Application, productos: Producto []) {
        super(app, 'UsersRoutes')
        this.productos = productos
    }
    configureRoutes() {

        this.app.route('/ingresar')
            .get((req: express.Request, res: express.Response) => {
                if (this.productos.length == 0) {
                    res.status(200).render('main', { productos: this.productos, listExists: false })
                } else {
                    res.status(200).render('main', { productos: this.productos, listExists: true })
                }
            
        })

        this.app.route('/api/productos')
        .get((req: express.Request, res: express.Response) =>{
            if(this.productos.length === 0){
                res.status(404).send(`{error: 'no hay productos cargados'}`)
                return
            }
            res.status(200).json(this.productos)
        })
        .post(jsonParser,(req: express.Request, res: express.Response) => {
            let id = (this.productos.length + 1).toString()
            const {title, price, thumbnail} = req.body
            const prod = {
                    id,
                    title,
                    price: parseInt(price),
                    thumbnail
            }
            this.productos.push(prod)
            res.status(200).json(prod)
        })

        this.app.route('/api/productos/:id')
        .get((req: express.Request, res: express.Response) =>{
            const id = req.params.id
            const prod = this.productos.find( prod => prod.id === id)
            if (!prod){
                res.send(`{error: 'producto no encontrado'}`)
                return
            }
            res.status(200).json(prod)
        })
        .put(jsonParser, (req: express.Request, res: express.Response) =>{
            const id = req.params.id
            let prod = this.productos.find( prod => prod.id === id)
            if (!prod){
                res.send(`{error: 'producto no encontrado'}`)
                return
            }
            this.productos = this.productos.filter( prod => prod.id !== id)
            const {title, price, thumbnail} = req.body
            prod = {
                    id,
                    title,
                    price: parseInt(price),
                    thumbnail
            }
            this.productos.push(prod)
            res.status(200).json(prod)
        })
        .delete((req: express.Request, res: express.Response) =>{
            const id = req.params.id
            const prod = this.productos.find( prod => prod.id === id)
            if(!prod){
                res.sendStatus(404)
                return
            }
            this.productos = this.productos.filter( prod => prod.id !== id)
            res.send(prod)
        })

        return this.app
    }
}