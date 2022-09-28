const PORT=3021
const express=require('express')
const app=express()
const router=express.Router()
const bp=require('body-parser')

//rabbitmq connection
const amqplib=require('amqplib')
var channel,connection;
const connectAmqp=async()=>{
 try{
  connection=await amqplib.connect('amqp://localhost:5672')
 channel= await connection.createChannel()
 await channel.assertQueue('queue1',{durable:true})// for message durability
 await channel.assertQueue('queue2',{durable:false})
 await channel.assertQueue('queue3',{durable:false})
 await channel.assertExchange('ex1','fanout',{durable:true})// create exchange named ex1
}
 catch(e)
 {console.log(e)}
}
connectAmqp()

//routes

router.post('/postMessage1',async(req,res)=>{
let data=Buffer.from(JSON.stringify(req.body.data))
await channel.sendToQueue('queue1',data,{persistent:true}) //default exchange name ""
await channel.publish('ex1','queue2',Buffer.from('data'))// publish message to exchange , do not publish message to any queue
await channel.bindQueue('queue2','ex1','')
// await channel.bindQueue('queue1','ex1','')
console.log('a message sent to the queue: queue1')
return res.status(200).send({success:true,message:'message sent to queue1'})
})

router.post('/postMessage2',async(req,res)=>{
// let data=Buffer.from(JSON.stringify(req.body))
let data=Buffer.from('data2')
await channel.sendToQueue('queue2',data)
console.log('a message sent to the queue: queue2')
res.status(200).send({success:true,message:'message sent to queue2'})
})

router.post('/postMessage3',async(req,res)=>{
// let data=Buffer.from(JSON.stringify(req.body))
let data=Buffer.from('data3')
await channel.sendToQueue('queue3',data)
console.log('a message sent to the queue: queue3')
res.status(200).send({success:true,message:'message sent to queue3'})
})


//running app
app.use(express.json())
app.use(bp.urlencoded({extended:true}))
app.use(router)
app.listen(PORT,()=>{
 console.log(`server running on port:${PORT}`)
})