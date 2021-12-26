(function () {
    "use strict";

    const form = document.querySelector("form");
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
        .catch((error) => Notiflix.Notify.failure("Error", "Ha ocurrido un error, intentalo más tarde."))
    }

    form.addEventListener("submit", handleSubmit);
})()