const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = new Map();
const accounts = new Map();
const orders = new Map();
let nextId = 1;

function id(prefix){ return prefix + (nextId++); }

app.post('/api/register', (req,res)=>{
  const {name,email,password}=req.body||{};
  if(!name||!email||!password) return res.status(400).json({error:'Name, email and password are required'});
  const key=email.toLowerCase();
  if(users.has(key)) return res.status(409).json({error:'Email already registered'});
  const userId=id('usr_');
  users.set(key,{id:userId,name,email:key,password}); // DEMO ONLY: replace with password hashing before production
  const accountId=id('acct_');
  accounts.set(accountId,{id:accountId,userId,balance:10000,equity:10000,currency:'USD',status:'demo'});
  res.json({userId,accountId,name});
});

app.post('/api/login',(req,res)=>{
  const {email,password}=req.body||{};
  const u=users.get((email||'').toLowerCase());
  if(!u||u.password!==password) return res.status(401).json({error:'Invalid credentials'});
  const account=[...accounts.values()].find(a=>a.userId===u.id);
  res.json({userId:u.id,accountId:account.id,name:u.name});
});

app.get('/api/account/:id',(req,res)=>{
  const a=accounts.get(req.params.id);
  if(!a) return res.status(404).json({error:'Account not found'});
  res.json(a);
});

app.post('/api/orders',(req,res)=>{
  const {accountId,symbol,side,lots,price,stopLoss,takeProfit}=req.body||{};
  const a=accounts.get(accountId);
  if(!a) return res.status(404).json({error:'Account not found'});
  if(!['BUY','SELL'].includes(side)||!Number(lots)||Number(lots)<=0||!Number(price)) return res.status(400).json({error:'Invalid order'});
  const order={id:id('ord_'),accountId,symbol,side,lots:Number(lots),openPrice:Number(price),stopLoss:stopLoss||null,takeProfit:takeProfit||null,status:'OPEN',createdAt:new Date().toISOString()};
  orders.set(order.id,order);
  res.status(201).json(order);
});

app.get('/api/orders/:accountId',(req,res)=>{
  res.json([...orders.values()].filter(o=>o.accountId===req.params.accountId));
});

app.post('/api/orders/:id/close',(req,res)=>{
  const o=orders.get(req.params.id);
  if(!o) return res.status(404).json({error:'Order not found'});
  o.status='CLOSED'; o.closePrice=Number(req.body.price)||o.openPrice; o.closedAt=new Date().toISOString();
  res.json(o);
});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`BHACHU FX v2 running on port ${PORT}`));
