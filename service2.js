const PORT=3022
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
 await channel.assertQueue('queue1',{durable:true})
 // channel.prefetch(2)// not to give task more than 2 in case of processing
 channel.consume('queue1',(data)=>{
  
  // setTimeout(()=>{console.log(`${Buffer.from(data.content)}`)},5000)
  console.log(`${Buffer.from(data.content)}`)
  channel.ack(data)
 },{
  // noAck:true//for no acknowledge
  noAck:false // for reenque to other receiver
 }
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