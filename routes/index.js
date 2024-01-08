var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
// Konfiguracija za povezivanje na MySQL bazu

const pool = mysql.createPool({
  host:'bazepodataka.ba',
  user: 'student2318',
  password: '17905',
  database: 'student2318',
  port:7306
});

/* GET home page. */
router.get('/',function(req, res, next) {

     res.render('index');
});


router.post('/dohvatiIzvjestaj', (req, res) => {
  const upitIzvjestaj = "call GenerirajIzvjestaj(?)";

  pool.query(upitIzvjestaj, [req.body.broj], (err, results) => {
    if(err){
      console.log(err)
      return
    }
    res.send(results);
  })
})
//KRAJ IZVJESTAJ METODA

router.get('/tokeni', (req, res) => {

  const upitTokenPrikaz = "select * from sifarnik_kartica"
  pool.query(upitTokenPrikaz, (err, results) => {
    if(err){
      console.log(err)
      return
    }
    console.log(results)
  res.render('tokeni', {tokeni: results})

  })
})


router.post('/obrisiToken/:rfidKod', (req, res) => {
  let rfid= req.params.rfidKod;
  
  const upitBrisanjeTokena = "delete from sifarnik_kartica where rfid_kod = ?";

  pool.query(upitBrisanjeTokena, [rfid], (err, results) => {
    if(err) {
      console.log(err)
      return
    }
    res.redirect('/tokeni')
  })

})

router.get('/dodajToken', (req, res) => {
  res.render('dodajToken')
})

router.post('/dodajNoviToken', (req, res) => {

  const {sifra_kartice, rfid_kod,validnost_kartice, id_korisnika, sifra_zaposlenika } = req.body;
  const upitDodavanjeTokena = "insert into sifarnik_kartica (sifra_kartice, rfid_kod, validnost_kartice, id_korisnika, sifra_zaposlenika) values (?,?,?,?,?)";
  
  pool.query(upitDodavanjeTokena, [sifra_kartice, rfid_kod,validnost_kartice, id_korisnika, sifra_zaposlenika ], (err, results) => {
    if(err) {
      console.log(err)
      return
    }
    res.redirect('/tokeni')
  })

})

router.get('/dogadjajiTokena/:rfidKod', (req, res) => {
  const rfidKod = req.params.rfidKod
  const upit = 'call dogadjajiTokena(?)'
  pool.query(upit, [rfidKod], (err, results) => {
    if(err){
      console.log(err)
      return
    }
    console.log(results[0])
    res.render('dogadjajiTokena', {dogadjaji: results[0]})
  })
})





module.exports = router;
