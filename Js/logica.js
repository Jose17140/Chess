var azul = -1; // -1 VALOR DE LA IA <= ESTA VARIABLE NO SE USA
var rojo = 1; // 1 VALOR DEL USUARIO <= ESTA VARIABLE NO SE USA
var ficha_act = false; //FICHA ACTIVADA
var jugar = false; // INICIAR EL JUEGO
var doble_salto = false; // DOBLE SALTO
var movimientos = false;
var juego_terminado = false; // FIN DEL JUEGO
var salvar_de = salvar_en = null;
var toggler = null;
var togglers = 0;
var espera = false; // En Espera
//Tablero de juego 
//Los 1 representan al usuario, los -1 representan a la ia
var tablero;
Tablero(1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0,
    0, -1, 0, -1, 0, -1, 0, -1);

function Iniciar() {
    mensaje("Seleccione una pieza roja para mover.");

    jugar = true;
}

function Tablero() {
    tablero = new Array();
    for (var i = 0; i < 8; i++) {
        tablero[i] = new Array();
        for (var j = 0; j < 8; j++) {
            tablero[i][j] = Tablero.arguments[8 * j + i];
        }
    }
    tablero[-2] = new Array(); // PREVIENE ERRORES
    tablero[-1] = new Array();
    tablero[8] = new Array();
    tablero[9] = new Array();
}

function mensaje(s) {
    if (!juego_terminado) {
        var elm = document.getElementById("mensaje");
        elm.innerHTML = s;
    }
}

//COORDENADAS
function Coord(x, y) {
    this.x = x;
    this.y = y;
}

function coord(x, y) {
    c = new Coord(x, y);
    return c;
}

// EVENTO QUE SE EJECUTA AL HACER CLICK
function accion_click(i, j) {
    if (!espera) {
        if (jugar) {
            if (integ(tablero[i][j]) == 1) {
                toggle(i, j);
                inicioCronometro();
            } else if (ficha_act) {
                espera = true;
                movimiento(selected, coord(i, j));
                setTimeout("UnMomento()", 2000);
            } else {
                mensaje("Click en la pieza roja, haga click donde quiere mover");
            }
        } else {
            mensaje("Espere un momento.");
        }
    } else {
        mensaje("Espere un momento.");
    }
}

// MENSAJE DE ESPERA
function UnMomento() {
    espera = false;
}

function toggle(x, y) {
    if (jugar) {
        if (ficha_act)
            dibujar(selected.x, selected.y, "/damas/image/user1" + ((tablero[selected.x][selected.y] == 1.1) ? "k" : "") + ".gif");
        if (ficha_act && (selected.x == x) && (selected.y == y)) {
            ficha_act = false;
            if (doble_salto) {
                jugar = doble_salto = false;
                computer();
            }
        } else {
            ficha_act = true;
            dibujar(x, y, "/damas/image/user2" + ((tablero[x][y] == 1.1) ? "k" : "") + ".gif");
        }
        selected = coord(x, y);
    } else {
        if ((ficha_act) && (integ(tablero[selected_c.x][selected_c.y]) == -1))
            dibujar(selected_c.x, selected_c.y, "/damas/image/ia1" + ((tablero[selected_c.x][selected_c.y] == -1.1) ? "k" : "") + ".gif");
        if (ficha_act && (selected_c.x == x) && (selected_c.y == y)) {
            ficha_act = false;
        } else {
            ficha_act = true;
            dibujar(x, y, "/damas/image/ia2" + ((tablero[x][y] == -1.1) ? "k" : "") + ".gif");
        }
        selected_c = coord(x, y);
    }
}

//DIBUJA EL ESPACIO VACIO CUANDO SE COME UNA FICHA
function dibujar(x, y, name) {
    document.images["space" + x + "" + y].src = name;
}

function integ(num) {
    if (num != null)
        return Math.round(num);
    else
        return null;
}

function abs(num) {
    return Math.abs(num);
}

function sign(num) {
    if (num < 0) return -1;
    else return 1;
}

function movimiento_permitido(from, to) {
    if ((to.x < 0) || (to.y < 0) || (to.x > 7) || (to.y > 7)) return false;
    ficha = tablero[from.x][from.y];
    distancia = coord(to.x - from.x, to.y - from.y);
    if ((distancia.x == 0) || (distancia.y == 0)) {
        mensaje("Solo se puede hacer movimiento en diagonal.");
        return false;
    }
    if (abs(distancia.x) != abs(distancia.y)) {
        mensaje("Este movimiento no es valido.");
        return false;
    }
    if (abs(distancia.x) > 2) {
        mensaje("Este movimiento no es valido.");
        return false;
    }
    if ((abs(distancia.x) == 1) && doble_salto) {
        return false;
    }
    if ((tablero[to.x][to.y] != 0) || (ficha == 0)) {
        return false;
    }
    if ((abs(distancia.x) == 2) && (integ(ficha) != -integ(tablero[from.x + sign(distancia.x)][from.y + sign(distancia.y)]))) {
        return false;
    }
    if ((integ(ficha) == ficha) && (sign(ficha) != sign(distancia.y))) {
        return false;
    }
    return true;
}

function movimiento(from, to) {
    jugar = true;
    if (movimiento_permitido(from, to)) {
        ficha = tablero[from.x][from.y];
        distancia = coord(to.x - from.x, to.y - from.y);
        if ((abs(distancia.x) == 1) && (tablero[to.x][to.y] == 0)) {
            intercambiar(from, to);
        } else if ((abs(distancia.x) == 2) && (integ(ficha) != integ(tablero[from.x + sign(distancia.x)][from.y + sign(distancia.y)]))) {
            doble_salto = false;
            intercambiar(from, to);
            comer(from.x + sign(distancia.x), from.y + sign(distancia.y));
            if ((movimiento_permitido(to, coord(to.x + 2, to.y + 2))) || (movimiento_permitido(to, coord(to.x + 2, to.y - 2))) || (movimiento_permitido(to, coord(to.x - 2, to.y - 2))) || (movimiento_permitido(to, coord(to.x - 2, to.y + 2)))) {
                doble_salto = true;
                mensaje("Complete el doble salto, click en la pieza y mover nuevamente.");
            }
        }
        if ((tablero[to.x][to.y] == 1) && (to.y == 7)) Coronar(to.x, to.y);
        selected = to;
        if (fin_juego() && !doble_salto) {
            setTimeout("toggle(" + to.x + "," + to.y + ");jugar = doble_salto = false;computer();", 1000);
        }
    }
    return true;
}

//LA FICHA SE CORONA EN EL JUEGO
function Coronar(x, y) {
    if (tablero[x][y] == 1) {
        tablero[x][y] = 1.1; // king you
        dibujar(x, y, "/damas/image/user2k.gif");
    } else if (tablero[x][y] == -1) {
        tablero[x][y] = -1.1; // king me
        dibujar(x, y, "/damas/image/ia2k.gif");
    }
}


function intercambiar(from, to) {
    if (jugar || movimientos) {
        inmovil_src = document.images["space" + to.x + "" + to.y].src;
        document.images["space" + to.x + "" + to.y].src = document.images["space" + from.x + "" + from.y].src;
        document.images["space" + from.x + "" + from.y].src = inmovil_src;
    }
    inmovil_num = tablero[from.x][from.y];
    tablero[from.x][from.y] = tablero[to.x][to.y];
    tablero[to.x][to.y] = inmovil_num;
}

//LA FICHA ES COMIDA
function comer(x, y) {
    if (jugar || movimientos)
        dibujar(x, y, "/damas/image/claro.gif");
    tablero[x][y] = 0;
}

function Result(val) {
    this.high = val;
    this.dir = new Array();
}

function los_movimientos(from, to) {
    toggle(from.x, from.y);
    movimientos = true;
    intercambiar(from, to);
    if (abs(from.x - to.x) == 2) {
        comer(from.x + sign(to.x - from.x), from.y + sign(to.y - from.y));
    }
    if ((tablero[to.x][to.y] == -1) && (to.y == 0)) Coronar(to.x, to.y);
    setTimeout("selected_c = coord(" + to.x + "," + to.y + ");ficha_act = true;", 900);
    setTimeout("bak=jugar;jugar=false;toggle(" + to.x + "," + to.y + ");jugar=bak;", 1000);
    if (fin_juego()) {
        setTimeout("movimientos = false;jugar = true;togglers=0;", 600);
        mensaje("Mover Ahora.");
    }
    return true;
}

function fin_juego() {
    // make sure game is not over (RETORNA FALSO SI EL JUEGO ESTA TERMINADO)
    computador = jugador = false;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (integ(tablero[i][j]) == -1) computador = true;
            if (integ(tablero[i][j]) == 1) jugador = true;
        }
    }
    if (!computador) mensaje("Felicitaciones has ganado el juego ;) !");
    if (!jugador) mensaje("Perdiste. Juego Terminado.");
    juego_terminado = (!computador || !jugador)
    return (!juego_terminado);
}

function computer() {
    // PRIMER PASO - IMPEDIR ALGUN SALTO
    for (var j = 0; j < 8; j++) {
        for (var i = 0; i < 8; i++) {
            if (integ(tablero[i][j]) == 1) {
                if ((movimiento_permitido(coord(i, j), coord(i + 2, j + 2))) && (evitar(coord(i + 2, j + 2), coord(i + 1, j + 1)))) {
                    return true;
                }
                if ((movimiento_permitido(coord(i, j), coord(i - 2, j + 2))) && (evitar(coord(i - 2, j + 2), coord(i - 1, j + 1)))) {
                    return true;
                }
            }
            if (tablero[i][j] == 1.1) {
                if ((movimiento_permitido(coord(i, j), coord(i - 2, j - 2))) && (evitar(coord(i - 2, j - 2), coord(i - 1, j - 1)))) {
                    return true;
                }
                if ((movimiento_permitido(coord(i, j), coord(i + 2, j - 2))) && (evitar(coord(i + 2, j - 2), coord(i + 1, j - 1)))) {
                    return true;
                }
            }
        }
    }

    // SEGUNDO PASO - if step one not taken, look for jump
    for (var j = 7; j >= 0; j--) {
        for (var i = 0; i < 8; i++) {
            if (salto(i, j))
                return true;
        }
    }
    salvar_de = null;

    // TERCER PASO - if step two not taken, look for safe single space moves
    for (var j = 0; j < 8; j++) {
        for (var i = 0; i < 8; i++) {
            if (solo(i, j))
                return true;
        }
    }

    // NO SE MUEVE SI NO HAY MOVIMIENTO SEGURO, TOMAR EL MOVIMIENTO QUE SE PUEDA CONSEGUIR
    if (salvar_de != null) {
        los_movimientos(salvar_de, salvar_en);
    } else {
        mensaje("Has ganado!");
        parar();
        juego_terminado = true;
    }
    salvar_de = salvar_en = null;
    return false;
}

function salto(i, j) {
    if (tablero[i][j] == -1.1) {
        if (movimiento_permitido(coord(i, j), coord(i + 2, j + 2))) {
            los_movimientos(coord(i, j), coord(i + 2, j + 2));
            setTimeout("salto(" + (i + 2) + "," + (j + 2) + ");", 500);
            return true;
        }
        if (movimiento_permitido(coord(i, j), coord(i - 2, j + 2))) {
            los_movimientos(coord(i, j), coord(i - 2, j + 2));
            setTimeout("salto(" + (i - 2) + "," + (j + 2) + ");", 500);
            return true;
        }
    }
    if (integ(tablero[i][j]) == -1) {
        if (movimiento_permitido(coord(i, j), coord(i - 2, j - 2))) {
            los_movimientos(coord(i, j), coord(i - 2, j - 2));
            setTimeout("salto(" + (i - 2) + "," + (j - 2) + ");", 500);
            return true;
        }
        if (movimiento_permitido(coord(i, j), coord(i + 2, j - 2))) {
            los_movimientos(coord(i, j), coord(i + 2, j - 2));
            setTimeout("salto(" + (i + 2) + "," + (j - 2) + ");", 500);
            return true;
        }
    }
    return false;
}

function solo(i, j) {
    if (tablero[i][j] == -1.1) {
        if (movimiento_permitido(coord(i, j), coord(i + 1, j + 1))) {
            salvar_de = coord(i, j);
            salvar_en = coord(i + 1, j + 1);
            if (analisis(coord(i, j), coord(i + 1, j + 1))) {
                los_movimientos(coord(i, j), coord(i + 1, j + 1));
                return true;
            }
        }
        if (movimiento_permitido(coord(i, j), coord(i - 1, j + 1))) {
            salvar_de = coord(i, j);
            salvar_en = coord(i - 1, j + 1);
            if (analisis(coord(i, j), coord(i - 1, j + 1))) {
                los_movimientos(coord(i, j), coord(i - 1, j + 1));
                return true;
            }
        }
    }
    if (integ(tablero[i][j]) == -1) {
        if (movimiento_permitido(coord(i, j), coord(i + 1, j - 1))) {
            salvar_de = coord(i, j);
            salvar_en = coord(i + 1, j - 1);
            if (analisis(coord(i, j), coord(i + 1, j - 1))) {
                los_movimientos(coord(i, j), coord(i + 1, j - 1));
                return true;
            }
        }
        if (movimiento_permitido(coord(i, j), coord(i - 1, j - 1))) {
            salvar_de = coord(i, j);
            salvar_en = coord(i - 1, j - 1);
            if (analisis(coord(i, j), coord(i - 1, j - 1))) {
                los_movimientos(coord(i, j), coord(i - 1, j - 1));
                return true;
            }
        }
    }
    return false;
}

function posibilidades(x, y) {
    if (!salto(x, y))
        if (!solo(x, y))
            return true;
        else
            return false;
    else
        return false;
}

function evitar(end, s) {
    i = end.x;
    j = end.y;
    if (!posibilidades(s.x, s.y))
        return true;
    else if ((integ(tablero[i - 1][j + 1]) == -1) && (movimiento_permitido(coord(i - 1, j + 1), coord(i, j)))) {
        return los_movimientos(coord(i - 1, j + 1), coord(i, j));
    } else if ((integ(tablero[i + 1][j + 1]) == -1) && (movimiento_permitido(coord(i + 1, j + 1), coord(i, j)))) {
        return los_movimientos(coord(i + 1, j + 1), coord(i, j));
    } else if ((tablero[i - 1][j - 1] == -1.1) && (movimiento_permitido(coord(i - 1, j - 1), coord(i, j)))) {
        return los_movimientos(coord(i - 1, j - 1), coord(i, j));
    } else if ((tablero[i + 1][j - 1] == -1.1) && (movimiento_permitido(coord(i + 1, j - 1), coord(i, j)))) {
        return los_movimientos(coord(i + 1, j - 1), coord(i, j));
    } else {
        return false;
    }
}

//SE ANALIZA EL MOVIMIENTO
function analisis(from, to) {
    i = to.x;
    j = to.y;
    n = (j > 0);
    s = (j < 7);
    e = (i < 7);
    w = (i > 0);
    if (n && e) ne = tablero[i + 1][j - 1];
    else ne = null;
    if (n && w) nw = tablero[i - 1][j - 1];
    else nw = null;
    if (s && e) se = tablero[i + 1][j + 1];
    else se = null;
    if (s && w) sw = tablero[i - 1][j + 1];
    else sw = null;
    eval(((j - from.y != 1) ? "s" : "n") + ((i - from.x != 1) ? "e" : "w") + "=0;");
    if ((sw == 0) && (integ(ne) == 1)) return false;
    if ((se == 0) && (integ(nw) == 1)) return false;
    if ((nw == 0) && (se == 1.1)) return false;
    if ((ne == 0) && (sw == 1.1)) return false;
    return true;
}

//CRONOMETRO
var centesimas = 0;
var segundos = 0;
var minutos = 0;

function inicioCronometro() {
    control = setInterval(cronometro, 10);
}

function parar() {
    clearInterval(control);
}

function cronometro() {
    if (centesimas < 99) {
        centesimas++;
        if (centesimas < 10) {
            centesimas = "0" + centesimas
        }
        Centesimas.innerHTML = ":" + centesimas;
    }
    if (centesimas == 99) {
        centesimas = -1;
    }
    if (centesimas == 0) {
        segundos++;
        if (segundos < 10) {
            segundos = "0" + segundos
        }
        Segundos.innerHTML = ":" + segundos;
    }
    if (segundos == 59) {
        segundos = -1;
    }
    if ((centesimas == 0) && (segundos == 0)) {
        minutos++;
        if (minutos < 10) {
            minutos = "0" + minutos
        }
        Minutos.innerHTML = "-" + minutos;
    }
}