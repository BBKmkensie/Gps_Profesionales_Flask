// Inicializar mapa
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.9827900, lng: -71.2394300 }, // Coordenadas iniciales
        zoom: 8
    });

    fetch('/api/obtener_profesionales')
        .then(response => response.json())
        .then(profesionales => {
            console.log("Profesionales cargados:", profesionales); // Verifica los profesionales cargados
            profesionales.forEach(prof => {
                console.log("Datos del profesional:", prof); // Verifica que `prof.id` sea correcto
                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(prof.latitud), lng: parseFloat(prof.longitud) },
                    map: map,
                    title: prof.nombre
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<h3>${prof.nombre}</h3><p>${prof.especializacion}</p><p>${prof.telefono}</p>
                              <button class="btn btn-primary" type="button" onclick="cargarProfesionalEnOffCanvas('${prof.nombre}', '${prof.especializacion}','${prof.telefono}' ,'${prof.latitud}','${prof.longitud}', ${prof.id}, ${JSON.stringify(prof.horarios)})">Agendar Cita</button>`
                });

                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });
            });
        })
        .catch(error => console.error('Error al cargar los profesionales:', error));
}


// Función para cargar el profesional en el Off-Canvas
function cargarProfesionalEnOffCanvas(nombre, especializacion, telefono, latitud, longitud, profesionalId, horarios) {
    const offCanvasContent = document.getElementById("offCanvasContent");

    // Construimos el HTML para mostrar en el Off-Canvas
    offCanvasContent.innerHTML = `
        <div class="info-panel text-center">
            <h5>Nombre: ${nombre}</h5>
            <p>Especialización: ${especializacion}</p>
            <p>Teléfono: ${telefono}</p>
            <h6>Días Disponibles</h6>
            <ul class="list-group" id="days-list"></ul>
        </div>
        <hr>
    `;

    const daysList = document.getElementById('days-list');

    // Cargar días y horas disponibles
    horarios.forEach(horario => {
        const dayItem = document.createElement('li');
        dayItem.classList.add('list-group-item');
        dayItem.dataset.day = `Día${horario.dia}`;
        dayItem.setAttribute('data-day', horario.dia);

        const hoursListElement = document.createElement('ul');
        hoursListElement.classList.add('list-group', 'hours-list');
        hoursListElement.id = `hours-${horario.dia}`;
        hoursListElement.style.display = 'none';

        const hourItem = document.createElement('li');
        hourItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        hourItem.textContent = `${horario.hora_inicio} - ${horario.hora_fin}`;

        const agendarButton = document.createElement('button');
        agendarButton.classList.add('btn', 'btn-primary', 'btn-agendar');
        agendarButton.textContent = 'Agendar';
        agendarButton.addEventListener('click', () => {
            confirmAppointment(horario.dia, horario.hora_inicio);
        });

        hourItem.appendChild(agendarButton);
        hoursListElement.appendChild(hourItem);
        dayItem.appendChild(hoursListElement);
        daysList.appendChild(dayItem);
    });

    // Toggle para mostrar/ocultar horas disponibles por día
    daysList.addEventListener('click', (event) => {
        if (event.target && event.target.matches('li.list-group-item')) {
            const selectedDay = event.target.getAttribute('data-day');
            toggleHoursForDay(selectedDay, event.target);
        }
    });

    // Función para mostrar/ocultar horas disponibles
    function toggleHoursForDay(day, selectedElement) {
        const hoursListElement = document.getElementById('hours-' + day);
        if (hoursListElement.style.display === 'none' || hoursListElement.style.display === '') {
            hoursListElement.style.display = 'block';
            selectedElement.classList.add('active');
        } else {
            hoursListElement.style.display = 'none';
            selectedElement.classList.remove('active');
        }
    }

    // Confirmar cita
    function confirmAppointment(day, hour) {
        alert(`Cita agendada exitosamente para el Día ${day} a las ${hour}`);
    }

    // Abrir el Off-Canvas al hacer clic en un profesional
    var offcanvasRight = new bootstrap.Offcanvas(document.getElementById('offcanvasRight'));
    offcanvasRight.show();
}



