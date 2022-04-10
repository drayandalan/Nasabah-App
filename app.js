//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const alert = require("alert");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://mongo:27017/nasabahDB", {
  useNewUrlParser: true
});

const nasabahSchema = {
  nama: String,
  alamat: String,
  tptLahir: String,
  tglLahir: String,
  nik: {
    type: Number,
    required: true,
    unique: true
  },
  noHp: Number
};

const Nasabah = mongoose.model("Nasabah", nasabahSchema);

app.get("/", function(req, res) {
  res.render("nasabah");
});

app.get("/tampilanDataAll", function(req, res) {
  Nasabah.find({}, function(err, foundNasabah) {
    console.log(foundNasabah);
    res.render("tampilanDataNasabahAll", {
      foundNasabah: foundNasabah
    });
  });
});

app.get("/tampilanDataByNik", function(req, res) {
  Nasabah.findOne({
    nik: nikSelect
  }, function(err, foundbyNik) {
    console.log(foundbyNik);
    res.render("tampilanDataNasabahNik", {
      foundbyNik: foundbyNik
    });
  });
})

app.post("/inputUbah", function(req, res) {
  const nama = req.body.namaInp;
  const alamat = req.body.alamatInp;
  const tptLahir = req.body.tptInp;
  const tglLahir = req.body.tglInp;
  const nik = req.body.nikInp;
  const noHp = req.body.hpInp;

  const inputData = req.body.inputSub;
  const ubahData = req.body.ubahSub;
  const findAllData = req.body.findAll;

  const nasabah = new Nasabah({
    nama: nama,
    alamat: alamat,
    tptLahir: tptLahir,
    tglLahir: tglLahir,
    nik: nik,
    noHp: noHp
  });

  if (inputData === "ok") {
    nasabah.save(function(err) {
      if (err) {
        alert("NIK sudah ada atau tidak di isi, mohon cek kembali");
        res.redirect("/");
      } else {
        alert("DATA INSERTED");
        res.redirect("/");
      }
    });
  }
  if (ubahData === "ok") {
    if (!nik) {
      alert("NIK belum ada atau tidak di isi, mohon cek kembali");
      res.redirect("/");
    } else {
      Nasabah.findOneAndUpdate({
        nik: nik
      }, {
        $set: {
          nama: nama,
          alamat: alamat,
          tptLahir: tptLahir,
          tglLahir: tglLahir,
          noHp: noHp
        }
      }, {
        new: true
      }, function(err, found) {
        if (err) {
          res.redirect("/");
        }
        else if (!found) {
          alert("DATA NOT FOUND");
          res.redirect("/");
        }
        else {
          alert("DATA UPDATED");
          res.redirect("/");
        }
      });
    }
  }
  if (findAllData === "ok") {
    res.redirect("/tampilanDataAll");
  }
});

app.post("/cariHapus", function(req, res) {
  global["nikSelect"] = req.body.nik;

  const cariData = req.body.cariSub;
  const hapusData = req.body.hapusSub;

  if (cariData === "cari") {
    if (!nikSelect) {
      alert("Silahkan masukkan NIK");
      res.redirect("/");
    }
    else {
      res.redirect("/tampilanDataByNik");
    }
  }

  if (hapusData === "hapus") {
    if (!nikSelect) {
      alert("Silahkan masukkan NIK");
      res.redirect("/");
    }
    else {
      Nasabah.findOneAndRemove({
        nik: nikSelect
      }, function(err) {
        if (!err) {
          alert("DATA DELETED");
          res.redirect("/");
        }
      });
    }
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
