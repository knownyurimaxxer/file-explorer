import type { Messages } from "./en";

export const pt: Messages = {
	// shared
	"common.cancel": "Cancelar",
	"common.continue": "Continuar",
	"common.done": "Concluído",

	// tabs
	"tab.files": "Ficheiros",
	"tab.storage": "Armazenamento",

	// files
	"files.search": "Pesquisar nesta pasta",
	"files.searching": "A pesquisar…",
	"files.found": "{n} encontrados",
	"files.foundMore":
		"A mostrar os primeiros {n}. Tenta uma pesquisa mais específica.",
	"files.noMatch": "Não foi encontrado nada.",
	"files.empty": "Esta pasta está vazia.",
	"files.loading": "A carregar…",
	"files.unreadable": "Não é possível ler esta pasta.",
	"files.accessBanner":
		"Para explorar o teu armazenamento, a app precisa de «Acesso a todos os ficheiros». Toca para permitir.",
	"files.accessHint":
		"Faltam ficheiros? Verifica se «Acesso a todos os ficheiros» está permitido para esta app.",
	"files.accessButton": "Permitir acesso",
	"files.up": "Subir um nível",
	"files.clearSearch": "Limpar pesquisa",
	"files.folder": "Pasta",
	"files.openFailedTitle": "Não foi possível abrir o ficheiro",
	"files.noApp":
		"Nenhuma app deste telemóvel consegue abrir este tipo de ficheiro.",
	"files.openError": "Algo correu mal ao abri-lo.",

	// quick places
	"place.internal": "Armazenamento interno",
	"place.sd": "Cartão SD",
	"place.downloads": "Transferências",
	"place.camera": "Câmara",
	"place.documents": "Documentos",
	"place.pictures": "Imagens",
	"place.music": "Música",
	"place.movies": "Filmes",

	// storage
	"storage.device": "Armazenamento do dispositivo",
	"storage.usedOf": "{used} usados de {total}",
	"storage.free": "{free} livres",
	"storage.unavailable": "Não foi possível ler os dados de armazenamento.",
	"storage.analyze": "Analisar",
	"storage.analyzeHint":
		"Analisa os teus ficheiros para veres o que ocupa espaço. Pode demorar um pouco num telemóvel cheio.",
	"storage.again": "Analisar novamente",
	"storage.stop": "Parar",
	"storage.scanning": "A analisar… {files} ficheiros · {size}",
	"storage.stopped":
		"Análise interrompida, por isso estes valores são parciais.",
	"storage.scanned": "{files} ficheiros · {size}",
	"storage.byType": "Por tipo",
	"storage.byFolder": "Pastas maiores",
	"storage.rootFiles": "Ficheiros soltos",
	"storage.skipped":
		"Algumas pastas não puderam ser lidas e foram ignoradas.",
	"storage.note":
		"Só é contado o que esta app tem permissão para ler, por isso os valores podem diferir dos do sistema.",
	"kind.image": "Imagens",
	"kind.video": "Vídeos",
	"kind.audio": "Áudio",
	"kind.document": "Documentos",
	"kind.archive": "Arquivos comprimidos",
	"kind.apk": "Apps",
	"kind.other": "Outros",

	// settings
	"settings.title": "Definições",
	"settings.language": "Idioma",
	"settings.languageHint":
		"“Predefinição do sistema” segue o idioma do teu telemóvel e usa inglês se o teu idioma não estiver disponível.",
	"settings.languageSystem": "Predefinição do sistema",
	"settings.files": "Ficheiros",
	"settings.showHidden": "Mostrar ficheiros ocultos",
	"settings.showHiddenHint": "Ficheiros e pastas cujo nome começa com um ponto.",
	"settings.haptics": "Vibração",
	"settings.hapticsToggle": "Resposta háptica",
	"settings.hapticsHint": "Vibrações curtas ao tocar em botões.",
	"settings.hapticsTriggers": "Escolhe o que vibra",
	"settings.hapticsStrength": "Intensidade da vibração",
	"settings.hapticsStrengthHint":
		"Deslize para a direita para uma vibração mais intensa.",
	"haptics.done": "Botão Concluído",
	"haptics.settings": "Botão de definições",
	"haptics.tab": "Mudar de separador",
	"haptics.folder": "Abrir uma pasta",
	"haptics.up": "Subir uma pasta",
	"haptics.file": "Abrir um ficheiro",
	"haptics.place": "Acessos rápidos (Transferências, Câmara…)",
	"haptics.refresh": "Puxar para atualizar",
	"haptics.scan": "Botões de análise (Armazenamento)",
	"haptics.action": "Outros botões",
	"haptics.error": "Erros",
	"settings.theme": "Tema",
	"settings.presets": "Predefinições",
	"role.background": "Fundo",
	"role.card": "Cartões",
	"role.text": "Texto",
	"role.accent": "Contraste / destaque",
	"color.custom": "Cor personalizada",
	"color.hue": "Matiz",
	"color.saturation": "Saturação",
	"color.lightness": "Luminosidade",
	"color.hex": "Código hex",
	"color.apply": "Aplicar",
	"settings.themeTransfer": "Compartilhar temas",
	"settings.exportTheme": "Exportar tema",
	"settings.importTheme": "Importar tema",
	"settings.importHint":
		"Cole um tema exportado deste app ou de qualquer app que use os mesmos nomes de cor: background, card, text e accent.",
	"settings.importInvalid":
		"Esse não é um tema válido. Ele precisa de background, card, text e accent, cada um como uma cor #RRGGBB.",
	"settings.importButton": "Importar",
	"preset.navy": "Marinho",
	"preset.midnight": "Meia-noite",
	"preset.paper": "Papel",
	"preset.forest": "Floresta",
	"preset.grape": "Uva",
	"settings.reset": "Repor",
	"settings.resetHint":
		"Repõe o idioma, os ficheiros ocultos, a vibração e as cores nos valores predefinidos. Os teus ficheiros nunca são tocados.",
	"settings.resetButton": "Repor definições",
	"settings.resetTitle": "Repor definições?",
	"settings.resetBody":
		"O idioma, os ficheiros ocultos, a vibração e as cores voltam aos valores predefinidos.",

	// about
	"credits.about": "Sobre",
	"about.tagline": "Explora, pesquisa e descobre o que ocupa o teu espaço.",
	"credits.madeBy": "Feito por {developer}.",
	"credits.icons": "{ionicons} de {ionic}.",
	"credits.kofi": "Se um dia te apetecer, tenho um Ko-fi!",
};
