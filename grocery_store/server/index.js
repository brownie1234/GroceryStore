const express = require('express')
const app = express();
const cors = require('cors');
const db = require('./firebase')
const { FieldValue } = require('firebase-admin/firestore');
const bodyParser = require('body-parser');
const path = require('path');


app.use(express.static(path.join(__dirname + "/build")));

app.use(cors());
app.use(bodyParser.json());

app.get('/getAllItems', async (req, res) => {
  try{
    const items = await db.collection('Items').get();
    const itemsArray = [];
    items.forEach((item) => {
        itemsArray.push({...item.data(), id: item.id});
    })
    res.json(itemsArray);
  } catch (err) {
    console.log(err)
  }
})
app.post('/addItem', async (req, res) => {
  try{
    const { name, description, image } = req.body;
    const item = await db.collection('Items').doc().set({
        name,
        description,
        image
    })
    res.json({success: true, id: item.id});
  } catch (err) {
    res.json({success: false});
    console.log(err)
  }
})
app.post('/deleteItem', async (req, res) => {
  try{
    const { id } = req.body;
    await db.collection('Items').doc(id).delete();
    res.json({success: true});
  } catch (err) {
    res.json({success: false});
    console.log(err)
  }
})
app.post('/editItem', async (req, res) => {
  try{
    const { id, name, description, image } = req.body;
    await db.collection('Items').doc(id).update({
        name,
        description,
        image
    })
    res.json({success: true});
  } catch (err) {
    res.json({success: false});
    console.log(err)
  }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
  });

app.listen(3001)