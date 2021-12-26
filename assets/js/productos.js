(function () {
    "use strict";

    const firebaseConfig = {
        apiKey: "AIzaSyCm_1yYZnHKXK7uLm4oPtjZ2DwJ5DZ7kj0",
        authDomain: "ferreteria-web.firebaseapp.com",
        projectId: "ferreteria-web",
        storageBucket: "ferreteria-web.appspot.com",
        messagingSenderId: "265163528174",
        appId: "1:265163528174:web:69b64e2846c643846ee0ff"
    };
    
    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

    const producto = Handlebars.compile(`
        <div class="col-lg-4 col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-img-top position-relative">
                    {{#if agotado}}
                    <div class="position-absolute top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-10"
                        style="z-index: 1;">
                        <strong class="badge badge-lg bg-danger rounded-0 fs-5">
                            Agotado
                        </strong>
                    </div>
                    {{/if}}

                    <div id="{{id}}" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-inner">
                            {{#each imagenes}}
                            <div class="carousel-item {{#if @first}}active{{/if}}">
                                <img src="{{this}}" class="d-block w-100" style="height: 12rem; object-fit: cover;">
                            </div>
                            {{/each}}
                        </div>

                        <div class="carousel-indicators" style="margin-bottom: -2rem;">
                            {{#each imagenes}}
                            <button type="button" data-bs-target="#{{../id}}" data-bs-slide-to="{{@index}}"
                                class="w-auto h-auto rounded-circle bg-secondary p-1 {{#if @first}}active{{/if}}">
                            </button>
                            {{/each}}
                        </div>
                    </div>
                </div>

                <span class="badge bg-warning position-absolute p-2 rounded-pill" style="top: 8px; right: 8px;">
                    {{precio}} RD$
                </span>

                <div class="card-body">
                    <h6 class="mt-3 fw-bold">
                        {{nombre}}
                    </h6>
                    <p class="card-text text-muted small">
                        {{descripcion}}
                    </p>
                </div>
            </div>
        </div>
    `);

    const empty = `
        <div class="col-12">
            <h3 class="text-muted text-center">
                No se encontraron productos
            </h3>
        </div>
    `;

    const contenedor = document.querySelector('#productContainer');
    const searchbox = document.querySelector('#searchbox');
    const searcbboxSend = document.querySelector('#searchbox-send');

    searchbox.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            buscarProductos(e.target.value);
        }
    }, false);

    searcbboxSend.addEventListener('click', (e) => {
        const value = searchbox.value;

        if (!String(value).trim().length) {
            buscarProductos();
            return;
        }

        buscarProductos(value);
    }, false);

    const buscarProductos = async (value) => {
        Notiflix.Loading.hourglass({
            backgroundColor: 'rgb(33 37 41)',
        });

        value ||= '';
        value &&= value.charAt(0).toUpperCase() + value.slice(1);

        db.collection('productos')
            .orderBy('nombre')
            .startAt(value)
            .endAt(value + '\uf8ff')
            .get()
            .then(x => {
                const data = [];
                x.forEach(y => data.push({ id: y.id, ...y.data() }))
                return data;
            })
            .then(products => {
                contenedor.innerHTML = [...products].map(x => producto(x)).join('');

                if (!products?.length) {
                    contenedor.innerHTML = empty;
                }

                setTimeout(() => Notiflix.Loading.remove(), 2500);
            });
    };

    window.onload = () => {
        buscarProductos();
    };
})()