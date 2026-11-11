import type { Messages } from "./en";

export const es: Messages = {
	// shared
	"common.cancel": "Cancelar",
	"common.continue": "Continuar",
	"common.done": "Listo",

	// tabs
	"tab.files": "Archivos",
	"tab.storage": "Almacenamiento",

	// files
	"files.search": "Buscar en esta carpeta",
	"files.searching": "Buscando…",
	"files.found": "{n} encontrados",
	"files.foundMore":
		"Se muestran los primeros {n}. Prueba con una búsqueda más concreta.",
	"files.noMatch": "No se ha encontrado nada.",
	"files.empty": "Esta carpeta está vacía.",
	"files.loading": "Cargando…",
	"files.unreadable": "No se puede leer esta carpeta.",
	"files.accessBanner":
		"Para explorar tu almacenamiento, la app necesita «Acceso a todos los archivos». Toca para permitirlo.",
	"files.accessHint":
		"¿Faltan archivos? Comprueba que «Acceso a todos los archivos» esté permitido para esta app.",
	"files.accessButton": "Permitir acceso",
	"files.up": "Subir un nivel",
	"files.clearSearch": "Borrar búsqueda",
	"files.folder": "Carpeta",
	"files.openFailedTitle": "No se pudo abrir el archivo",
	"files.noApp":
		"Ninguna app de este teléfono puede abrir este tipo de archivo.",
	"files.openError": "Algo salió mal al abrirlo.",

	// quick places
	"place.internal": "Almacenamiento interno",
	"place.sd": "Tarjeta SD",
	"place.downloads": "Descargas",
	"place.camera": "Cámara",
	"place.documents": "Documentos",
	"place.pictures": "Imágenes",
	"place.music": "Música",
	"place.movies": "Películas",

	// storage
	"storage.device": "Almacenamiento del dispositivo",
	"storage.usedOf": "{used} usados de {total}",
	"storage.free": "{free} libres",
	"storage.unavailable": "No se pudieron leer los datos de almacenamiento.",
	"storage.analyze": "Analizar",
	"storage.analyzeHint":
		"Analiza tus archivos para ver qué ocupa espacio. Puede tardar un rato en un teléfono lleno.",
	"storage.again": "Analizar de nuevo",
	"storage.stop": "Detener",
	"storage.scanning": "Analizando… {files} archivos · {size}",
	"storage.stopped": "Análisis detenido, así que estas cifras son parciales.",
	"storage.scanned": "{files} archivos · {size}",
	"storage.byType": "Por tipo",
	"storage.byFolder": "Carpetas más grandes",
	"storage.rootFiles": "Archivos sueltos",
	"storage.skipped": "Algunas carpetas no se pudieron leer y se omitieron.",
	"storage.note":
		"Solo se cuenta lo que esta app puede leer, así que las cifras pueden diferir de las del sistema.",
	"kind.image": "Imágenes",
	"kind.video": "Vídeos",
	"kind.audio": "Audio",
	"kind.document": "Documentos",
	"kind.archive": "Archivos comprimidos",
	"kind.apk": "Apps",
	"kind.other": "Otros",

	// settings
	"settings.title": "Ajustes",
	"settings.language": "Idioma",
	"settings.languageHint":
		"«Predeterminado del sistema» sigue el idioma de tu teléfono, y usa inglés si tu idioma no está disponible.",
	"settings.languageSystem": "Predeterminado del sistema",
	"settings.files": "Archivos",
	"settings.showHidden": "Mostrar archivos ocultos",
	"settings.showHiddenHint": "Archivos y carpetas cuyo nombre empieza por un punto.",
	"settings.haptics": "Vibración",
	"settings.hapticsToggle": "Respuesta háptica",
	"settings.hapticsHint": "Vibraciones cortas al tocar botones.",
	"settings.hapticsTriggers": "Elige qué vibra",
	"settings.hapticsStrength": "Intensidad de la vibración",
	"settings.hapticsStrengthHint":
		"Desliza hacia la derecha para una vibración más intensa.",
	"haptics.done": "Botón Listo",
	"haptics.settings": "Botón de ajustes",
	"haptics.tab": "Cambiar de pestaña",
	"haptics.folder": "Abrir una carpeta",
	"haptics.up": "Subir una carpeta",
	"haptics.file": "Abrir un archivo",
	"haptics.place": "Accesos rápidos (Descargas, Cámara…)",
	"haptics.refresh": "Tirar para actualizar",
	"haptics.scan": "Botones de análisis (Almacenamiento)",
	"haptics.action": "Otros botones",
	"haptics.error": "Errores",
	"settings.theme": "Tema",
	"settings.presets": "Preajustes",
	"role.background": "Fondo",
	"role.card": "Tarjetas",
	"role.text": "Texto",
	"role.accent": "Contraste / acento",
	"color.custom": "Color personalizado",
	"color.hue": "Tono",
	"color.saturation": "Saturación",
	"color.lightness": "Luminosidad",
	"color.hex": "Código hex",
	"color.apply": "Aplicar",
	"settings.themeTransfer": "Compartir temas",
	"settings.exportTheme": "Exportar tema",
	"settings.importTheme": "Importar tema",
	"settings.importHint":
		"Pega un tema exportado desde esta app o desde cualquier app que use los mismos nombres de color: background, card, text y accent.",
	"settings.importInvalid":
		"Ese no es un tema válido. Necesita background, card, text y accent, cada uno como un color #RRGGBB.",
	"settings.importButton": "Importar",
	"preset.navy": "Marino",
	"preset.midnight": "Medianoche",
	"preset.paper": "Papel",
	"preset.forest": "Bosque",
	"preset.grape": "Uva",
	"settings.reset": "Restablecer",
	"settings.resetHint":
		"Devuelve el idioma, los archivos ocultos, la vibración y los colores a sus valores predeterminados. Tus archivos nunca se tocan.",
	"settings.resetButton": "Restablecer ajustes",
	"settings.resetTitle": "¿Restablecer ajustes?",
	"settings.resetBody":
		"El idioma, los archivos ocultos, la vibración y los colores vuelven a sus valores predeterminados.",

	// about
	"credits.about": "Acerca de",
	"about.tagline": "Explora, busca y descubre qué ocupa tu espacio.",
	"credits.madeBy": "Hecho por {developer}.",
	"credits.icons": "{ionicons} de {ionic}.",
	"credits.kofi": "Si algún día te apetece, ¡tengo Ko-fi!",
};
