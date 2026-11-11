import type { Messages } from "./en";

export const ca: Messages = {
	// shared
	"common.cancel": "Cancel·la",
	"common.continue": "Continua",
	"common.done": "Fet",

	// tabs
	"tab.files": "Fitxers",
	"tab.storage": "Emmagatzematge",

	// files
	"files.search": "Cerca en aquesta carpeta",
	"files.searching": "Cercant…",
	"files.found": "{n} trobats",
	"files.foundMore":
		"Es mostren els primers {n}. Prova una cerca més concreta.",
	"files.noMatch": "No s'ha trobat res.",
	"files.empty": "Aquesta carpeta és buida.",
	"files.loading": "Carregant…",
	"files.unreadable": "No es pot llegir aquesta carpeta.",
	"files.accessBanner":
		"Per explorar el teu emmagatzematge, l'app necessita «Accés a tots els fitxers». Toca per permetre-ho.",
	"files.accessHint":
		"Et falten fitxers? Comprova que «Accés a tots els fitxers» estigui permès per a aquesta app.",
	"files.accessButton": "Permet l'accés",
	"files.up": "Puja un nivell",
	"files.clearSearch": "Esborra la cerca",
	"files.folder": "Carpeta",
	"files.openFailedTitle": "No s'ha pogut obrir el fitxer",
	"files.noApp": "Cap app d'aquest telèfon pot obrir aquest tipus de fitxer.",
	"files.openError": "Alguna cosa ha anat malament en obrir-lo.",

	// quick places
	"place.internal": "Emmagatzematge intern",
	"place.sd": "Targeta SD",
	"place.downloads": "Baixades",
	"place.camera": "Càmera",
	"place.documents": "Documents",
	"place.pictures": "Imatges",
	"place.music": "Música",
	"place.movies": "Pel·lícules",

	// storage
	"storage.device": "Emmagatzematge del dispositiu",
	"storage.usedOf": "{used} utilitzats de {total}",
	"storage.free": "{free} lliures",
	"storage.unavailable": "No s'han pogut llegir les dades d'emmagatzematge.",
	"storage.analyze": "Analitza",
	"storage.analyzeHint":
		"Analitza els teus fitxers per veure què ocupa espai. Pot trigar una estona en un telèfon ple.",
	"storage.again": "Analitza de nou",
	"storage.stop": "Atura",
	"storage.scanning": "Analitzant… {files} fitxers · {size}",
	"storage.stopped":
		"Anàlisi aturada, així que aquestes xifres són parcials.",
	"storage.scanned": "{files} fitxers · {size}",
	"storage.byType": "Per tipus",
	"storage.byFolder": "Carpetes més grans",
	"storage.rootFiles": "Fitxers solts",
	"storage.skipped": "Algunes carpetes no s'han pogut llegir i s'han omès.",
	"storage.note":
		"Només es compta el que aquesta app pot llegir, així que les xifres poden diferir de les del sistema.",
	"kind.image": "Imatges",
	"kind.video": "Vídeos",
	"kind.audio": "Àudio",
	"kind.document": "Documents",
	"kind.archive": "Fitxers comprimits",
	"kind.apk": "Apps",
	"kind.other": "Altres",

	// settings
	"settings.title": "Ajustos",
	"settings.language": "Idioma",
	"settings.languageHint":
		"«Predeterminat del sistema» segueix l'idioma del teu telèfon, i fa servir l'anglès si el teu idioma no està disponible.",
	"settings.languageSystem": "Predeterminat del sistema",
	"settings.sound": "So",
	"settings.soundToggle": "Efectes de so",
	"settings.soundHint": "Sons curts en tocar botons.",
	"settings.haptics": "Vibració",
	"settings.hapticsToggle": "Resposta tàctil",
	"settings.hapticsHint": "Vibracions curtes en tocar botons.",
	"settings.hapticsTriggers": "Tria què vibra",
	"settings.hapticsStrength": "Intensitat de la vibració",
	"settings.hapticsStrengthHint":
		"Llisca cap a la dreta per a una vibració més intensa.",
	"haptics.done": "Botó Fet",
	"haptics.settings": "Botó d'ajustes",
	"haptics.tab": "Canviar de pestanya",
	"haptics.folder": "Obrir una carpeta",
	"haptics.up": "Pujar una carpeta",
	"haptics.file": "Obrir un fitxer",
	"haptics.place": "Accessos ràpids (Baixades, Càmera…)",
	"haptics.refresh": "Estirar per actualitzar",
	"haptics.scan": "Botons d'anàlisi (Emmagatzematge)",
	"haptics.action": "Altres botons",
	"haptics.error": "Errors",
	"settings.theme": "Tema",
	"settings.presets": "Predefinits",
	"role.background": "Fons",
	"role.card": "Targetes",
	"role.text": "Text",
	"role.accent": "Contrast / accent",
	"color.custom": "Color personalitzat",
	"color.hue": "To",
	"color.saturation": "Saturació",
	"color.lightness": "Lluminositat",
	"color.hex": "Codi hex",
	"color.apply": "Aplica",
	"settings.themeTransfer": "Compartir temes",
	"settings.exportTheme": "Exportar tema",
	"settings.importTheme": "Importar tema",
	"settings.importHint":
		"Enganxa un tema exportat des d'aquesta app o des de qualsevol app que faci servir els mateixos noms de color: background, card, text i accent.",
	"settings.importInvalid":
		"Aquest no és un tema vàlid. Necessita background, card, text i accent, cadascun com a color #RRGGBB.",
	"settings.importButton": "Importa",
	"preset.navy": "Marí",
	"preset.midnight": "Mitjanit",
	"preset.paper": "Paper",
	"preset.forest": "Bosc",
	"preset.grape": "Raïm",
	"settings.reset": "Restableix",
	"settings.resetHint":
		"Torna l'idioma, el so, la vibració i els colors als seus valors predeterminats. Els teus fitxers no es toquen mai.",
	"settings.resetButton": "Restableix els ajustos",
	"settings.resetTitle": "Vols restablir els ajustos?",
	"settings.resetBody":
		"L'idioma, el so, la vibració i els colors tornen als seus valors predeterminats.",

	// about
	"credits.about": "Quant a",
	"about.tagline": "Explora, cerca i descobreix què ocupa el teu espai.",
	"credits.madeBy": "Feta per {developer}.",
	"credits.icons": "{ionicons} de {ionic}.",
	"credits.kofi": "Si algun dia et ve de gust, tinc un Ko-fi!",
};
