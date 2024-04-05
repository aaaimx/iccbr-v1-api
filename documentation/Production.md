## Acceso al servidor remóto de AWS (EC2)

El servidor para los procesos del Back-End está alojado en AWS, para poder acceder se recomienda usar el protocólo SSH, sigue los pasos para lograrlo:

1. Solicitar la **Key pair assigned at launch** al administrador del proyecto, con esta se tendrá el acceso al servidor EC2.

> [!TIP]
> Si prefieres crear tu propia key puedes seguir estos pasos:
>
> 1. Se necesita de una Key pair assigned at launch, para ello debes solicitar las credenciales de la cuenta principal de AWS, una vez accediendo ir a EC2 > Instances y aparecerán las instancias creadas hasta el momento, donde está alojado el servidor es el que tiene el nombre de **iccbr-2024**, acceder a esta instancia.
>
> 2. Se mostrarán todos los detalles del servidor, como la IP pública, privada, etc. Haciendo un poco de scroll aparecerá una opción como esta **Key pair assigned at launch** con el nombre **iccbr-key**, acceder a esta key.
>
> 3. Dar click en el botón **Create Key pair** y seguir los pasos, una vez se tega descargado guardar en una carpeta, de preferencia donde se tengan los dos repositorios locales (Front-End y Back-End).

3. Una vez tengamos la key pair en nuestra carpeta, accederemos desde la terminal hasta la ubicación donde esta dicha key pair.

4. Escribir el siguiente comando para acceder de forma remota:

```
ssh ubuntu@public-IPv4 -i iccbr-key.pem
```
> [!TIP]
> En vez de poner **public-IPv4** recuerda colocar la IPv4 pública que nos proporciona el EC2.

Listo, ya accedimos al servidor EC2 de AWS para este proyecto, ahora podras visualizar el repositorio del Back-End siguiendo estos pasos:

1. Accede al repositorio local:

```
cd main
ls
```

2. El comando **ls** mostrará los diferentes repositorios de los proyectos existentes (en caso de haberlos), para acceder al de este proyecto ejecuta el siguiente comando:

```
cd iccbr-v1-api
```

El servidor debe estar en ejecución, para comprobar esto puedes ejecutar el siguiente comando:

```
ps aux | grep npm
```
> [!TIP]
> El comando **ps aux** muestra todos los procesos en ejecución en el sistema junto con información detallada sobre ellos. El comando **grep npm** filtra la salida de ps aux, mostrando solo las líneas que contienen la palabra "npm". En resumen, este comando muestra los procesos relacionados con npm que están en ejecución en el sistema.

Debe mostrarse algo como esto:
```
ubuntu     11044  7.4  6.6 1100996 64536 pts/0   Sl   04:49   0:00 npm start
```

En caso de que no se muestre ningun proceso, entonces puedes inicializar el servidor remoto con el siguiente comando:
```
npm start &
```
> [!TIP]
> Este comando ejecuta el script de inicio definido en el archivo **package.json** de un proyecto de **Node.js** utilizando npm. La parte npm start indica que se debe ejecutar el script de inicio definido en la sección "scripts" del archivo package.json, usualmente utilizado para iniciar la aplicación. El **&** al final del comando ejecuta el script en segundo plano, permitiendo que el terminal esté disponible para otras operaciones mientras la aplicación se ejecuta.

Si vuelves a ejecutar el comando para ver los procesos debería aparecer en ejecución.
