/**
 * Utilitario generar url relativas (Enfocado a AJAX)
 *
 **/

class Route {

    /**
     * Define las propiedades a utilizar
     *
     * @controller string
     * @action string
     * @params string | array | mixed
     * @include_actual_pathname boolean | string
     * Esta propiedad define si se dejara el path actual o se omitira, tambien
     * permite enviar un path personalizado
     **/
    constructor(controller, action, params = null, include_actual_pathname = false) {
        //Obtiene la url actual
        this.url = new URL(window.location.href);

        this.host = this.url.host;
        this.protocol = this.url.protocol;
        this.actualPathname = this.custom_patchname(include_actual_pathname);

        this.controller = controller;
        this.action = action;
        this.parameters = params;
        this.newPathname = null;
        //Solo acepta caracteres alfabeticos
        this.regex = /[0-9éèêëùüàâöïç\"\/\%\(\).'?!,@$# \n\r]/g;
        //Acepta caracteres alfanumericos
        this.regex_alfanumeric = /[\W_]+-_/g;
    }

    get route() {
        if (this.protocol != 'file') {
            this.check_controller_action_is_valid();
            this.newPathname = this.patchName;
            this.parameters = (this.parameters != null) ? this.params : '';

            if (this.actualPathname == null) {
                return this.protocol + '//' + this.host + '/' + this.newPathname + this.parameters;

            } else {
                return this.protocol + '//' + this.host + this.actualPathname + this.newPathname + this.parameters;

            }
        } else {
            this.generate_new_throw('No se pueden generar rutas en un archivo local, debe tenerlo en un servidor.');
        }
    }

    get patchName() {
        return this.controller + '/' + this.action;
    }

    get params() {

        if (this.parameters != null) {
            if (Array.isArray(this.parameters)) {
                return this.array_params;
            } else if (typeof this.parameters == 'string') {
                return '/' + this.parameters.trim().replace(this.regex_alfanumeric, '');
            } else if (typeof this.parameters == 'number') {
                return '/' + this.parameters.toString().trim().replace(this.regex_alfanumeric, '');
            }
        } else {
            return null;
        }

    }

    check_controller_action_is_valid() {
        if (this.controller == 'undefined' || this.controller == null) {
            this.generate_new_throw('El controlador esta vació, no puede haber ruta sin controlador');
        } else if (this.action == 'undefined' || this.action == null) {
            this.generate_new_throw('La acción esta vacia, no puede haber ruta sin acción');
        }
        this.purify_controller_action();
    }

    purify_controller_action() {

        if (typeof this.controller == 'string') {
            this.controller = this.controller.trim().replace(this.regex, '');
        } else {
            this.generate_new_throw('El controlador no es de tipo string');
        }

        if (typeof this.action == 'string') {
            this.action = this.action.trim().replace(this.regex, '');
        } else {
            this.generate_new_throw('La acción no es de tipo string');
        }

    }

    generate_new_throw(message) {
        throw new Error(message);
    }

    get array_params() {
        let params = '';
        for (let index in this.parameters) {
            params += '/' + this.parameters[index].toString().trim().replace(this.regex_alfanumeric, '');
        }
        return params;
    }

    /**
     * Verifica que el ultimo caracter sea un slash
     * de no ser asi se lo agregara para hacer que la
     * ruta sea una ruta valida
     **/
    custom_patchname(path_indications) {

        if (typeof path_indications == 'boolean') {

            if (path_indications == false) {
                if (this.url.pathname.slice(-1) != '/') {
                    return '/' +  this.url.pathname.substr(1,this.url.pathname.substr(1).indexOf('/')) + '/';
                } else {
                    return '/' + this.url.pathname.substr(1,this.url.pathname.substr(1).indexOf('/')) + '/';
                }
            } else {
                return null;
            }
        } else {
            return '/' + path_indications + '/';
        }

    }
}