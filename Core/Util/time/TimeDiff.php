<?php
/**
 *
 * Clase para manejo de horario , cuenta con metodos para calcular el tiempo
 * transcurrido entre fechas y retorna la diferencia en segundos
 *
 *  Albert Eduardo Hidalgo Taveras
 * https://github.com/itsalb3rt/diferencia_tiempo_php
 **/
namespace Core\Util\time;

class TimeDiff{
    /**
     * Las propiedades start_work_hour y end_work_hour representan el intervalo de horas que son laborables
     * por ejemplo: una jornada habitual seria de 08:00:00 hasta las 17:00:00
     * todo aquello que no este dentro de este periodo se considera no laboral
     **/
    private $start_work_hour;
    private $end_work_hour;
    /**
     * Las propiedades start_date y end_date representan las fechas(sin la hora) del intervalo
     * que se pretende extraer la diferencia
     **/
    private $start_date;
    private $end_date;
    /**
     * Cantidad de horas laborales dentro de un dia, esto se utiliza cuando
     * las fechas son varios dias, asi el algoritmo simplemente calculara
     * cuantos dias hay entre el primer dia y el ultimo, luego
     * multiplicara esta cantidad de dias por la cantidad de horas y asi
     * el algoritmo hace menos trabajo
     *
     * Ejemplo:
     * tengo 4 dias, 2 de estos son dias completos por lo que es mas simple
     * multiplicar 8x2 que hacer el calculo dia por dia
     **/
    private $hours_per_day;

    /**
     * Son los dias festivos que deben ser excluidos del conteo
     */
    private $holidays;
    /**
     * Dias laborales en 1 semana, estos por defecto son 1 y 5 respectivamente, 1 para lunes y 5 para viernes
    **/
    private $start_day;
    private $end_day;


    public function __construct($start_date, $end_date,$start_work_hour = '08:00:00',$end_work_hour = '17:00:00',$hours_per_day = 24,$work_days = array(1,5),$holidays = array('1990-01-01')){
        $this->start_date = $start_date;
        $this->end_date = $end_date;
        $this->start_work_hour = $start_work_hour;
        $this->end_work_hour = $end_work_hour;
        $this->holidays = $holidays;
        $this->hours_per_day = $hours_per_day;
        $this->start_day = $work_days[0];
        $this->end_day = $work_days[1];
    }

    /**
     * Este metodo retorna el total de segundos transcurridos entre 2 fechas
     * Tomando en cuanta solo los dias de la semana y los dias de fiestas pasados como array
     *
     * Parametros
     * @dias_fiesta array [Son los dias que se excluiran del conteno]
     **/
    public function timeDiff() {
        $type = 'array';
        //formateando fechas
        $date_1 = date_create($this->start_date);
        $date_2 = date_create($this->end_date);
        //Fecha 1 no puede ser mayor a fecha 2, de lo contrario setorna falso y finaliza el script  
        if ($date_1 > $date_2){
            $tiempo_transcurrido['timeDiff'] = 0;
            return $tiempo_transcurrido;
        }

        /**
         * Detemrinando si la fecha inicio y final es el mismo dia para calcular
         * el tiempo transcurrido en un dia
         **/
        if($date_1->format('Y-m-d') == $date_2->format('Y-m-d')){
            $tiempo_transcurrido['timeDiff'] =  $this->diferencia_tiempo_en_un_dia($date_1->format('Y-m-d H:i:s'),$date_2->format('Y-m-d H:i:s'));
            return  $tiempo_transcurrido;
        }

        /**
         * Obteniendo la cantidad de dias que existe entre la fecha inicial y final
         * para obtener los dias habiles solamente, esto tambien excluye del conteno
         * los dias feriados pasados en un array como parametro @dia_diesta
         **/
        $tiempo_transcurrido = array();
        $tiempo_transcurrido['total_days'] = '';

        while ($date_1->format('Y-m-d') <= $date_2->format('Y-m-d')) {
            $dia = $date_1->format('N');
            if ($dia >= $this->start_day && $dia <= $this->end_day && !in_array($date_1->format('Y-m-d'),$this->holidays)) {
                $tiempo_transcurrido['total_days'][] = $date_1->format('d');
            }
            date_add($date_1, date_interval_create_from_date_string('1 day'));
        }
        if (strtolower($type) === 'sum') {
            array_map(function($k) use(&$tiempo_transcurrido) {
                $tiempo_transcurrido[$k] = count($tiempo_transcurrido[$k]);
            }, array_keys($tiempo_transcurrido));
        }

        // Recuperando las fechas originales para realizar los calculos del tiempo transcurrido
        $date_1 = date_create($this->start_date);
        $date_2 = date_create($this->end_date);
        /**
         * Calculando que tiempo transcurrio en el primer dia y segundo dia
         *
         * Esto para obtener entre el horario laboral el tiempo que ha transcurrido
         * desde la fecha inicial y la fecha final
         *
         * El resultado es devuelto en segundos
         */
        $tiempo_transcurrido['first_day_time'] = $this->diferencia_tiempo_en_un_dia($date_1->format('Y-m-d H:i:s'),$date_1->format('Y-m-d') . $this->end_work_hour);
        $tiempo_transcurrido['last_day_time'] = $this->diferencia_tiempo_en_un_dia($date_2->format('Y-m-d') . $this->start_work_hour,$date_2->format('Y-m-d H:i:s'));

        /**
         * Verificando que el resultado del tiempo en segundos del primer dia y el ultimo dia
         * no sea negativo, de ser negativo se iguala a 0
         **/
        $tiempo_transcurrido['last_day_time'] = $this->evitar_negativos($tiempo_transcurrido['last_day_time']);
        $tiempo_transcurrido['last_day_time'] = $this->evitar_negativos($tiempo_transcurrido['first_day_time']);

        //Sumando los segundos del primer dia y el ultimo dia
        $tiempo_transcurrido['timeDiff'] = $tiempo_transcurrido['first_day_time'] + $tiempo_transcurrido['last_day_time'];

        //Obteniendo en segundos la cantidad de horas si ha pasado mas de 1 dia de la fecha de inicio a la fecha final
        $tiempo_transcurrido['total_time'] = $this->dias_a_horas(count($tiempo_transcurrido['total_days']));

        //Obteniendo el total de tiempo transcurrido en segundos
        $tiempo_transcurrido['timeDiff'] += $tiempo_transcurrido['total_time'];

        return $tiempo_transcurrido;

    }
    /**
     * Devuelve la cantidad de tiempo en segundos, es utilizado para calcular
     * diferencia de tiempo en un mismo dia
     **/
    private function diferencia_tiempo_en_un_dia($fecha_inicial,$fecha_final){

        $segundos = (((strtotime($fecha_final) - strtotime($fecha_inicial))/60)/60);
        return $segundos * 60 * 60;
    }

    /**
     * @param $dias [array con los dias]
     *
     * retorna la cantidad de horas en segundos de todos los dias
     * si ha pasado mas de 1 dia entre la fecha de inicio
     * y la fecha final y convirtiendolo en segundos
     *
     * Return int
     *
     * @return float|int
     */
    private function dias_a_horas($dias){
        if($dias >= 3){
            //Si hay 3 o mas dias se resta 2 a la cantidad para no contar la fecha de inicio y la final como 8 horas mas
            $horas = ($dias - 2) * $this->hours_per_day;
            return ($horas) * 60 * 60;
        }else{
            return 0;
        }
    }

    /**
     * @param $cantidad int
     *
     * Este metodo retorna 0 si la cantidad pasada es menor 1
     * en todos los casos este metodo no recibe numeros reales
     * solo reibe enteros los cuales son los segundos
     *
     * @return int
     */
    private function evitar_negativos($cantidad){
        if($cantidad < 1){
            return 0;
        }else{
            return $cantidad;
        }
    }
}
