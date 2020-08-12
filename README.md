# Para instalar la aplicación en modo desarrollo debera seguir los siguientes pasos:

## 1-) Instalar el controlador de versiones git:

    Ingresar como super usuario:

    $ su

    # aptitude install git

    Salir del modo super usuario

## 2-) Descargar el codigo fuente del proyecto api-luis-barrios-itcrowd :

    Para descargar el código fuente del proyecto contenido en su repositorio GIT realice un clon del proyecto api-luis-barrios-itcrowd:

    $ git clone https://github.com/lbarrios1985/api-luis-barrios-itcrowd.git

## 3-) Backend:

### 3.1-) Crear un Ambiente Virtual:

    El proyecto está desarrollado con el lenguaje de programación Python, se debe instalar Python v3.4.2. Con los siguientes comandos puede instalar Python y PIP.

    Entrar como root o super usaurio para la instalacion

    # aptitude install python3.4 python3-pip python3.4-dev python3-setuptools

    # aptitude install python3-virtualenv virtualenvwrapper

    Salir del modo root y crear el ambiente:

    $ mkvirtualenv --python=/usr/bin/python3 itcrowd

### 3.2-) Instalar los requerimientos del proyecto:

    Para activar el ambiente virtual itcrowd ejecute el siguiente comando:

    $ workon itcrowd

    Con el comando anterio se activa el ambiente virtual quedando de la siguiente manera:

    (itcrowd)$

    Entrar en la carpeta raiz del proyecto:

    (itcrowd)$ cd api-luis-barrios-itcrowd/backend

    (itcrowd)api-luis-barrios-itcrowd/backend$

    Desde ahi se deben instalar los requirimientos del proyecto con el siguiente comando:

    (itcrowd)$ pip install -r requirements.txt

    De esta manera se instalaran todos los requerimientos iniciales para montar el proyecto

### 3.3-) Crear base de datos y Migrar los modelos:

    Para migrar los modelos del proyecto se debe  ingresar a la raiz del proyecto api-luis-barrios-itcrowd y usar el siguiente comando:

    (itcrowd)$ python manage.py makemigrations

    (itcrowd)$ python manage.py migrate

### 3.4-) Crear un usuario para poder loguearse:

    Para poder registrar un usuario usar el siguiente comando:

    (itcrowd)$ python manage.py createsuperuser

    este es el usuario par poder ingresar en la plataforma 

### 3.5-) Iniciar la aplicacion (Backend) api-luis-barrios-itcrowd:

    Para iniciar la apliacion se debe  ejecutar el siguiente comando:

    (itcrowd)$ python manage.py runserver

    Ingresar a la plataforma en la ruta: localhost:8000

## 4-) Frontend:

### 4.1-) Instalar los requerimientos del proyecto:

    Entrar en la carpeta raiz del proyecto:

    cd  api-luis-barrios-itcrowd/frontend

    Desde ahi se deben instalar los requirimientos del proyecto con el siguiente comando:

    api-luis-barrios-itcrowd/frontend$ npm install

    De esta manera se instalaran todos los requerimientos iniciales para montar el proyecto

### 4.2-) Iniciar la aplicacion (Frontend) api-luis-barrios-itcrowd:

    Para iniciar la apliacion se debe  ejecutar el siguiente comando:

    api-luis-barrios-itcrowd/frontend$ npm start

    Ingresar a la plataforma en la ruta: localhost:3000

# Estandar de desarrollo del proyecto:

## 1-) Documentación:

    El proyecto se encuentra documentado bajo la Convenciones  la PEP257 Docstring Conventions

    Leer el siguiente elace para su aplicación:

    https://www.python.org/dev/peps/pep-0257/

## 2-) Codificación:

    El proyecto se encuentra codificado bajo la Guía de estilo para el código Python PEP8

    Leer el siguiente elace para su aplicación:

    https://www.python.org/dev/peps/pep-0008/
