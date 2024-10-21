from flask import (
    render_template,flash,request,url_for, session,Blueprint, g, jsonify
)
from app.db import get_db
from app.auth import login_logged_in_user, login_required

bp = Blueprint ("Usuario",__name__) 


@login_required
@bp.route ("/usuario")
def inicio ():
    return render_template ("usuario/inicio.html")


@bp.route ("/api/obtener_profesionales")
def ver_profesionales ():
    db, c = get_db ()
    c.execute ('''
    SELECT profesional.nombre, profesional.especializacion, profesional.telefono, 
           ubicacion.latitud, ubicacion.longitud
    FROM profesional
    INNER JOIN ubicacion ON profesional.id = ubicacion.profesional_id
''')
    profesionales = c.fetchall ()
    return jsonify (profesionales)


@bp.route ("/ver_perfil")
def VerUsuario ():
    db,c = get_db ()
    try:
        c.execute ("SELECT usuario, nombre FROM usuarios WHERE ID = %s",(g.user['id'],))
        usuario = c.fetchone()
        return render_template ("usuario/ver_perfil.html", usuario=usuario)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/obtener_horas/<int:profesional_id>', methods=['POST','GET'])
def obtener_horas(profesional_id):
    db, c = get_db()
    try:

        # Selecciona las horas disponibles para el profesional dado
        c.execute( """
            SELECT h.id, h.hora_inicio, h.hora_fin, h.dia
            FROM horarios h
            WHERE h.profesional_id = %s
        """,(profesional_id,))
        
        horarios = c.fetchall()

        # Organiza las horas por días
        result = {}
        for horario in horarios:
            dia = horario['dia']  # Formato de fecha, si es necesario, puedes formatearlo con strftime
            hora = f"{horario['hora_inicio']} - {horario['hora_fin']}"
            
            if dia not in result:
                result[dia] = []
            result[dia].append(hora)

        # Devuelve el resultado como JSON
        return jsonify(result)
    
    except  Exception as e:
        return  jsonify({"error": str(e)}), 500





