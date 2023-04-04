const kod = document.getElementById('kod');
const enlem = document.getElementById('enlem');
const boylam = document.getElementById('boylam');
const adres = document.getElementById('adres');
const sorumlu = document.getElementById('sorumlu');
const ip = document.getElementById('ip');
const belediye = document.getElementById('belediye');
const password = document.getElementById('password');
const il = document.getElementById('il');
const ilce = document.getElementById('ilce');
const semt = document.getElementById('semt');
const btnn = document.getElementById('btnn');
const stationremove = document.getElementById('stationremove');
const remowebtn = document.getElementById('remowebtn');
const form = document.getElementsByClassName('form')[0];
const formbtn = document.getElementById('formbtn');
const goster = document.getElementById('goster')
const pler = document.getElementById('pler')
const plerpasif = document.getElementById('plerpasif')
const pasifbtn = document.getElementById('pasifbtn')








var sil = [];
var gosterarray = [];
var pasifarray = []
btnn.addEventListener('click', function () {
    db.collection('İstasyon').doc(kod.value)
        .set({
            kod: kod.value,
            boylam: boylam.value,
            enlem: enlem.value,
            adres: adres.value,
            sorumlu: sorumlu.value,
            ip: ip.value,
            belediye: belediye.value,
            password: password.value,
            il: il.value,
            ilce: ilce.value,
            semt: semt.value
        })
        .then(() => {
            console.log('Başarılı')
        })
        .catch(() => {
            console.log('hata')
        })
})



db.collection('İstasyon').get().then((snapshot) => {
    snapshot.docs.forEach(e => {


        var p = document.createElement('p');

        p.tabIndex = '1'
        p.innerHTML = e.data().kod;

        p.addEventListener('click', () => {
            sil = []
            gosterarray = []
            db.collection('İstasyon').doc(e.id).get().then((doc) => {
                gosterarray.push(doc.data())
                sil.push(doc.data().kod)

                remowebtn.addEventListener('click', () => {




                    db.collection('İstasyon').doc(sil[0]).delete().then(() => {

                        var elements = document.getElementsByTagName('p');
                        for (var i = 0; i < elements.length; i++) {
                            if (elements[i].innerText === sil[0]) {
                                elements[i].parentNode.removeChild(elements[i]);
                                break;
                            }
                        }
                    })

                })

            })
        })
        pler.appendChild(p);
    });
})

formbtn.addEventListener('click', () => {
    form.classList.add('hidden')
    btnn.innerText = 'Add'
    kod.value = ''
    boylam.value = ""
    enlem.value = ""
    adres.value = ""
    sorumlu.value = ""
    ip.value = ""
    belediye.value = ""
    password.value = ""
    il.value = ""
    ilce.value = ""
    semt.value = ""
})
goster.addEventListener('click', () => {

    form.classList.add('hidden')
    btnn.innerText = 'Güncelle'
    kod.value = gosterarray[0].kod
    boylam.value = gosterarray[0].boylam
    enlem.value = gosterarray[0].enlem
    adres.value = gosterarray[0].adres
    sorumlu.value = gosterarray[0].sorumlu
    ip.value = gosterarray[0].ip
    belediye.value = gosterarray[0].belediye
    password.value = gosterarray[0].password
    il.value = gosterarray[0].il
    ilce.value = gosterarray[0].ilce
    semt.value = gosterarray[0].semt

})
remowebtn.addEventListener('click', () => {
    db.collection('pasifİstasyon').doc(gosterarray[0].kod)
        .set({
            kod: gosterarray[0].kod,
            boylam: gosterarray[0].boylam,
            enlem: gosterarray[0].enlem,
            adres: gosterarray[0].adres,
            sorumlu: gosterarray[0].sorumlu,
            ip: gosterarray[0].ip,
            belediye: gosterarray[0].belediye,
            password: gosterarray[0].password,
            il: gosterarray[0].il,
            ilce: gosterarray[0].ilce,
            semt: gosterarray[0].semt
        })
})

db.collection('pasifİstasyon').get().then((snap) => {
    snap.docs.forEach(e => {


        var p = document.createElement('p');
        p.tabIndex = '1'
        p.innerHTML = e.data().kod;
        p.addEventListener('click', () => {
            pasifarray = []
            console.log(pasifarray)
            db.collection('pasifİstasyon').doc(e.id).get().then((doc) => {

                pasifarray.push(doc.data())

                pasifbtn.addEventListener('click', () => {
                    db.collection('İstasyon').doc(pasifarray[0].kod)
                        .set({
                            kod: pasifarray[0].kod,
                            boylam: pasifarray[0].boylam,
                            enlem: pasifarray[0].enlem,
                            adres: pasifarray[0].adres,
                            sorumlu: pasifarray[0].sorumlu,
                            ip: pasifarray[0].ip,
                            belediye: pasifarray[0].belediye,
                            password: pasifarray[0].password,
                            il: pasifarray[0].il,
                            ilce: pasifarray[0].ilce,
                            semt: pasifarray[0].semt
                        })
                        
                    db.collection('pasifİstasyon').doc(pasifarray[0].kod).delete().then(() => {
                        var element = document.getElementsByTagName('p');
                        for (var i = 0; i < element.length; i++) {
                            if (element[i].innerText ===pasifarray[0].kod) {
                                element[i].parentNode.removeChild(element[i]);
                                break;
                            }
                        }

                    })
                })




            })
        })

        plerpasif.appendChild(p);


    })
})

