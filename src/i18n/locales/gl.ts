import type { Messages } from "./en";

export const gl: Messages = {
	// shared
	"common.cancel": "Cancelar",
	"common.continue": "Continuar",
	"common.done": "Feito",

	// tabs
	"tab.files": "Ficheiros",
	"tab.storage": "Almacenamento",

	// files
	"files.search": "Buscar neste cartafol",
	"files.searching": "Buscando…",
	"files.found": "{n} atopados",
	"files.foundMore":
		"Móstranse os primeiros {n}. Proba cunha busca máis concreta.",
	"files.noMatch": "Non se atopou nada.",
	"files.empty": "Este cartafol está baleiro.",
	"files.loading": "Cargando…",
	"files.unreadable": "Non se pode ler este cartafol.",
	"files.accessBanner":
		"Para explorar o teu almacenamento, a app precisa «Acceso a todos os ficheiros». Toca para permitilo.",
	"files.accessHint":
		"Fáltanche ficheiros? Comproba que «Acceso a todos os ficheiros» estea permitido para esta app.",
	"files.accessButton": "Permitir acceso",
	"files.up": "Subir un nivel",
	"files.clearSearch": "Borrar a busca",
	"files.folder": "Cartafol",
	"files.openFailedTitle": "Non se puido abrir o ficheiro",
	"files.noApp":
		"Ningunha app deste teléfono pode abrir este tipo de ficheiro.",
	"files.openError": "Algo saíu mal ao abrilo.",

	// quick places
	"place.internal": "Almacenamento interno",
	"place.sd": "Tarxeta SD",
	"place.downloads": "Descargas",
	"place.camera": "Cámara",
	"place.documents": "Documentos",
	"place.pictures": "Imaxes",
	"place.music": "Música",
	"place.movies": "Películas",

	// storage
	"storage.device": "Almacenamento do dispositivo",
	"storage.usedOf": "{used} usados de {total}",
	"storage.free": "{free} libres",
	"storage.unavailable": "Non se puideron ler os datos de almacenamento.",
	"storage.analyze": "Analizar",
	"storage.analyzeHint":
		"Analiza os teus ficheiros para ver que ocupa espazo. Pode tardar un chisco nun teléfono cheo.",
	"storage.again": "Analizar de novo",
	"storage.stop": "Parar",
	"storage.scanning": "Analizando… {files} ficheiros · {size}",
	"storage.stopped": "Análise detida, así que estas cifras son parciais.",
	"storage.scanned": "{files} ficheiros · {size}",
	"storage.byType": "Por tipo",
	"storage.byFolder": "Cartafoles máis grandes",
	"storage.rootFiles": "Ficheiros soltos",
	"storage.skipped": "Algúns cartafoles non se puideron ler e omitíronse.",
	"storage.note":
		"Só se conta o que esta app pode ler, así que as cifras poden diferir das do sistema.",
	"kind.image": "Imaxes",
	"kind.video": "Vídeos",
	"kind.audio": "Audio",
	"kind.document": "Documentos",
	"kind.archive": "Ficheiros comprimidos",
	"kind.apk": "Apps",
	"kind.other": "Outros",

	// settings
	"settings.title": "Axustes",
	"settings.language": "Idioma",
	"settings.languageHint":
		"“Predeterminado do sistema” segue o idioma do teu teléfono e usa inglés se o teu idioma non está dispoñible.",
	"settings.languageSystem": "Predeterminado do sistema",
	"settings.sound": "Son",
	"settings.soundToggle": "Efectos de son",
	"settings.soundHint": "Sons curtos ao tocar botóns.",
	"settings.haptics": "Vibración",
	"settings.hapticsToggle": "Resposta táctil",
	"settings.hapticsHint": "Vibracións curtas ao tocar botóns.",
	"settings.hapticsTriggers": "Elixe que vibra",
	"settings.hapticsStrength": "Intensidade da vibración",
	"settings.hapticsStrengthHint":
		"Desliza cara á dereita para unha vibración máis intensa.",
	"haptics.done": "Botón Feito",
	"haptics.settings": "Botón de axustes",
	"haptics.tab": "Cambiar de lapela",
	"haptics.folder": "Abrir un cartafol",
	"haptics.up": "Subir un cartafol",
	"haptics.file": "Abrir un ficheiro",
	"haptics.place": "Accesos rápidos (Descargas, Cámara…)",
	"haptics.refresh": "Tirar para actualizar",
	"haptics.scan": "Botóns de análise (Almacenamento)",
	"haptics.action": "Outros botóns",
	"haptics.error": "Erros",
	"settings.theme": "Tema",
	"settings.presets": "Predefinidos",
	"role.background": "Fondo",
	"role.card": "Tarxetas",
	"role.text": "Texto",
	"role.accent": "Contraste / acento",
	"color.custom": "Cor personalizada",
	"color.hue": "Ton",
	"color.saturation": "Saturación",
	"color.lightness": "Luminosidade",
	"color.hex": "Código hex",
	"color.apply": "Aplicar",
	"settings.themeTransfer": "Compartir temas",
	"settings.exportTheme": "Exportar tema",
	"settings.importTheme": "Importar tema",
	"settings.importHint":
		"Pega un tema exportado desde esta app ou desde calquera app que use os mesmos nomes de cor: background, card, text e accent.",
	"settings.importInvalid":
		"Ese non é un tema válido. Precisa background, card, text e accent, cada un como unha cor #RRGGBB.",
	"settings.importButton": "Importar",
	"preset.navy": "Mariño",
	"preset.midnight": "Medianoite",
	"preset.paper": "Papel",
	"preset.forest": "Bosque",
	"preset.grape": "Uva",
	"settings.reset": "Restablecer",
	"settings.resetHint":
		"Devolve o idioma, o son, a vibración e as cores aos seus valores predeterminados. Os teus ficheiros nunca se tocan.",
	"settings.resetButton": "Restablecer axustes",
	"settings.resetTitle": "Restablecer os axustes?",
	"settings.resetBody":
		"O idioma, o son, a vibración e as cores volven aos seus valores predeterminados.",

	// about
	"credits.about": "Acerca de",
	"about.tagline": "Explora, busca e descubre que ocupa o teu espazo.",
	"credits.madeBy": "Feito por {developer}.",
	"credits.icons": "{ionicons} de {ionic}.",
	"credits.kofi": "Se algún día che apetece, teño un Ko-fi!",
};
