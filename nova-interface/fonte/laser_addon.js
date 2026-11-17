/* Laser add-on: PT-BR, parada de emergencia, cronometro do trabalho */
(function(){var t={
"Control":"Controle","SD File":"Arquivos SD","Settings":"Configurações","Language":"Idioma","About":"Sobre",
"Speed(mm/s)":"Velocidade (mm/s)","Distance(mm)":"Distância (mm)","Home":"Origem","Position":"Posição",
"HomeXY":"Origem XY","HomeZ":"Origem Z","Open light":"Ligar luz","Close light":"Desligar luz",
"SPINDLE:":"Spindle:","Open Spindle":"Ligar spindle","Laser/Spindle:":"Laser:","OFF":"DESL.",
"Soft Home":"Ir para origem","Hard Home":"Home (fim de curso)","Position XY":"Zerar XY aqui","Position Z":"Zerar Z aqui",
"Unlock":"Desbloquear","Up...":"Subir...","File name":"Nome do arquivo","File size":"Tamanho","Uploading":"Enviando",
"Speed(%)":"Velocidade (%)","Power(%)":"Potência (%)","Unit":"Unidade","Parameter":"Parâmetro","Description":"Descrição",
"ESP3D Firmware Update":"Atualização de firmware ESP3D","A feedrate":"Velocidade A","B feedrate":"Velocidade B","C feedrate":"Velocidade C",
"TFT SD card":"Cartão SD do TFT","TFT USB disk":"Pendrive do TFT","File extensions (use ; to separate)":"Extensões de arquivo (separe com ;)",
"Finish":"Concluído","Connection error":"Erro de conexão","Error : ":"Erro: ","Value ":"Valor ","BT":"Bluetooth",
"Step port invert, mask":"Inverter porta de passo, máscara",
"Feedrate value must be at least 10 mm/s!":"A velocidade deve ser de pelo menos 10 mm/s!",
"Distance value must be at least 0.1 mm!":"A distância deve ser de pelo menos 0,1 mm!",
"Please set config $21 and $22 opened":"Ative as configurações $21 e $22 (fins de curso e homing) para usar o Home.",
"Warning":"Atenção","Please select NC or GCODE file.":"Selecione um arquivo NC ou GCODE.","Please select NCfile.":"Selecione um arquivo NC.",
"Please select file first":"Selecione um arquivo primeiro","No connection":"Sem conexão","Ready":"Pronto",
"Click Send button to view the frame":"Clique em Enviar para traçar o contorno com o laser em baixa potência",
"Download Error, please try again later":"Erro ao baixar, tente novamente mais tarde","Reading...":"Lendo...",
"File is reading, please wait a minute.":"Lendo o arquivo, aguarde um momento.",
"Status: Running":"Status: Gravando","Status: Hold":"Status: Pausado","Status: Alarm":"Status: Alarme","Status: IDLE":"Status: Pronto",
"Save preferences failed!":"Falha ao salvar as preferências!",
"Axis Feedrate value must be at least 1 mm/min!":"A velocidade do eixo deve ser de pelo menos 1 mm/min!",
"Only alphanumeric chars separated by ; for extensions filters":"Use apenas letras e números separados por ; nos filtros de extensão",
"Upload is ongoing, please wait and retry.":"Envio em andamento, aguarde e tente novamente.","WebUI version":"Versão da WebUI",
"Value must be between 0 degrees and 999 degrees !":"O valor deve estar entre 0 e 999 graus!",
"Connection lost for more than 20s":"Conexão perdida por mais de 20 s","Please confirm":"Confirme",
"STOP":"PARAR","Emergency stop":"Parada de emergência",
"Machine reset: laser and motion stopped. Click Unlock and re-home before continuing.":"Máquina reiniciada: laser e movimento parados. Clique em Desbloquear e refaça o Home antes de continuar.",
"Elapsed":"Decorrido","Remaining":"Restante","Job finished":"Trabalho concluído","Total time":"Tempo total",
"Hold:0":"Pausa concluída. Pronto para continuar.","Hold:1":"Pausando. Reiniciar agora vai gerar um alarme.",
"Door:0":"Porta fechada. Pronto para continuar.","Door:1":"Máquina parada. Porta aberta. Feche para continuar.",
"Door:2":"Porta aberta. Pausa em andamento. Reiniciar agora vai gerar um alarme.",
"Door:3":"Porta fechada, retomando. Reiniciar agora vai gerar um alarme.",
"ALARM:1":"Fim de curso acionado. A posição provavelmente foi perdida. Refaça o Home.",
"ALARM:2":"Limite por software. O destino do G-code ultrapassa a área da máquina. A posição foi mantida; pode desbloquear com segurança.",
"ALARM:3":"Reiniciada em movimento. A posição provavelmente foi perdida. Refaça o Home.",
"ALARM:4":"Falha na sonda. A sonda não estava no estado esperado antes do ciclo.",
"ALARM:5":"Falha na sonda. A sonda não tocou a peça dentro do curso programado.",
"ALARM:6":"Falha no Home. O ciclo de Home foi interrompido.",
"ALARM:7":"Falha no Home. A porta de segurança foi aberta durante o Home.",
"ALARM:8":"Falha no Home. O recuo não liberou o fim de curso. Aumente o recuo ou verifique a fiação.",
"ALARM:9":"Falha no Home. Fim de curso não encontrado. Aumente o curso máximo, reduza o recuo ou verifique a fiação.",
"error:1":"Palavra de G-code sem letra.","error:2":"Valor ausente ou numérico inválido no G-code.",
"error:3":"Comando '$' do Grbl não reconhecido.","error:4":"Valor negativo recebido onde se esperava positivo.",
"error:5":"Falha no Home: o Home não está ativado nas configurações.","error:6":"O pulso de passo mínimo deve ser maior que 3 µs.",
"error:7":"Falha ao ler a EEPROM. Valores padrão restaurados.","error:8":"Comando '$' só pode ser usado com o Grbl parado.",
"error:9":"Comandos G-code bloqueados durante alarme ou jog.","error:10":"Limites por software exigem o Home ativado.",
"error:11":"Linha longa demais. O comando não foi executado.","error:12":"O valor configurado excede a taxa máxima de passos.",
"error:13":"Porta de segurança aberta.","error:14":"Linha excede o limite da EEPROM. Não foi salva.",
"error:15":"O jog ultrapassa a área da máquina e foi ignorado.","error:16":"Comando de jog sem '=' ou com G-code proibido.",
"error:17":"O modo laser exige saída PWM.","error:20":"Comando G-code não suportado ou inválido.",
"error:21":"Mais de um comando do mesmo grupo modal na linha.","error:22":"Velocidade (F) não definida.",
"error:23":"O comando exige um valor inteiro.","error:24":"Mais de um comando que usa eixos na mesma linha.",
"error:25":"Palavra G-code repetida na linha.","error:26":"Nenhum eixo informado para um comando que exige eixos.",
"error:27":"Número de linha inválido.","error:28":"Falta um valor obrigatório no comando.",
"error:29":"Sistemas de coordenadas G59.x não são suportados.","error:30":"G53 só é permitido com G0 e G1.",
"error:31":"Eixos informados sem comando que os use.","error:32":"Arcos G2/G3 exigem ao menos um eixo do plano.",
"error:33":"Destino do movimento inválido.","error:34":"Raio do arco inválido.",
"error:35":"Arcos G2/G3 exigem ao menos um deslocamento do plano.","error:36":"Valores sem uso na linha.",
"error:37":"Compensação de ferramenta G43.1 não atribuída ao eixo configurado.","error:38":"Número de ferramenta acima do máximo.",
"error:60":"Falha ao montar o cartão SD","error:61":"Falha ao abrir o arquivo do SD","error:62":"Falha ao abrir a pasta do SD",
"error:63":"Pasta do SD não encontrada","error:64":"Arquivo do SD vazio","error:70":"Falha ao iniciar o Bluetooth"
};for(var k in t)ptbrtrans[k]=t[k]})();

function laser_lang_btn_id(e){return"zh_CN"==e?"lanbtnzh":"en"==e?"lanbtnen":"lanbtnptbr"}

autoLanguage=function(){
    var e,t,a=get_localdata(LAN_KEY);
    "zh_CN"!=a&&"en"!=a&&"ptbr"!=a&&(a="ptbr");
    for(t=document.getElementsByClassName("lanbtn"),e=0;e<t.length;e++)"languagebtns"==t[e].parentNode.id&&(t[e].className=t[e].className.replace(" active",""));
    document.getElementById(laser_lang_btn_id(a)).className+=" active",translate_text(a),store_localdata(LAN_KEY,a)
};

function laser_emergency_stop(){
    var e=new XMLHttpRequest;
    e.open("GET","/command?commandText="+encodeURIComponent(String.fromCharCode(24))+"&PAGEID="+page_id,!0),e.send();
    alertdlg(translate_text_item("Emergency stop"),translate_text_item("Machine reset: laser and motion stopped. Click Unlock and re-home before continuing."))
}

var laser_job_start=0;

function laser_safe_beep(){try{beep(400,880)}catch(e){}}

function laser_fmt_time(e){
    var t=Math.max(0,Math.round(e)),a=Math.floor(t/3600),n=Math.floor(t%3600/60),r=t%60;
    return(a?a+":"+(n<10?"0":""):"")+n+":"+(r<10?"0":"")+r
}

var laser_orig_process_grbl_status=grbl_process_status;
grbl_process_status=function(e){
    laser_orig_process_grbl_status(e);
    var t=document.getElementById("laser_job_time"),a="RUNNING"==currentStatus||"HOLD"==currentStatus,n=e.split("|SD:");
    if(a&&!laser_job_start&&1<n.length&&(laser_job_start=Date.now()),laser_job_start){
        var r=(Date.now()-laser_job_start)/1e3;
        if(a){
            var o=parseFloat(1<n.length?n[1].split(",")[0]:"NaN"),i=translate_text_item("Elapsed")+" "+laser_fmt_time(r);
            1<=o&&o<100&&(i+=" &middot; "+translate_text_item("Remaining")+" ~"+laser_fmt_time(r*(100-o)/o)),t.innerHTML=i
        }else"IDLE"==currentStatus?(laser_job_start=0,t.innerHTML=translate_text_item("Job finished")+" &middot; "+translate_text_item("Total time")+" "+laser_fmt_time(r),laser_safe_beep(),alertdlg(translate_text_item("Job finished"),translate_text_item("Total time")+": "+laser_fmt_time(r))):"ALARM"==currentStatus&&(laser_job_start=0,t.innerHTML="")
    }
};

(function(){
    document.documentElement.lang="pt-BR";
    var e=document.getElementById("progress_div");
    e&&e.insertAdjacentHTML("afterend","<div id='laser_job_time' style='font-size:20px;color:#5c6673;margin-top:10px'></div>");
    var t=document.createElement("button");
    t.id="laser_estop_btn",t.type="button",t.onclick=laser_emergency_stop,t.innerHTML="<span translate>STOP</span>",
    t.style.cssText="position:fixed;right:24px;bottom:24px;z-index:40000;width:96px;height:96px;border-radius:50%;border:4px solid #fff;background:#d9262c;color:#fff;font-size:20px;font-weight:bold;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer",
    document.body.appendChild(t)
})();
