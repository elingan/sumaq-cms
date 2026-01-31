Vamos a definir la siguiente fase de la aplicación Sumaq CMS.
Ahora que ya tenemos la integración con GitHub funcionando y podemos listar los repositorios de un usuario admin autenticado, el siguiente paso es permitir que el usuario seleccione un repositorio y configure su sitio web.

- La idea es que el usuario seleccione un repositorio y marque como un repositorio de un sitio web pulsando un boton "Añadir como sitio web".
- Al pulsar el boton se debe solicitar una confirmación modal para asegurarse de que el usuario quiere añadir ese repositorio como sitio web.
- Una vez confirmado, se debe debe abrir un formulario para configurar el sitio web.
- El formulario debe permitir configurar al menos los siguientes campos:
  - Descripción del sitio web
  - Rama del repositorio a desplegar (por defecto main o master)
  - Permitir seleccionar los usuarios con acceso al sitio web (solo usuarios ya registrados en Sumaq CMS, obtener de clerk y con rol de owner, el usuario admin tiene acceso a todos los sitios web)
  - Plantilla de despliegue (por ahora solo Vercel)
  - Dominio personalizado (opcional)
- Al enviar el formulario, se debe guardar la configuración del sitio web en la base de datos.
- Finalmente, se debe redirigir al usuario a una página de detalles del sitio web recién creado, donde se muestre la configuración del sitio web y un resumen del estado del despliegue


