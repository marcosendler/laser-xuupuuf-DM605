/* Aba Configuracoes: nomes certos dos parametros do fabricante, PT-BR e botao Gravar com confirmacao */

/* parametros proprios deste firmware (nomes vindos do $L da placa); $101/$102 NAO sao Y/Z aqui */
(function(){
var P={$28:"Laser PWM frequency",$40:"Firmware language",$41:"Beep",$42:"Probe enable",$43:"Flame sensor enable",$44:"Air assist enable",
$45:"Work mode select",$46:"UART baud rate",$47:"Enable UART1",$48:"Safety door enable",$50:"Wi-Fi mode",$60:"Accelerometer check count",
$61:"Accelerometer trigger value",$453:"Knife thickness",$101:"Y steps/mm (normal mode)",$102:"Y steps/mm (rotary mode)",
$103:"A-axis travel resolution",$104:"B-axis travel resolution",$105:"C-axis travel resolution"},
U={$28:"Hz",$40:"",$41:"boolean",$42:"boolean",$43:"boolean",$44:"boolean",$45:"",$46:"",$47:"boolean",$48:"boolean",$50:"",$60:"",$61:"",$453:"mm",$101:"steps/mm",$102:"steps/mm",$103:"steps/mm",$104:"steps/mm",$105:"steps/mm"},
D={$28:"PWM frequency of the laser output.",$40:"Language code used by the firmware.",$41:"Turns the buzzer on (1) or off (0).",
$42:"Enables the probe input.",$43:"Enables the flame sensor (stops the job if it detects fire).",$44:"Enables the air assist control.",
$45:"Vendor work mode selection (normal or rotary).",$46:"Serial port speed code.",$47:"Enables the second serial port.",
$48:"Enables the safety door / lid sensor.",$50:"Vendor Wi-Fi mode. Use the Wi-Fi tab to change the network.",
$60:"Accelerometer (LIS2DH): number of readings before the movement alarm.",$61:"Accelerometer (LIS2DH): sensitivity of the movement/tilt alarm.",
$453:"Thickness of the knife/tool.",$101:"Y-axis steps per millimeter in normal mode.",$102:"Y-axis steps per millimeter when using the rotary roller.",
$103:"A-axis travel resolution in steps per millimeter.",$104:"B-axis travel resolution in steps per millimeter.",$105:"C-axis travel resolution in steps per millimeter."};
for(var k in P)grbl_param[k]=P[k],grbl_unit[k]=U[k],grbl_desc[k]=D[k]
})();

(function(){var t={
"Set":"Gravar","Set failed":"Falha ao gravar","Label":"Código","Unit":"Unidade","Parameter":"Parâmetro","Description":"Descrição",
"Close":"Fechar","Cancel":"Cancelar","Abort":"Abortar","Clear":"Limpar","Send":"Enviar","Send Command...":"Enviar comando...",
"Select files":"Selecionar arquivos","Select file":"Selecionar arquivo","Update":"Atualizar","Update Firmware ?":"Atualizar firmware?",
"Upload":"Enviar","Uploading ":"Enviando ","Upload failed":"Falha no envio","Upload failed : ":"Falha no envio: ","Upload done":"Envio concluído",
"Enable":"Ativar","Disable":"Desativar","Check for Update":"Verificar atualização","Start setup":"Iniciar configuração",
"Save macro list failed!":"Falha ao salvar a lista de macros!","Scanning":"Procurando","Saved":"Gravado","Unchanged":"Sem alteração",
"microseconds":"microssegundos","milliseconds":"milissegundos","mask":"máscara","boolean":"0 / 1","steps/mm":"passos/mm","mm/min":"mm/min","mm/sec^2":"mm/s²","RPM":"S (potência)",
"Step pulse time":"Duração do pulso de passo","Step idle delay":"Atraso para desligar motores","Step pulse invert":"Inverter pulso de passo",
"Step direction invert":"Inverter direção","Invert step enable pin":"Inverter pino de habilitação","Invert limit pins":"Inverter fins de curso",
"Invert probe pin":"Inverter pino da sonda","Status report options":"Opções do relatório de status","Junction deviation":"Desvio de junção",
"Arc tolerance":"Tolerância de arco","Report in inches":"Relatório em polegadas","Soft limits enable":"Limites por software",
"Hard limits enable":"Fins de curso (limites físicos)","Homing cycle enable":"Ciclo de Home","Homing direction invert":"Inverter direção do Home",
"Homing locate feed rate":"Velocidade fina do Home","Homing search seek rate":"Velocidade de busca do Home","Homing switch debounce delay":"Atraso anti-ruído do fim de curso",
"Homing switch pull-off distance":"Recuo após o Home","Maximum spindle speed":"Potência máxima (S)","Minimum spindle speed":"Potência mínima (S)",
"Laser-mode enable":"Modo laser","X-axis travel resolution":"Passos/mm do eixo X","Y-axis travel resolution":"Passos/mm do eixo Y",
"Z-axis travel resolution":"Passos/mm do eixo Z","A-axis travel resolution":"Passos/mm do eixo A","B-axis travel resolution":"Passos/mm do eixo B",
"C-axis travel resolution":"Passos/mm do eixo C","X-axis maximum rate":"Velocidade máxima X","Y-axis maximum rate":"Velocidade máxima Y",
"Z-axis maximum rate":"Velocidade máxima Z","A-axis maximum rate":"Velocidade máxima A","B-axis maximum rate":"Velocidade máxima B","C-axis maximum rate":"Velocidade máxima C",
"X-axis acceleration":"Aceleração X","Y-axis acceleration":"Aceleração Y","Z-axis acceleration":"Aceleração Z","A-axis acceleration":"Aceleração A",
"B-axis acceleration":"Aceleração B","C-axis acceleration":"Aceleração C","X-axis maximum travel":"Curso máximo X","Y-axis maximum travel":"Curso máximo Y",
"Z-axis maximum travel":"Curso máximo Z","A-axis maximum travel":"Curso máximo A","B-axis maximum travel":"Curso máximo B","C-axis maximum travel":"Curso máximo C",
"Laser PWM frequency":"Frequência PWM do laser","Firmware language":"Idioma do firmware","Beep":"Bipe","Probe enable":"Sonda ativada",
"Flame sensor enable":"Sensor de chama","Air assist enable":"Air assist","Work mode select":"Modo de trabalho","UART baud rate":"Velocidade da serial",
"Enable UART1":"Ativar serial 2","Safety door enable":"Sensor da porta/tampa","Wi-Fi mode":"Modo Wi-Fi","Accelerometer check count":"Acelerômetro: leituras",
"Accelerometer trigger value":"Acelerômetro: sensibilidade","Knife thickness":"Espessura da lâmina",
"Y steps/mm (normal mode)":"Passos/mm Y (modo normal)","Y steps/mm (rotary mode)":"Passos/mm Y (modo rotativo)",
"Sets time length per step. Minimum 3usec.":"Duração de cada pulso de passo. Mínimo 3 µs.",
"Sets a short hold delay when stopping to let dynamics settle before disabling steppers. Value 255 keeps motors enabled with no delay.":"Tempo que os motores ficam travados depois de parar. 255 mantém os motores sempre ligados.",
"Inverts the step signal. Set axis bit to invert (00000ZYX).":"Inverte o sinal de passo. Bits por eixo (00000ZYX).",
"Inverts the direction signal. Set axis bit to invert (00000ZYX).":"Inverte o sentido dos eixos. Bits por eixo (00000ZYX): 1=X, 2=Y, 4=Z.",
"Inverts the stepper driver enable pin signal.":"Inverte o sinal de habilitação dos drivers.",
"Inverts the all of the limit input pins.":"Inverte todos os fins de curso.","Inverts the probe input pin signal.":"Inverte o sinal da sonda.",
"Alters data included in status reports.":"Define o que aparece nos relatórios de status.",
"Sets how fast Grbl travels through consecutive motions. Lower value slows it down.":"Velocidade nas curvas entre movimentos. Valor menor deixa mais lento e preciso.",
"Sets the G2 and G3 arc tracing accuracy based on radial error. Beware: A very small value may effect performance.":"Precisão dos arcos G2/G3. Valor muito pequeno pode deixar lento.",
"Enables inch units when returning any position and rate value that is not a settings value.":"Mostra posições e velocidades em polegadas.",
"Enables soft limits checks within machine travel and sets alarm when exceeded. Requires homing.":"Impede movimentos fora da área da máquina. Exige o Home ativado.",
"Enables hard limits. Immediately halts motion and throws an alarm when switch is triggered.":"Para tudo e gera alarme quando um fim de curso é acionado.",
"Enables homing cycle. Requires limit switches on all axes.":"Ativa o Home. Exige fins de curso nos eixos.",
"Homing searches for a switch in the positive direction. Set axis bit (00000ZYX) to search in negative direction.":"Sentido de busca do Home. Bits por eixo (00000ZYX) para buscar no sentido negativo.",
"Feed rate to slowly engage limit switch to determine its location accurately.":"Velocidade lenta para achar o fim de curso com precisão.",
"Seek rate to quickly find the limit switch before the slower locating phase.":"Velocidade rápida para procurar o fim de curso.",
"Sets a short delay between phases of homing cycle to let a switch debounce.":"Pausa entre as fases do Home para estabilizar o fim de curso.",
"Retract distance after triggering switch to disengage it. Homing will fail if switch isn't cleared.":"Quanto o eixo recua depois de tocar o fim de curso.",
"Maximum spindle speed. Sets PWM to 100% duty cycle.":"Valor de S que corresponde a 100% de potência do laser.",
"Minimum spindle speed. Sets PWM to 0.4% or lowest duty cycle.":"Valor de S que corresponde à potência mínima.",
"Enables laser mode. Consecutive G1/2/3 commands will not halt when spindle speed is changed.":"Modo laser: o laser só liga durante movimentos G1/G2/G3 e não para ao mudar a potência.",
"X-axis travel resolution in steps per millimeter.":"Passos do motor por milímetro no eixo X.","Y-axis travel resolution in steps per millimeter.":"Passos do motor por milímetro no eixo Y.",
"Z-axis travel resolution in steps per millimeter.":"Passos do motor por milímetro no eixo Z.","A-axis travel resolution in steps per millimeter.":"Passos do motor por milímetro no eixo A.",
"B-axis travel resolution in steps per millimeter.":"Passos do motor por milímetro no eixo B.","C-axis travel resolution in steps per millimeter.":"Passos do motor por milímetro no eixo C.",
"X-axis maximum rate. Used as G0 rapid rate.":"Velocidade máxima do X (usada no G0).","Y-axis maximum rate. Used as G0 rapid rate.":"Velocidade máxima do Y (usada no G0).",
"Z-axis maximum rate. Used as G0 rapid rate.":"Velocidade máxima do Z (usada no G0).","A-axis maximum rate. Used as G0 rapid rate.":"Velocidade máxima do A (usada no G0).",
"B-axis maximum rate. Used as G0 rapid rate.":"Velocidade máxima do B (usada no G0).","C-axis maximum rate. Used as G0 rapid rate.":"Velocidade máxima do C (usada no G0).",
"X-axis acceleration. Used for motion planning to not exceed motor torque and lose steps.":"Aceleração do X. Alta demais faz o motor perder passos.",
"Y-axis acceleration. Used for motion planning to not exceed motor torque and lose steps.":"Aceleração do Y. Alta demais faz o motor perder passos.",
"Z-axis acceleration. Used for motion planning to not exceed motor torque and lose steps.":"Aceleração do Z. Alta demais faz o motor perder passos.",
"A-axis acceleration. Used for motion planning to not exceed motor torque and lose steps.":"Aceleração do A. Alta demais faz o motor perder passos.",
"B-axis acceleration. Used for motion planning to not exceed motor torque and lose steps.":"Aceleração do B. Alta demais faz o motor perder passos.",
"C-axis acceleration. Used for motion planning to not exceed motor torque and lose steps.":"Aceleração do C. Alta demais faz o motor perder passos.",
"Maximum X-axis travel distance from homing switch. Determines valid machine space for soft-limits and homing search distances.":"Curso máximo do X a partir do Home (área de trabalho).",
"Maximum Y-axis travel distance from homing switch. Determines valid machine space for soft-limits and homing search distances.":"Curso máximo do Y a partir do Home (área de trabalho).",
"Maximum Z-axis travel distance from homing switch. Determines valid machine space for soft-limits and homing search distances.":"Curso máximo do Z a partir do Home.",
"Maximum A-axis travel distance from homing switch. Determines valid machine space for soft-limits and homing search distances.":"Curso máximo do A a partir do Home.",
"Maximum B-axis travel distance from homing switch. Determines valid machine space for soft-limits and homing search distances.":"Curso máximo do B a partir do Home.",
"Maximum C-axis travel distance from homing switch. Determines valid machine space for soft-limits and homing search distances.":"Curso máximo do C a partir do Home.",
"PWM frequency of the laser output.":"Frequência do sinal PWM que controla o laser.","Language code used by the firmware.":"Código do idioma usado pelo firmware.",
"Turns the buzzer on (1) or off (0).":"Liga (1) ou desliga (0) o bipe.","Enables the probe input.":"Ativa a entrada da sonda.",
"Enables the flame sensor (stops the job if it detects fire).":"Ativa o sensor de chama (para o trabalho se detectar fogo).",
"Enables the air assist control.":"Ativa o controle do air assist.","Vendor work mode selection (normal or rotary).":"Modo de trabalho do fabricante (normal ou rotativo).",
"Serial port speed code.":"Código da velocidade da porta serial.","Enables the second serial port.":"Ativa a segunda porta serial.",
"Enables the safety door / lid sensor.":"Ativa o sensor da porta/tampa de segurança.",
"Vendor Wi-Fi mode. Use the Wi-Fi tab to change the network.":"Modo Wi-Fi do fabricante. Para trocar de rede use a aba Wi-Fi.",
"Accelerometer (LIS2DH): number of readings before the movement alarm.":"Acelerômetro (LIS2DH): leituras antes do alarme de movimento.",
"Accelerometer (LIS2DH): sensitivity of the movement/tilt alarm.":"Acelerômetro (LIS2DH): sensibilidade do alarme de movimento/inclinação.",
"Thickness of the knife/tool.":"Espessura da lâmina/ferramenta.","Y-axis steps per millimeter in normal mode.":"Passos por mm do eixo Y no modo normal.",
"Y-axis steps per millimeter when using the rotary roller.":"Passos por mm do eixo Y usando o rolo rotativo."
};for(var k in t)ptbrtrans[k]=t[k]})();

inline_unit=function(e){var t=grbl_unit[e];return void 0===t?"":translate_text_item(t)};

new_build_HTML_config_list=function(){
    for(var e="",t=0;t<config_configList.length;t++){
        var a=config_configList[t];
        e+="<tr class='config_body_tr' id='cfg_row_"+t+"'><td><button type='button' class='cfg-set' onclick='configGetvalue("+t+","+is_override_config+")'>"+T("Set")+"</button></td>"+
        "<td class='cfg-code'>"+esc_html(a.label)+"</td>"+
        "<td><input class='cfg-input' id='config_"+t+"' type='text' spellcheck='false' value='"+esc_html(a.defaultvalue)+"' onkeyup='config_checkchange("+t+","+is_override_config+",event)'><div class='cfg-st' id='cfg_st_"+t+"'></div></td>"+
        "<td class='cfg-unit'>"+a.unit+"</td><td class='cfg-param'>"+a.param+"</td><td class='cfg-desc'>"+a.desc+"</td></tr>\n"
    }
    0<e.length&&(document.getElementById("config_list_data").innerHTML=e),document.getElementById("config_loader").style.display="none",
    document.getElementById("config_list_content").style.display="block",document.getElementById("config_status").style.display="none",document.getElementById("refreshconfig_btn").style.display="none"
};

function cfg_mark(e,t,a){
    var n=document.getElementById("cfg_row_"+e),r=document.getElementById("cfg_st_"+e);
    n&&(n.classList.remove("cfg-changed","cfg-saving","cfg-ok","cfg-err"),t&&n.classList.add("cfg-"+t)),r&&(r.innerHTML=a||"")
}

var laser_orig_configGetvalue=configGetvalue;
configGetvalue=function(e,t){
    if(t||"grbl-embedded"!=target_firmware)return laser_orig_configGetvalue(e,t);
    var a=config_configList[e],n=document.getElementById("config_"+e),r=n.value.trim(),o=a.label.replace(/^\$/,"");
    if(r==a.defaultvalue)return void cfg_mark(e,"",T("Unchanged"));
    if(!config_check_value(r,e,t))return void alertdlg(translate_text_item("Out of range"),translate_text_item("Value ")+config_error_msg+" !");
    cfg_mark(e,"saving",T("Saving")+"...");
    wf_write(o,r).then(function(t){
        return null==t?void cfg_mark(e,"err",T("no answer from the board")):0==t.indexOf("error")?void cfg_mark(e,"err",esc_html(t+" "+translate_text_item(t))):
        wf_query(o).then(function(t){
            null!=t&&(t==r||parseFloat(t)==parseFloat(r))?(a.defaultvalue=t,n.value=t,cfg_mark(e,"ok","&#10003; "+T("Saved"))):cfg_mark(e,"err",T("value on the board differs")+(null!=t?": "+esc_html(t):""))
        })
    })
};

var laser_orig_config_checkchange=config_checkchange;
config_checkchange=function(e,t,a){
    if(laser_orig_config_checkchange(e,t),!t){
        var n=config_configList[e],r=document.getElementById("config_"+e).value.trim();
        a&&"Enter"==a.key?configGetvalue(e,t):cfg_mark(e,r!=n.defaultvalue?"changed":"","")
    }
};
