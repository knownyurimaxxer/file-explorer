import type { Messages } from "./en";

export const eu: Messages = {
	// shared
	"common.cancel": "Utzi",
	"common.continue": "Jarraitu",
	"common.done": "Eginda",

	// tabs
	"tab.files": "Fitxategiak",
	"tab.storage": "Biltegiratzea",

	// files
	"files.search": "Bilatu karpeta honetan",
	"files.searching": "Bilatzen…",
	"files.found": "{n} aurkitu dira",
	"files.foundMore":
		"Lehenengo {n} erakusten dira. Saiatu bilaketa zehatzago batekin.",
	"files.noMatch": "Ez da ezer aurkitu.",
	"files.empty": "Karpeta hau hutsik dago.",
	"files.loading": "Kargatzen…",
	"files.unreadable": "Ezin da karpeta hau irakurri.",
	"files.accessBanner":
		"Zure biltegiratzea arakatzeko, aplikazioak «Fitxategi guztietarako sarbidea» behar du. Ukitu baimentzeko.",
	"files.accessHint":
		"Fitxategiak falta dira? Egiaztatu «Fitxategi guztietarako sarbidea» baimenduta dagoela aplikazio honentzat.",
	"files.accessButton": "Baimendu sarbidea",
	"files.up": "Igo maila bat",
	"files.clearSearch": "Garbitu bilaketa",
	"files.folder": "Karpeta",
	"files.openFailedTitle": "Ezin izan da fitxategia ireki",
	"files.noApp":
		"Telefono honetako aplikazio batek ere ezin du fitxategi mota hau ireki.",
	"files.openError": "Zerbait gaizki atera da irekitzean.",

	// quick places
	"place.internal": "Barne biltegiratzea",
	"place.sd": "SD txartela",
	"place.downloads": "Deskargak",
	"place.camera": "Kamera",
	"place.documents": "Dokumentuak",
	"place.pictures": "Irudiak",
	"place.music": "Musika",
	"place.movies": "Filmak",

	// storage
	"storage.device": "Gailuaren biltegiratzea",
	"storage.usedOf": "{total}(e)tik {used} erabilita",
	"storage.free": "{free} libre",
	"storage.unavailable": "Ezin izan dira biltegiratzearen datuak irakurri.",
	"storage.analyze": "Aztertu",
	"storage.analyzeHint":
		"Aztertu zure fitxategiak zerk hartzen duen lekua ikusteko. Denbora pixka bat behar dezake telefonoa beteta badago.",
	"storage.again": "Aztertu berriro",
	"storage.stop": "Gelditu",
	"storage.scanning": "Aztertzen… {files} fitxategi · {size}",
	"storage.stopped":
		"Azterketa gelditu da, beraz zifra hauek partzialak dira.",
	"storage.scanned": "{files} fitxategi · {size}",
	"storage.byType": "Motaren arabera",
	"storage.byFolder": "Karpeta handienak",
	"storage.rootFiles": "Fitxategi solteak",
	"storage.skipped":
		"Karpeta batzuk ezin izan dira irakurri eta saltatu egin dira.",
	"storage.note":
		"Aplikazio honek irakur dezakeena soilik kontatzen da, beraz zifrak sistemarenekin ez datoz bat izan daitezke.",
	"kind.image": "Irudiak",
	"kind.video": "Bideoak",
	"kind.audio": "Audioa",
	"kind.document": "Dokumentuak",
	"kind.archive": "Fitxategi konprimituak",
	"kind.apk": "Aplikazioak",
	"kind.other": "Besteak",

	// settings
	"settings.title": "Ezarpenak",
	"settings.language": "Hizkuntza",
	"settings.languageHint":
		"“Sistemaren lehenetsia” zure telefonoaren hizkuntza jarraitzen du, eta ingelesa erabiltzen du zure hizkuntza erabilgarri ez badago.",
	"settings.languageSystem": "Sistemaren lehenetsia",
	"settings.sound": "Soinua",
	"settings.soundToggle": "Soinu-efektuak",
	"settings.soundHint": "Soinu laburrak botoiak sakatzean.",
	"settings.haptics": "Bibrazioa",
	"settings.hapticsToggle": "Ukipen-erantzuna",
	"settings.hapticsHint": "Bibrazio laburrak botoiak sakatzean.",
	"settings.hapticsTriggers": "Aukeratu zerk egiten duen bibrazioa",
	"settings.hapticsStrength": "Bibrazioaren indarra",
	"settings.hapticsStrengthHint":
		"Irristatu eskuinera bibrazio biziagoa lortzeko.",
	"haptics.done": "Eginda botoia",
	"haptics.settings": "Ezarpenen botoia",
	"haptics.tab": "Fitxa aldatzea",
	"haptics.folder": "Karpeta bat irekitzea",
	"haptics.up": "Karpeta bat igotzea",
	"haptics.file": "Fitxategi bat irekitzea",
	"haptics.place": "Sarbide azkarrak (Deskargak, Kamera…)",
	"haptics.refresh": "Tira eguneratzeko",
	"haptics.scan": "Azterketa-botoiak (Biltegiratzea)",
	"haptics.action": "Beste botoiak",
	"haptics.error": "Erroreak",
	"settings.theme": "Gaia",
	"settings.presets": "Aurrezarpenak",
	"role.background": "Atzeko planoa",
	"role.card": "Txartelak",
	"role.text": "Testua",
	"role.accent": "Kontrastea / azentua",
	"color.custom": "Kolore pertsonalizatua",
	"color.hue": "Tonua",
	"color.saturation": "Saturazioa",
	"color.lightness": "Argitasuna",
	"color.hex": "Hex kodea",
	"color.apply": "Aplikatu",
	"settings.themeTransfer": "Gaiak partekatu",
	"settings.exportTheme": "Esportatu gaia",
	"settings.importTheme": "Inportatu gaia",
	"settings.importHint":
		"Itsatsi aplikazio honetatik edo kolore-izen berdinak erabiltzen dituen edozein aplikaziotatik esportatutako gai bat: background, card, text eta accent.",
	"settings.importInvalid":
		"Hori ez da baliozko gai bat. background, card, text eta accent behar ditu, bakoitza #RRGGBB kolore gisa.",
	"settings.importButton": "Inportatu",
	"preset.navy": "Itsas urdina",
	"preset.midnight": "Gauerdia",
	"preset.paper": "Papera",
	"preset.forest": "Basoa",
	"preset.grape": "Mahatsa",
	"settings.reset": "Berrezarri",
	"settings.resetHint":
		"Hizkuntza, soinua, bibrazioa eta koloreak lehenetsitako balioetara itzultzen ditu. Zure fitxategiei ez zaie inoiz ukitzen.",
	"settings.resetButton": "Berrezarri ezarpenak",
	"settings.resetTitle": "Ezarpenak berrezarri?",
	"settings.resetBody":
		"Hizkuntza, soinua, bibrazioa eta koloreak lehenetsitako balioetara itzultzen dira.",

	// about
	"credits.about": "Honi buruz",
	"about.tagline": "Arakatu, bilatu eta ikusi zerk hartzen duen zure lekua.",
	"credits.madeBy": "{developer}(e)k egina.",
	"credits.icons": "{ionicons} ({ionic}).",
	"credits.kofi": "Noizbait gogoa baduzu, Ko-fi bat daukat!",
};
