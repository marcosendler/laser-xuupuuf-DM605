# Interface web da gravadora laser xuupuuf DM605
# Uso: make [build|testar|enviar|verificar]   (IP da placa: make enviar PLACA=10.128.1.112)

PLACA ?= 10.128.1.112
FONTE := nova-interface/fonte
ORIGINAL := interface-original/index.html
SAIDA := nova-interface
FONTES := $(FONTE)/patch.js $(FONTE)/laser_addon.js $(FONTE)/laser_ui.js $(FONTE)/laser_config.js $(FONTE)/laser_theme.css

.PHONY: build testar enviar verificar ajuda

build: $(SAIDA)/index.html.gz

# Regera so quando algum arquivo da fonte ou o original mudar
$(SAIDA)/index.html.gz: $(ORIGINAL) $(FONTES)
	node $(FONTE)/patch.js $(ORIGINAL) $(SAIDA)

# Abre a interface nova em http://localhost:8080 usando a placa de verdade
testar: build
	node $(FONTE)/testar.js

# Grava a interface na memoria (SPIFFS) da placa, como o botao de upload da propria interface
enviar: build
	curl -f -F "path=/" -F "myfile[]=@$(SAIDA)/index.html.gz;filename=/index.html.gz" http://$(PLACA)/files
	@echo && echo "Enviado. Recarregue http://$(PLACA)/ no navegador."

# Confere se o HTML gerado nao depende de arquivos externos
verificar: build
	@! grep -qE "<script src=|laser_[a-z]+\.(js|css)\"" $(SAIDA)/index.html && echo "OK: tudo embutido no index.html"

ajuda:
	@echo "make build      gera nova-interface/index.html e .gz"
	@echo "make testar     servidor local em http://localhost:8080"
	@echo "make enviar     envia o .gz para a placa (PLACA=$(PLACA))"
	@echo "make verificar  confere que nao ha arquivos externos"
