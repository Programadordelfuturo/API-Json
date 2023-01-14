const express = require('express');
const path = require('path');
const fs = require('fs/promises')

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/users.json');


app.get('/task', async (request, response)=>{
  const jsonFile = await fs.readFile(jsonPath, 'utf8');
  response.send(jsonFile);
})


app.post('/task', async (req, res)=>{
  const user = req.body;
  const usersArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));


  const lastIndex = usersArray.length -1;
  const newId = usersArray[lastIndex].id + 1;
  
  usersArray.push({...user, id: newId});
  
  await fs.writeFile(jsonPath, JSON.stringify(usersArray));
  res.send();
})


app.put(`/task`, async (req, res) => {
  const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const body = req.body;
  
  const userId = jsonFile.filter(element => element.id == body.id)
  if(userId) {
    userId[0].status = body.status
  }
  jsonFile.splice(body.id - 1, 1, userId[0])
  await fs.writeFile(jsonPath, JSON.stringify(jsonFile))
  res.send(jsonFile);
})


app.delete('/task', async (req, res) => {
  const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const body = req.body;
  jsonFile.splice(body.id - 1, 1);
  await fs.writeFile(jsonPath, JSON.stringify(jsonFile))
  res.send(jsonFile)
})



const PORT = 8000;

app.listen(PORT, ()=>{
  console.log(`servidor escuchando en el puerto ${PORT}`);
});