const express = require('express');
const app = express();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
app.use(express.json());

app.get("/", async(req, res)=>{
    // const resp = await prisma.post.findMany({
    //     skip: 6,
    //     take: 3,
    //   });
    // const resp = await prisma.usuario.count();
    const resp = await prisma.usuario.findMany({
        select : {
            idusuario : true,
            rutusuario : true,
            nombreusuario : true,
            emailusuario : true,
        }
    });

    res.json(resp);
});



app.get("/rut/:rut", async(req, res)=>{
    const {rut} = req.params;
    const resp = await prisma.usuario.findMany({
        where: {
            rutusuario : parseInt(rut) 
        },
        select : {
            idusuario : true,
            rutusuario : true,
            nombreusuario : true,
            emailusuario : true,
        }
    });

    res.json(resp);
});

app.get("/paginador/usuarios/:offset/:limit", async(req, res)=>{
    const {offset, limit} = req.params;
    const total = await prisma.usuario.count();
    const paginas = Math.round(total/limit);

    const resp = await prisma.usuario.findMany({
        select : {
            idusuario : true,
            rutusuario : true,
            nombreusuario : true,
            emailusuario : true,
        },
        skip : parseInt(offset),
        take: parseInt(limit)
    });

    let usuarios = [
        {
            total : total,
            offset : parseInt(offset),
            limit : parseInt(limit),
            paginas: paginas,
            usuarios: resp
        }
    ];

    res.json(usuarios);
});

const test = (req, res, next) => {
    // res.json("wena");
    if(req.headers.authorization == "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJub21icmUiOiJmYXR0MyIsImFwZWxsaWRvIjoiY2hvbmciLCJlZGFkIjozMCwiY2VsdWxhciI6Ijk1MDU5NDU5IiwiY29ycmVvIjoiZmF0dDNAZ21haWwuY29tIiwiY29udHJhc2VuYSI6IjEyMzQ1Njc4In0sImlhdCI6MTY0NTA0MDQzNCwiZXhwIjoxNjQ1MDc2NDM0fQ.YSsn9UrzgVu4Lwy9Wa14aBQE2ACrXM1qrx6oYot6Jmo"){
        return next();
    }
    res.json("error de middleware test");
}

app.get("/paginador/usuarios/rut/:rut/nombre/:nombre/offset/:offset/limit/:limit", test, async(req, res)=>{
    
    const {offset, limit, nombre, rut} = req.params;
    const total = await prisma.usuario.count({
        where: {
            rutusuario : 17553987 
        }
    });

    const paginas = Math.round(total/limit);

    const resp = await prisma.usuario.findMany({
        select : {
            idusuario : true,
            rutusuario : true,
            nombreusuario : true,
            emailusuario : true,
        },
        where: {
            rutusuario : rut != 'null' ? parseInt(rut) : undefined,
            nombreusuario : nombre != 'null' ? nombre : undefined, 
            emailusuario : {
                contains : '@'
            }
        },
        skip : parseInt(offset),
        take: parseInt(limit)
    });

    let usuarios = [
        {
            total : total,
            offset : parseInt(offset),
            limit : parseInt(limit),
            paginas: paginas,
            usuarios: resp
        }
    ];
//
    res.json(usuarios);
});


app.put("/post/:id", async(req, res)=>{
    const {id} =req.params;
    const {title, content} = req.body;
    const post = await prisma.post.update({
        where : {id: Number(id)},
        data: {title: title, content: content}
    });
    res.json(post);
});

app.delete("/post/:id", async(req, res)=>{
    const {id} =req.params;
    const post = await prisma.post.delete({where: {id: Number(id)}})
    res.json(post);
});

app.post("/post", async(req, res)=>{
    const {title, content} = req.body;
    const result = await prisma.post.create({
        data : {
            title, content
        }
    });
    res.json(result);
});

app.listen(3005,()=>{
    console.log("servidor en puerto 3005");
})