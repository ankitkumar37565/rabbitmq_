const PORT=3023
const express=require('express')
const app=express()
const router=express.Router()
//rabbitmq connection
const amqplib=require('amqplib')
var channel,connection;
let connectAmqp=async()=>{
 try{
  connection=await amqplib.connect('amqp://localhost:5672')
 channel=await connection.createChannel()
 await channel.assertQueue('queue2',{durable:false})
 // await channel.assertQueue('queue1',{durable:true})  //for round robin
 channel.consume('queue2',(data)=>{
  console.log(`${Buffer.from(data.content)}`)
  channel.ack(data)}
 )}
 catch(e){
  console.log(e)
 }
}
connectAmqp()

//running the app
app.listen(PORT,()=>{
 console.log(`server running on port:${PORT}`)
})