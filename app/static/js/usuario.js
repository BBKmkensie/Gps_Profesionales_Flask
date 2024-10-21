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
                          <button class="btn btn-primary" type="button" onclick="cargarProfesionalEnOffCanvas('${prof.nombre}', '${prof.especializacion}','${prof.telefono}' ,'${prof.latitud}','${prof.longitud}', ${prof.id})">Agendar Cita</button>`
            });

            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        });
    })
    .catch(error => console.error('Error al cargar los profesionales:', error));

}
//desde  aquí

function cargarProfesionalEnOffCanvas(nombre, especializacion, telefono, latitud,longitud,profesionalId, horarios) {
    // Selecciona el contenedor del off-canvas
    const offCanvasContent = document.getElementById("offCanvasContent");

    // Actualiza el contenido del off-canvas con la información del profesional, pero sin la latitud y longitud
    offCanvasContent.innerHTML = `
        <div class="info-panel text-center">
            <h5>Nombre: ${nombre}</h5>
            <p>Especialización: ${especializacion}</p>
            <p>Teléfono: ${telefono}</p>
            <h6>Días Disponibles</h6>
            <ul class="list-group" id="days-list">
        </div>
        <hr>
    `;

 
    //             <li class="list-group-item" data-day="15">Día 15</li>
    //             <ul class="list-group hours-list" id="hours-15"></ul>
    //             <li class="list-group-item" data-day="16">Día 16</li>
    //             <ul class="list-group hours-list" id="hours-16"></ul>
    //             <li class="list-group-item" data-day="17">Día 17</li>
    //             <ul class="list-group hours-list" id="hours-17"></ul>
    //         </ul>
    // -------------------------------
    // Simular horas disponibles
    // const hours = {
    //     '15': ['10:00 - 11:00', '12:00 - 13:00', '14:00 - 15:00'],
    //     '16': ['09:00 - 10:00', '11:00 - 12:00', '15:00 - 16:00'],
    //     '17': ['08:00 - 09:00', '13:00 - 14:00', '16:00 - 17:00']
    // };

    
    const daysList = document.getElementById('days-list');
        // Manejar el clic en los días disponibles
    daysList = document.getElementById('days-list');
    daysList.addEventListener('click', (event) => {
        if (event.target && event.target.matches('li.list-group-item')) {
            const selectedDay = event.target.getAttribute('data-day');
            toggleHoursForDay(selectedDay, event.target);
        }
    });

    // Cargar Los días y horas disponible
    horarios.forEach(horario => {
        
        console.log(`Cargando horarios: Día ${horario.dia}, Hora Inicio: ${horario.hora_inicio}, Hora Fin: ${horario.hora_fin}`);

        const dayItem = document.createElement('li')
        dayItem.classList.add('list-group-item')
        dayItem.dataset.day = `Día${horario.dia}`;
        dayItem.setAttribute('data-day', horario.dia);

        const   hoursListElement = document.createElement('ul')
        hoursListElement.classList.add('list-group', 'hours-list')
        hoursListElement.id = `hours-${horario.dia}`;
        hoursListElement.dataset.day = 'none';

        // Cargar haras  disponibles
        const hourItem = document.createElement('li');
        hourItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        hourItem.textContent = `${horario.hora_inicio} -  ${horario.hora_fin}`

        const agendarButton  = document.createElement('button');
        agendarButton.classList.add('btn', 'btn-primary', 'btn-agendar');
        agendarButton.textContent = 'Agendar';
        agendarButton.addEventListener('click', () => {
            confirmAppointment(horario.dia, horario.hora_inicio);
        });

        horarioItem.appendChild(agendarButton);
        hoursListElement.appendChild(hourItem);
        dayItem.appendChild(hoursListElement);
        daysList.appendChild(dayItem);

    })
  


    // Alternar la visibilidad de las horas y cargarlas
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

    // Abre el off-canvas
    var offcanvasRight = new bootstrap.Offcanvas(document.getElementById('offcanvasRight'));
    offcanvasRight.show();
}

