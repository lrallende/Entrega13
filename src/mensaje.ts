import fs from "fs"

export interface Mensaje {
    email: string
    fecha: any
    mensaje: string
    id: number
  }

export class Mensaje {
    constructor(email: string, fecha: any, mensaje: string, id: number) {
        this.email = email;
        this.fecha = fecha;
        this.mensaje = mensaje
        this.id = id
    }
}

export interface Archivo {
    archivo: string
  }

export class Archivo {
    constructor (archivo: string) {
        this.archivo = `./datos/${archivo}.txt`;      
    }
    
    async leer() {
        
        let arr = []

        try {
            if (this.archivo) {
                let data = await fs.promises.readFile(`${this.archivo}`, 'utf-8')
                arr = JSON.parse(data)
            } 
            return(arr)
                 
        } catch (error) {
            console.log('El archivo no existe')
            return(arr);
        }
    }

    async guardar(datos: Mensaje) {
        let arr = await this.leer()
        let nuevoItem = datos
        nuevoItem.id = arr.length + 1
        arr.push(nuevoItem)
            
        fs.promises.writeFile(`${this.archivo}`, `${JSON.stringify(arr)}`)
        // .then(console.log(datos))
        
    }

    borrar () {
        fs.unlink(`${this.archivo}`, (err) => {
                if (err) {
                console.log('No existe ese archivo')
            } else {console.log('Archivo Borrado')} 
        }) 
    }
           
}
        
// let otroItem = new Archivo('productos')


// otroItem.guardar(prod)
// otroItem.leer('productos')
// otroItem.borrar('productos')