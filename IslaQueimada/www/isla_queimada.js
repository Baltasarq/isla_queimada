// Isla Queimada (c) Baltasar 2020 MIT License <baltasarq@gmail.com>


ctrl.setTitle( "Isla Queimada" );
ctrl.setIntro(
    "<p>\
     Tras hundirse su yate, Enrique llega a Isla Queimada, \
     frente a la costa de Brasil. \
     ¡No puede creer su suerte! \
     Sin embargo, un peligro oculto le amenaza... \
     ¿dónde está todo el mundo? \
    </p>"
);

ctrl.setPic( "res/queimada_island.jpg" );
ctrl.setAuthor( "baltasarq@gmail.com" );
ctrl.setVersion( "1.1 20210214" );


// *** Locs =========================================================
// --------------------------------------------------------- Beach --
const locBeach = ctrl.places.creaLoc(
    "Playa",
    [ "roca", "rocas" ],
    "Este acceso permite trepar hasta el bosque. \
     No hay otra opción que ${subir al bosque al sur, s}, \
     o ${nadar en el mar, sal}."
);
locBeach.pic = "res/access.jpg";

locBeach.getExitsDesc = function() {
    return "Puedes ${subir la pendiente hacia el bosque al sur, s}.";
};

locBeach.preExamine = function() {
    var toret = this.desc;
    
    if ( this.getTimesExamined() == 0 ) {
        toret = "Un suave ronroneo te despierta... \
                 el mar rompe contra las rocas a tus pies. \
                 Resoplas sobre la superficie de roca que asciende \
                 hacia la selva por encima de ti. \
                 Te das cuenta con gran alivio\
                 de que has sobrevivido, \
                 si bien la desesperanza te invade al notar \
                 que estás totalmente perdido. \
                 </p><p>\
                 El mar refleja el gris del cielo \
                 como una arisca superficie metálica. \
                 La piedra bajo ti se antoja blanda y desagradable. \
                 </p><p>"
            + toret;
    }
    
    return toret;
};

locBeach.preExit = function() {
    const player = ctrl.personas.getPlayer();
    
    player.say( "No parece una buena idea, Enrique." );
    return "Eres un náufrago... \
            volver al mar no tiene ya mucho sentido.";
};


// --------------------------------------------------------- Slope --
const locSlope = ctrl.places.creaLoc(
    "Pendiente al bosque",
    [ "pendiente", "bosque" ],
    "La vegetación aparece exuberante sobre tu cabeza, \
     si bien en este punto es más bien rocosa. \
     La ascensión continúa girando hacia el ${este, este}, \
     mientras el descenso al mar se sitúa al ${norte, norte}."
);
locSlope.pic = "res/slope.jpg";
locSlope.setExitBi( "norte", locBeach );

locSlope.getExitsDesc = function() {
    return "Puedes ${seguir la ascensión hacia el este, e}, o \
            bajar al acceso al mar hacia el ${norte, n}.";
};


// ---------------------------------------------------------- Hill --
const locHill = ctrl.places.creaLoc(
    "Colina en la selva",
    [ "colina", "selva" ],
    "Rodeado por la selva, \
     sin duda lo más llamativo en este punto \
     es una antigua ${verja, ex verja} de seguridad. \
     Aunque aparece comida por la ${vegetación, ex vegetacion}, \
     parece claro que cierra el paso hacia el ${este, este} \
     a algún tipo de presidio. \
     </p><p>Un suave descenso abandona la selva \
     hacia el ${oeste, oeste}. \
     Una senda, amenazada por ser comida por la espesura, \
     se interna hacia el ${norte, norte}."
);
locHill.pic = "res/prison_fence.jpg";
locHill.setExitBi( "oeste", locSlope );
locHill.southAccess = false;

locHill.getExitsDesc = function() {
    return "Puedes ${seguir el descenso hacia el oeste, o}, o \
            internarte en la selva hacia el ${norte, n}.";
};

const objFence = ctrl.creaObj(
    "verja",
    [],
    "La verja aparece semioculta \
     por la ${vegetación, ex bosque} en varios puntos. \
     Está tan oxidada que parece que podría ${abrirse, abrir verja}.",
    locHill,
    Ent.Scenery
);
objFence.pulled = false;

objFence.preOpen = function() {
    this.pulled = true;
    
    return "Tiras con fuerza... pero no cede. \
            Algunos trozos de ramas y arbustos salen volando... \
            No parece que hayas conseguido gran cosa.";
};

const objForest = ctrl.creaObj(
    "bosque",
    [ "vegetacion", "arboles", "arbustos" ],
    "Las ramas y arbustos tapan en parte ${la verja, ex verja}.",
    locHill,
    Ent.Scenery
);

objForest.preExamine = function() {
    var toret = this.desc;
    
    if ( objFence.pulled ) {
        toret += " Hay ahora ciertos huecos \
                  dejados por la flora eliminada...\
                  aparece ahora claridad hacia el ${sur, sur}... \
                  debe ser posible progresar por ahí.";
        
        if ( !locHill.southAccess ) {
            locHill.southAccess = true;
            locHill.desc += " Aunque la vegetación es espesa, \
                          siguiendo la referencia \
                          de la claridad que percibes a través \
                          de la verja sientes que podrías avanzar \
                          hacia el ${sur, sur}.";
            ctrl.places.doDesc();
        }
    }
    
    return toret;
};


// --------------------------------------------------------- Cliff --
const locCliff = ctrl.places.creaLoc(
    "Acantilado",
    [],
    "El ${bosque al norte, norte} termina en un acantilado \
     de gran pendiente que se abre ahora \
     de forma amedrentadora a tus pies. \
     Por entre las rocas, hacia el ${este, este}, \
     se puede caminar pegado al muro exterior \
     de algún tipo de presidio."
);
locCliff.pic = "res/cliff.jpg";
locCliff.setExitBi( "norte", locHill );
locCliff.getExitsDesc = function() {
    return "Puedes ir al bosque al ${norte, norte}, \
            o al acantilado al ${este, este}.";
};


// -------------------------------------------------------- Cliff2 --
const locCliff2 = ctrl.places.creaLoc(
    "Acantilado",
    [],
    "En este punto, aún rodeado de flora selvática, \
     hay una puerta abierta que \
     permite el ${acceso a la penitenciaría, norte}. \
     Al ${oeste, oeste}, aunque con dificultad, se podría volver \
     rodeando el acantilado."
);
locCliff2.pic = "res/outer_wall.jpg";
locCliff2.setExitBi( "oeste", locCliff );
locCliff2.getExitsDesc = function() {
    return "Al ${norte, norte} está la penitenciaría, \
            el acantilado está al ${oeste, oeste}.";
};

locCliff2.preExamine = function() {
    var toret = this.desc;
    
    if ( this.getTimesExamined() == 0 ) {
        toret += "</p><p>\
                  Obviamente, debe haber otro acceso \
                  que ahora ya es imposible encontrar, \
                  para acceder a lo que es finalmente \
                  la fachada de la... penitenciaría.";
    }
        
    return toret;
};


// ---------------------------------------------------------- Yard --
const locYard = ctrl.places.creaLoc(
    "Patio",
    [],
    "El patio del presidio permite el acceso \
     al ${portón principal al sur, sur}, \
     a ${una oficina al norte, norte}, \
     y varias ${celdas al este, entra}."
);
locYard.pic = "res/yard.jpg";
locYard.setExitBi( "sur", locCliff2 );
locYard.getExitsDesc = function() {
    return "Puedes salir del patio al ${sur, sur}, \
            entrar en una oficina al ${norte, norte}, \
            o dirigirte a unas celdas al ${este, este}.";
};

locYard.preExamine = function() {
    var toret = this.desc;
    
    if ( this.getTimesExamined() == 0 ) {
        toret += "</p><p>\
                  Todo parece completamente abandonado. \
                  No de forma precipitada, sino \
                  habiendo desmantelado todo sistemáticamente.";
    }
    else
    if ( this.getTimesExamined() == 1 ) {
        toret += "</p><p>\
                  La sensación de soledad \
                  se hace insoportable aquí dentro.</p><p>\
                  Una cárcel abandonada... ¡increíble!.";
    }    
    
    if ( locPrisonCell.open ) {
        toret += "</p><p>Todas las celdas tienen \
                  la puerta entreabierta, \
                  una rendija que va creciendo de la más lejana \
                  a la más cercana a la oficina. \
                  De hecho, solo en esta \
                  última se puede entrar realmente.";
    }
        
    return toret;
};

locYard.preEnter = function() {
    if ( locPrisonCell.open ) {
        ctrl.goto( locPrisonCell );
        return "Has entrado en la única celda \
                en la que cabes por la puerta.";
    } else {
        ctrl.personas.getPlayer().say( "¿Cómo? Todas están cerradas..." );
        return "No es posible.";
    }
};

locYard.preGo = function() {
    const goAction = actions.getAction( "go" );
    var toret = "";
    
    if ( parser.sentence.term1 == "este" ) {
        toret = parser.parse( "entra" );
    } else {
        toret = goAction.exe( parser.sentence );
    }
    
    return toret;
};


// ----------------------------------------------- Prison's office --
const locPrisonOffice = ctrl.places.creaLoc(
    "Oficina de la penitenciaría",
    [],
    "Un pequeño cuarto del que han sido eliminadas mesas, sillas, \
     estanterías y otros ${muebles, ex muebles}. \
     Lo más llamativo es ${una palanca, ex palanca} \
     encastrada en la pared sur, \
     que sospechas tiene que ver con la fila de celdas accesibles \
     desde el ${patio, sur}."
);
locPrisonOffice.pic = "res/prison_office.jpg";
locPrisonOffice.setExitBi( "sur", locYard );
locPrisonOffice.getExitsDesc = function() {
    return "Puedes ir al patio al ${sur, sur}.";
};

const objLever = ctrl.creaObj(
    "palanca",
    [],
    "Está casi estirada, \
     y lleva en su parte inferior una serie de engranajes \
     que se introducen en la pared. \
     Tiene un agujero en su parte superior. \
     Sospechas que en este punto es la que \
     mantiene el cierre de las celdas, por lo que se podría \
     ${empujar, empuja palanca} para abrirlas.",
    locPrisonOffice,
    Ent.Scenery
);

objLever.preExamine = function() {
    var toret = this.desc;
    
    if ( locPrisonCell.open ) {
        toret = "La palanca está ahora muy cerca de la pared, \
                 presumiblemente habiendo abierto todas las celdas.";
    }
    
    return toret;
};

objLever.prePush = function() {
    var toret = "Ya has empujado la palanca todo lo posible. \
                 De hecho, no parece que puedas moverla más: \
                 se ha atascado.";
    
    if ( !locPrisonCell.open ) {
        toret = "Pese a emplear todas tus fuerzas... \
                 la palanca no se mueve.";
        
        if ( ctrl.isPresent( objStick ) ) {
            locPrisonCell.open = true;
            
            toret = "Insertas el palo en el orificio, de manera que \
                     tengas un buen punto de apoyo. \
                     Empujas con todas tus fuerzas... \
                     a regañadientes, \
                     la palanca avanza entre crujidos, \
                     roces y quejidos de todo tipo. \
                     Llega un momento en el que no va más allá, \
                     hagas lo que hagas.";
        } else {
            ctrl.personas.getPlayer().say( "No, así no hay manera."  );
        }
    }
    
    return toret;
};

const objFurniture = ctrl.creaObj(
    "mueble",
    [ "muebles" ],
    "Solo queda una pequeña ${mesa, ex mesa} \
     apartada contra la pared más lejana.",
    locPrisonOffice,
    Ent.Scenery
);

const objTable = ctrl.creaObj(
    "mesa",
    [ "mesa" ],
    "Una pequeña mesa con algunos ${periódicos, ex periodicos} \
     encima de ella.",
    locPrisonOffice,
    Ent.Scenery
);
objTable.setContainer();
objTable.setOpen( false );

objTable.preExamine = function() {
    var toret = this.desc;
    
    if ( !objTable.isOpen() ) {
        objTable.setOpen();
    }
    
    return toret;
};

const objNewspaper = ctrl.creaObj(
    "periódicos",
    [ "periodicos", "diarios" ],
    "Periódicos muy viejos y amarillentos. \
     Dudas sobre si ${cogerlos, coge periodicos} \
     por su escasa utilidad.",
    objTable,
    Ent.Portable
);

objNewspaper.preTake = function() {
    var toret = "Los revisas para encontrar que \
                 no son de gran utilidad, decides no hacerlo.";
    
    if ( ctrl.places.limbo.has( objDrawer ) ) {
        toret += " </p><p>¡Los periódicos tapaban \
                   un ${cajón, ex cajon} de la mesa!";
        objDrawer.moveTo( objTable );
        objTable.desc += " Un pequeño ${cajón, ex cajon} \
                          se sitúa bajo la mesa.";
    } else {
        toret = "Decides no hacerlo.";
        ctrl.personas.getPlayer().say( "No sirven para nada." );
    }
    
    return toret;
};

const objDrawer = ctrl.creaObj(
    "cajón",
    [ "cajon" ],
    "Es realmente minúsculo, aunque todavía tiene buen aspecto. \
     Debería ${funcionar, abrir cajon} sin problema.",
    ctrl.places.limbo,
    Ent.Scenery
);
objDrawer.setContainer();
objDrawer.setOpen( false );

objDrawer.preOpen = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "Ya está abierto, no hay nada más.";
    
    if ( !this.isOpen() ) {
        this.setOpen();
        objKey.moveTo( player );
        toret = "¡En su interior hay una llave! La recoges... \
                 nunca se sabe.";
    }
    
    return toret;
};

const objKey = ctrl.creaObj(
    "llave",
    [],
    "Una llave, sí.",
    ctrl.places.limbo,
    Ent.Portable
); 


// ------------------------------------------------- Prison's cell --
var locPrisonCell = ctrl.places.creaLoc(
    "Celda",
    [],
    "La celda es estrecha y, en general, minúscula. Puedes ver \
     ${un cadáver, ex cuerpo} en un rincón. \
     Puedes girarte sobre ti mismo para ${salir, oeste}."
);
locPrisonCell.open = false;
locPrisonCell.setExitBi( "oeste", locYard );
locPrisonCell.pic = "res/cell.jpg";
locPrisonCell.getExitsDesc = function() {
    return "Solo puedes salir al ${oeste, oeste}.";
};

locPrisonCell.preExamine = function() {
    const player = ctrl.personas.getPlayer();
    var toret = this.desc;
    
    if ( this.getTimesExamined() == 0 ) {
        toret += " No puedes imaginar qué \
                  puede haber pasado para que \
                  quedase esta persona aquí...";

        player.say( "Quizás finalmente este lugar \
                  no fue abandonado de una manera tan \
                  planeada como parecía." );
    }
    
    return toret;
};

const objCorpse = ctrl.creaObj(
    "cadáver",
    [ "cuerpo" ],
    "${Ropas raídas, ex ropas} sobre un cadáver ya... reseco. \
     Es curioso, está prácticamente tumbado \
     con un ${brazo, ex brazo} tapando cierta zona del otro.",
    locPrisonCell,
    Ent.Scenery
);

objCorpse.postExamine = function() {
    ctrl.achievements.achieved( "vampiros" );
};

const objArms = ctrl.creaObj(
    "brazo",
    [ "brazos" ],
    "Hay dos agujeros muy finos en el brazo que estaba tapado. \
     ¿Una picadura? ¿De qué animal?",
    locPrisonCell,
    Ent.Scenery
);

objArms.preExamine = function() {
    var toret = this.desc;
    
    if ( this.getTimesExamined() < 2 ) {
        toret = "Con cuidado, \
                 apartas como puedes un brazo del otro... \
                 Ciertos desagradables chasquidos \
                 acompañan el movimiento \
                 de los brazos al separarse.</p><p>"
                 + toret;
    }
    
    return toret;
};

const objClothes = ctrl.creaObj(
    "ropas",
    [ "ropa", "uniforme" ],
    "Las ropas han pasado muchos años en un ambiente húmedo, \
     sobre un cadáver en descomposición, \
     lo que hace es que quede ya poco de ellas, \
     meros vestigios del uniforme que una vez fueron. \
     Los ${bolsillos, ex bolsillos}, al ser de tela reforzada, \
     están en mejor estado.",
    locPrisonCell,
    Ent.Scenery
);

const objPockets = ctrl.creaObj(
    "bolsillos",
    [ "bolsillo" ],
    "Tan sucios como vacíos.",
    locPrisonCell,
    Ent.Scenery
);
objPockets.setContainer();

objPockets.preExamine = function() {
    var toret = this.desc;
    
    if ( this.has( objMobilePhone ) ) {
        toret = "Hay algo duro... \
                 ¡Es un ${teléfono móvil, coge movil}!";
    }
    
    return toret;
};

var objMobilePhone = ctrl.creaObj(
    "teléfono móvil",
    [ "celular", "telefono", "movil" ],
    "Un teléfono móvil de segunda o tercera generación, \
     con pantalla LCD monocroma. ${¿Funcionará?, enciende movil}",
    objPockets,
    Ent.Portable
);
objMobilePhone.timesBooted = 0;

objMobilePhone.preTake = function() {
    const player = ctrl.personas.getPlayer();
    
    if ( locPrisonCell.has( player ) ) {
        player.say( "Hay que ver cómo se las apañan los presos \
                     para conseguir cosas..." );
        objMobilePhone.moveTo( player );
    }
    
    return "Te lo guardas con cuidado.";
};

objMobilePhone.preStart = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "Decides no hacerlo.";
    
    ++this.timesBooted;
    
    if ( this.timesBooted == 1 ) {
        player.say( "Mmm... Aquí seguro que no hay cobertura." );
        toret = "En cualquier caso, mejor esperar a encenderlo \
                 a tener posibilidades de, \
                 con la poca batería que le quede, \
                 hacer una llamada a emergencias.";
    }
    else {
        player.say( "No es buena idea. \
                     Aquí seguro que no hay cobertura." );
    }
    
    return toret;
};


// -------------------------------------------- Path in the jungle --
const locPathInJungle = ctrl.places.creaLoc(
    "Camino en la jungla",
    [],
    "Una ${senda, ex senda}, que antaño debía ser mucho más ancha, \
     serpentea por entre la ${espesura, ex espesura} \
     de ${norte, norte} a ${sur, sur}."
);
locPathInJungle.pic = "res/jungle_path.jpg";
locPathInJungle.setExitBi( "sur", locHill );
locPathInJungle.getExitsDesc = function() {
    return "Puedes avanzar tanto al ${norte, norte}, \
            como al ${sur, sur}.";
};

const objPath = ctrl.creaObj(
    "senda",
    [],
    "El camino serpentea de ${norte, norte} a ${sur, sur}, \
     semioculto entre los ${arbustos, ex arbustos}.",
    locPathInJungle,
    Ent.Scenery
);

const objJungle = ctrl.creaObj(
    "espesura",
    [ "vegetacion", "jungla" ],
    "La vegetación forma un selva cerrada, espesura impenetrable.",
    locPathInJungle,
    Ent.Scenery
);

const objBush = ctrl.creaObj(
    "arbustos",
    [ "arbusto" ],
    "Arbustos tan altos como una persona se asientan \
     a ambos lados del camino, creando una cúpula vegetal sobre él \
     y bajo los ${árboles, ex arboles}.",
    locPathInJungle,
    Ent.Scenery
);

const objTrees = ctrl.creaObj(
    "árboles",
    [ "arbol", "arboles" ],
    "Algunos pequeños árboles de fuertes troncos \
     y pequeñas hojas crecen a ambos lados del camino.",
    locPathInJungle,
    Ent.Scenery
);

objTrees.preExamine = function() {
    var toret = this.desc;
    
    if ( this.has( objStick ) ) {
        toret += " Podrías coger uno de estos \
                   ${pequeños ejemplares, coge tronco}.";
    }
    
    return toret;
};
objTrees.setContainer();

const objStick = ctrl.creaObj(
    "palo",
    [ "tronco" ],
    "Eliminadas las hojas, queda una fuerte vara de madera.",
    objTrees,
    Ent.Portable
);

objStick.preTake = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "Cogido.";
    
    if ( objTrees.has( objStick ) ) {
        this.moveTo( player );
        toret = "Arrancas el pequeño árbol y eliminas las hojas.";
        player.say( "Esto vendría bien para hacer palanca." );
        
    }
    
    return toret;
};

// --------------------------------------- Front of the lighthouse --
const locLighthouseHutFront = ctrl.places.creaLoc(
    "Camino en la jungla",
    [],
    "Un reducido claro permite el acceso \
     a una pequeña ${casa, ex casa} \
     al ${este, entra}, que aparece como de servicio \
     de un ${faro, ex faro}. \
     Quizás en el pasado hubo otros caminos, pero solo puedes \
     distinguir el que se interna en la jungla al ${sur, sur}."
);
locLighthouseHutFront.pic = "res/lighthouse.jpg";
locLighthouseHutFront.setExitBi( "sur", locPathInJungle );
locLighthouseHutFront.getExitsDesc = function() {
    return "Puedes entrar en la casa al ${este, entra}, \
            o volver al ${sur, sur}.";
};

locLighthouseHutFront.preEnter = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "No puedes hacer eso.";
    
    if ( !objHouse.open ) {
        if ( ctrl.isPresent( objKey ) ) {
            player.say( "¡Sí! Sabía que esta llave era importante." );
            toret = "Abriste la puerta con la llave, y entraste.";
            objHouse.setOpen();
            ctrl.goto( locLighthouseHut );
        } else {
            toret = "No se puede abrir.";
            player.say( "Cerrada... a cal y canto." );
        }
    } else {
        toret = "Entraste en la casa con mucho cuidado.";
        ctrl.goto( locLighthouseHut );
    }
    
    return toret;
};

const objHouse = ctrl.creaObj(
    "casa",
    [],
    "Una pequeña casa, se diría que es el hogar del farero.",
    locLighthouseHutFront,
    Ent.Scenery
);
objHouse.setOpen( false );

const objLightHouse = ctrl.creaObj(
    "faro",
    [],
    "El faro se yergue desafiante entre la jungla.",
    locLighthouseHutFront,
    Ent.Scenery
);


// ---------------------------------------------- Lighthouse's hut --
const locLighthouseHut = ctrl.places.creaLoc(
    "Casa del farero",
    [ "casa", "farero", "faro" ],
    "Una pequeña estancia incluye todo lo que esta pequeña casa \
     puede ofrecer: ${armario, ex muebles}, ${mesa, ex muebles}, \
     ${cocina, ex cocina}, ${despensa, ex muebles}, y ${cama, ex cama}.\
     </p><p>Puedes salir hacia la selva al ${oeste, oeste}. \
     Hay otra puerta al ${norte, norte}."
);
locLighthouseHut.pic = "res/lighthouse_hut_interior.jpg";
locLighthouseHut.setExit( "oeste", locLighthouseHutFront );
locLighthouseHut.getExitsDesc = function() {
    return "Puedes salir a la selva al ${oeste, oeste}, \
            o cruzar una puerta al ${norte, norte}.";
};

const objHutFurniture = ctrl.creaObj(
    "muebles",
    [],
    "Hay varios muebles en muy mal estado, ruinosos.",
    locLighthouseHut,
    Ent.Scenery
);

var objBed = ctrl.creaObj(
    "cama",
    [],
    "Una cama en muy mal estado.",
    locLighthouseHut,
    Ent.Scenery
);
objBed.searched = false;

objBed.preExamine = function() {
    var toret = this.desc;
    
    if ( !this.searched ) {
        toret += " Es curioso, es como si hubiera \
                   allí ${un bulto, busca en cama}."
    } else {
        toret += " No puedes evitar mirar hacia \
                   la macabra ${escena en la cama, busca en cama}.";
    }
    
    return toret;
};

objBed.preSearch = function() {
    var toret = "Dos cadáveres, medio podridos ya, y con varias \
                 marcas de mordeduras por el cuerpo.";
    
    if ( !this.searched ) {
        this.searched = true;
        ctrl.personas.getPlayer().say( "¡Oh, dios mío!" );
        toret = "Tiras de la manta que cubre la cama, y el horror \
                 te invade. Son... eran... dos personas. \
                 De alguna manera, trataron de cubrirse con \
                 la manta en un fútil intento de salir con vida... \
                 sin éxito, claro. Puedes ver varias mordeduras \
                 distribuidas por pares... y alcanzas a ver un \
                 cuerpo viscoso y tubular que se escapa por alguna \
                 grieta en la pared... ¡serpientes!";
    }
    
    return toret;
};

var objKitchen = ctrl.creaObj(
    "cocina",
    [],
    "Una cocina ya ruinosa.",
    locLighthouseHut,
    Ent.Scenery
);
objKitchen.setContainer();
objKitchen.setOpen( false );

objKitchen.preExamine = function() {
    var toret = this.desc;
    
    if ( this.has( objOil ) ) {
        toret += " Hay múltiples ${cacharros, busca en cocina} \
                   de costroso aspecto."
    } else {
        toret += " Múltiples y costrosos cacharros se agolpan \
                   en la repisa.";
    }
    
    return toret;
};

objKitchen.preSearch = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "Cacharros sin interés.";
    
    if ( this.has( objOil ) ) {
        ctrl.print( "Rebuscando entre los cacharros has encontrado \
                     un bote con algo de ennegrecido aceite." );
        player.say( "Este aceite podría ser útil... me lo quedo." );
        toret = "";
        objOil.moveTo( player );
    }
    
    return toret;
};

const objOil = ctrl.creaObj(
    "aceite",
    [],
    "Aceite viscoso y un tanto... negro.",
    objKitchen,
    Ent.Portable );


// ----------------------------------------- Lighthouse's basement --
const locLighthouseBasement = ctrl.places.creaLoc(
    "Sótano del faro",
    [ "sotano", "faro" ],
    "Algún tipo de generador mantiene la instalación eléctrica.\
     Hay una puerta al ${sur, sur}, \
     y otra más grande al ${este, este}. \
     Una escalera ${asciende, sube}, enroscándose en \
     las paredes del faro."
);
locLighthouseBasement.pic = "res/inside_lighthouse.jpg";
locLighthouseBasement.setExitBi( "sur", locLighthouseHut );
locLighthouseBasement.getExitsDesc = function() {
    return "Varias posibilidades pueden tomarse desde aquí: \
            se puede ${ascender, sube}, ir a la ${casa, sur}, \
            y salir al ${este, este}.";
};


// ---------------------------------------------- Lighthouse's top --
const locLighthouse = ctrl.places.creaLoc(
    "Faro",
    [],
    "Desde aquí se ve toda la ${isla, ex isla}, \
     rodeada por el ${mar, ex mar}. \
     La ${maquinaria, ex maquinaria} parece parada desde hace mucho. \
     </p><p>Una escalera ${desciende, baja}, \
     internándose dentro de la estructura."
);
locLighthouse.pic = "res/view_from_lighthouse.jpg";
locLighthouse.setExitBi( "abajo", locLighthouseBasement );
locLighthouse.getExitsDesc = function() {
    return "Desde aquí solo es posible ${bajar, baja}.";
};

const objSea = ctrl.creaObj(
    "mar",
    [ "agua" ],
    "El mar. inabarcable, inexorable, se extiende \
     en todas direcciones allende la isla. \
     No hay duda, estás atrapado.",
    locLighthouse,
    Ent.Scenery
);

const objIsland = ctrl.creaObj(
    "isla",
    [ "tierra" ],
    "La isla es pequeña, aunque se extiende en gran tamaño \
     hacia el norte. Deduces que lo que has explorado hasta ahora \
     es la parte sur. \
     Hacia el este, muy cerca, una gran pendiente \
     desciende abruptamente hacia el agua.",
    locLighthouse,
    Ent.Scenery
);

const objMachinery = ctrl.creaObj(
    "maquinaria",
    [],
    "El ${foco, ex foco} con su gran ${lente, ex lente} está parado, \
     parece que desde hace mucho tiempo.",
    locLighthouse,
    Ent.Scenery
);

const objLens = ctrl.creaObj(
    "lente",
    [ "lente" ],
    "Es una lente con un gran aumento... \
     nunca habías visto nada igual.",
    locLighthouse,
    Ent.Scenery
);
objLens.setContainer();
objLens.setOpen( false );

objLens.preExamine = function() {
    var toret = this.desc;
    
    if ( !this.isOpen() ) {
        toret += " Observas que se puede ${abrir, abrir lente} \
                   mediante unas abrazaderas.";
    } else {
        toret += "</p><p>" + ctrl.list( this );
    }
    
    return toret;
};

objLens.preOpen = function() {
    var toret = "La lente ya está abierta...";
    
    if ( !this.isOpen() ) {
        toret = "Abres las abrazaderas, y tiras de la lente, \
                 que gira como una portezuela.";
        this.setOpen();
    }
    
    return toret;
};

const objLightBulb = ctrl.creaObj(
    "bombilla",
    [],
    "Es una gran bombilla. \
     Tiene que serlo, para iluminar \
     grandes distancias y servir de guía a los barcos.",
    objLens,
    Ent.Portable
);

objLightBulb.preTake = function() {
    var toret = "No pienso meter la mano ahí...";
    
    if ( this.owner != locLighthouseYard ) {
        toret = takeAction.exe( parser.sentence );
        ctrl.achievements.achieved( "iluminado" );
    }
    
    return toret;
};

const objSearchlight = ctrl.creaObj(
    "foco",
    [],
    "Este foco parece que debería ${girar, empuja foco} \
     sobre un gran ${eje, ex eje}.",
    locLighthouse,
    Ent.Scenery
);
objSearchlight.setContainer();
objSearchlight.setOpen( false );

objSearchlight.preExamine = function() {
    var toret = this.desc;
    
    if ( this.isOpen() ) {
        toret += " En un costado hay \
                   un pequeño ${armarito, ex armario}.";
    }
    
    return toret;
};

objSearchlight.prePush = function() {
    var toret = "¡Atascado!";
    
    if ( objAxis.oiled ) {
        if ( !this.isOpen() ) {
            this.setOpen();
            toret = "Empujas con fuerza, y el faro cede un tanto. \
                    Tras girar, ha quedado al descubierto \
                    un pequeño ${armario, ex armarito}.";
        }
    } else {
        ctrl.personas.getPlayer().say( "Así es que no hay manera..." );
    }
    
    return toret;
};

const objAxis = ctrl.creaObj(
    "eje",
    [],
    "Sobre él giraría el foco. Le hace mucha falta \
     un ${buen engrase, busca en eje}. \
     Es casi seguro que es por eso por lo que no gira, \
     a pesar de haber corriente eléctrica.",
    locLighthouse,
    Ent.Scenery
);
objAxis.oiled = false;

objAxis.preSearch = function() {
    const player = ctrl.personas.getPlayer();
    var toret = "No es posible.";
    
    if ( ctrl.isPresent( objOil ) ) {
        this.oiled = true;
        objOil.moveTo( ctrl.places.limbo );
        ctrl.print( "Vertiendo el aceite sobre el eje, la maquinaria \
                 parece haberlo intentado, \
                 se oyó un zumbido y el foco \
                 se ha movido un tanto... pero nada más." );
        player.say( "Pues vaya fracaso..." );
        toret = "";
    } else {
        player.say( "No tengo con qué engrasarlo..." );
    }
    
    return toret;
};

const objToolbox = ctrl.creaObj(
    "armarito",
    [ "armario", "caja" ],
    "Un pequeño armario se sitúa en un costado del foco.",
    objSearchlight,
    Ent.Scenery
);
objToolbox.setContainer();
objToolbox.setOpen( false );

objToolbox.preExamine = function() {
    var toret = this.desc;
    
    if ( !this.isOpen() ) {
        toret += " No parece estar \
                  ${cerrado con llave, abre armarito}."
    } else {
        toret += "</p><p>" + ctrl.list( this );
    }
    
    return toret;
};

objToolbox.preOpen = function() {
    var toret = "Ya está abierto...";
    
    if ( !this.isOpen() ) {
        this.setOpen();
        toret = "La caja cede fácilmente...";
    }
    
    return toret;
};

var objFlareGun = ctrl.creaObj(
    "pistola",
    [ "pistola", "bengala", "bengalas" ],
    "Dispara bengalas... ¡${está cargada, enciende pistola}!",
    objToolbox,
    Ent.Portable
);

objFlareGun.preStart = function() {
    const player = ctrl.personas.getPlayer();
    const currentLoc = ctrl.places.getCurrentLoc();
    var toret = "No quieres malgastar la única bengala";
    
    if ( this.owner == player ) {
        if ( currentLoc == locLighthouseYard ) {
            if ( ctrl.isPresent( objLightBulb ) ) {
                ctrl.print( "Has disparado a la bombilla, \
                        sobre las serpientes, \
                        alzándose una gran llamarada sobre ellas. \
                        ¡Salen corriendo! El calor y las llamas, \
                        aunque de corta duración, hace que huyan \
                        despavoridas. ¡El paso está ahora libre!" );
                
                player.say( "¡Toma ya!" );
                
                ctrl.print( "Tiras la pistola a un lado... \
                            ya no sirve para nada." );
                
                toret = "";
                
                objSnakes.moveTo( ctrl.places.limbo );
                objLightBulb.moveTo( ctrl.places.limbo );
                objFlareGun.moveTo( ctrl.places.limbo );
                ctrl.places.doDesc();
            } else {
                player.say( "¿Será suficiente? \
                            ¡No hay seguna oportunidad!" );
                toret = "Disparar una bengala causará \
                        una llamarada, seguro, pero...";
            }
        }
    } else {
        player.say( "¡Necesitaría empuñarla!" );
        toret = "No la tienes en la mano.";
    }
        
    
    return toret;
};


// --------------------------------------------- Lighthouse's yard --
const locLighthouseYard = ctrl.places.creaLoc(
    "Patio del faro",
    [ "patio", "faro" ],
    "La jungla se abre por delante de ti en una \
     especie de claro del que parte un camino que baja al ${este, e}.\
     Una ${puerta, oeste} permite volver al faro."
);
locLighthouseYard.pic = "res/lighthouse_yard.jpg";
locLighthouseYard.setExitBi( "oeste", locLighthouseBasement );
locLighthouseYard.getExitsDesc = function() {
    return "La selva desciende hacia el ${este, este}, \
            o se puede volver al faro por \
            una puerta al ${oeste, oeste}.";
};

locLighthouseYard.preExamine = function() {
    var player = ctrl.personas.getPlayer();
    var toret = this.desc;
    
    if ( this.has( objSnakes ) ) {
        toret += " Es... ¡impresionante! \
                  Un montón de ${serpientes, ex serpientes} \
                  se sitúan frente a la puerta del faro.";
        
        if ( player.has( objLightBulb ) ) {
            ctrl.print( "Con decisión, has tirado la bombilla \
                         entre las serpientes." );
            objLightBulb.moveTo( locLighthouseYard );
        }
        else
        if ( this.has( objLightBulb ) ) {
            ctrl.print( "La bombilla yace entre las serpientes." );
        }
    } else {
        toret += " Escuchas algún inquietante siseo \
                   por entre la espesura...";
    }
    
    return toret;
};

locLighthouseYard.preGo = function() {
    const goAction = actions.getAction( "go" );
    var toret = "Las serpientes reaccionan avanzando hacia ti... \
                 ¡No se puede pasar!";
    
    if ( parser.sentence.term1 == "este" ) {
            if ( !this.has( objSnakes ) ) {
                toret = goAction.exe( parser.sentence );
            } else {
                ctrl.personas.getPlayer().say( "¡Es asqueroso!\
                                                Y peligroso..." );
            }
    } else {
        toret = goAction.exe( parser.sentence );
    }
    
    return toret;
};

const objSnakes = ctrl.creaObj(
    "serpientes",
    [ "serpiente" ],
    "Una miríada de serpientes se enroscan unas sobre otras... \
    Sisean amenazantes, e impiden el paso.",
    locLighthouseYard,
    Ent.Scenery
);


// -------------------------------------------- Staircase in forest--
const locForestStaircase = ctrl.places.creaLoc(
    "Descenso por la jungla",
    [ "descenso" ],
    "\
     Unas ${escaleras, ex escaleras} escalan la pendiente de \
     ${arriba, oeste} a ${abajo, este}, donde se ve un muelle."
);
locForestStaircase.pic = "res/forest_staircase.jpg";
locForestStaircase.setExitBi( "oeste", locLighthouseYard );
locForestStaircase.getExitsDesc = function() {
    return "Puedes ${subir, oeste}, o ${bajar, este}.";
};

const objStairs = ctrl.creaObj(
    "escaleras",
    [ "escalera" ],
    "Un impresionante trabajo hace que se pueda \
     ${subir, o} o ${bajar, e} \
     la escalera mediante una serie de escalones empotrados en \
     la propia montaña.",
    locForestStaircase,
    Ent.Scenery
);


// ----------------------------------------------------------- Dock--
const locDock = ctrl.places.creaLoc(
    "Muelle",
    [],
    "\
     El único camino parte al ${oeste, oeste}. \
     También se puede entrar en un ${bote, ex bote}."
);
locDock.pic = "res/dock.jpg";
locDock.setExitBi( "oeste", locForestStaircase );
locDock.getExitsDesc = function() {
    return "Solo se puede volver a la selva al ${oeste, oeste}.";
};

function amusing() {
    return "La <a target='_blank' href='https://es.wikipedia.org/wiki/Isla_da_Queimada_Grande'>Ilha Queimada</a> \
            es una isla situada a unos 30km de la costa de Brasil. \
            Se trata de una zona protegida, y por lo tanto \
            no se puede visitar más allá \
            de expediciones científicas autorizadas. \
            Es el hogar de una especie de serpiente endémica \
            en peligro de extinción, y cuenta la leyenda que \
            las serpientes mataron a la familia del farero. \
            Eso sí, allí no hay ni nunca ha habido un presidio.";
}

var htmlRestartEnding = "<p align='right'>\
                         <a href='javascript: location.reload();'>\
                         <i>Comenzar de nuevo</i></a>.<br/>\
                         <details><summary>Ver curiosidades.\
                         </summary>\
                         <p align='right'>"
                         + amusing() + "</p></details></p>";

locDock.preExit = function() {
    var dvCmds = ctrl.getHtmlPart( "dvCmds" );
    dvCmds.style.display = "none";
    
    if ( ctrl.isPresent( objMobilePhone ) ) {
        ctrl.achievements.achieved( "sos" );
    }
    
    ctrl.achievements.achieved( "escapista" );
    
    ctrl.endGame(
        "Empiezas a remar. Sabes que yendo hacia el oeste \
         deberías encontrar tierra pronto. \
         ¡No puedes creerte el haberlo conseguido!"
         + htmlRestartEnding
         + "<p>Logros:<br/>" + ctrl.logros.completedAsText() + "</p>",
        "res/queimada_island.jpg"        
    );
    
    return "";
};

const objBoat = ctrl.creaObj(
    "bote",
    [ "" ],
    "Un pequeño bote. Lo compruebas, y... tiene remos. \
     Está preparado para ${partir, sal}...",
    locDock,
    Ent.Scenery
);


// Achievements =====================================================
ctrl.achievements.add( "escapista",
                       "Escapista (saliste de la isla)." );
ctrl.achievements.add( "iluminado",
                       "Iluminado (conseguiste la bombilla)." );
ctrl.achievements.add( "vampiros",
                       "Vampiros (encontraste la picadura doble)." );
ctrl.achievements.add( "sos",
                       "SOS (pudiste comunicarte desde el bote)." );


// Player & booting =================================================
const pc = ctrl.personas.creaPersona(
    "Enrique",
    [ "jugador", "enrique" ],
    "Hecho una piltrafa después de \
     sobrevivir al naufragio de tu yate.",
    locBeach
);

const objCompass = ctrl.creaObj(
    "brújula",
    [ "brujula" ],
    "",
    pc,
    Ent.Portable
);

objCompass.preExamine = function() {
    return ctrl.places.getCurrentLoc().getExitsDesc();
};

ctrl.personas.changePlayer( pc );
ctrl.places.setStart( locBeach );
