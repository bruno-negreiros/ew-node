// docker ps
// docker exec -it 0fcb9f754e91 mongo -u bruno -p 123456 --authenticationDatabase heroes

db.herois.insert(
  {
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
  }
);

for (let i = 0; i <= 100; i ++) {
  db.herois.insert(
    {
      nome: `Flash-${i}`,
      poder: 'Velocidade',
      dataNascimento: '1998-01-01'
    }
  );
}

// read
db.herois.count()
db.herois.find().limit(100).sort({nome: -1})
db.herois.find({}, { poder: 1, _id: 0 })


// update
db.herois.update({id: ObjectId("id_do_carinha")}, {nome: 'Mulher maravilha'})
db.herois.update({id: ObjectId("id_do_carinha")}, { $set: {nome: 'Mulher maravilha'} })

// delete
db.herois.remove({nome: 'Mulher maravilha'});
