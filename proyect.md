🛠️ Proyecto: "Sistema de Gestión de Tareas (TaskBoard)" estilo Trello

🎯 Objetivo
Desarrollar una aplicación tipo Trello simplificado donde los usuarios puedan:

Crear tableros de tareas.

Crear tareas con título, descripción, estado (To Do, In Progress, Done).

Mover tareas entre estados.

🧩 Componentes del Proyecto

1. Frontend
Aplicación web tipo SPA que permite:

Visualizar tableros y tareas.

Crear, editar y mover tareas entre columnas.

Login básico (simulado).

2. Backend (API REST)
Expone endpoints como:

GET /boards

POST /tasks

PUT /tasks/{id}

GET /tasks?boardId=...

3. Base de Datos (Opcional) u otro mecanismo para persisitir los datos almacenados

Para persistencia de tareas y tableros:

Amazon RDS (PostgreSQL).

Opcionalmente, usar DynamoDB si se quiere evitar SQL y explorar NoSQL.

4. Servicios Adicionales AWS (Opcional)
SQS: para notificaciones asíncronas (ej. tareas que vencen pronto).
SNS: envío de mails al usuario si una tarea vence (puede ser automático con Lambda).
CloudWatch Logs: registro de errores y actividad.
CloudWatch Alarmas: por errores o latencia.
IAM Roles adecuados según el entorno.

🔐 Seguridad y Roles

Aplicar políticas IAM adecuadas.

📦 Entregables por Grupo

Diagrama de arquitectura elegido.
Código fuente del frontend y backend.
Evidencia de funcionamiento (URL pública, capturas, logs).

✅ Evaluación

Correcto funcionamiento end-to-end.
Almacenamiento persistente de datos.
Uso de al menos 4 servicios de AWS.
Despliegue documentado.
