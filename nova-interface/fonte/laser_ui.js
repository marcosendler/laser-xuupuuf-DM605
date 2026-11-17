/* Laser UI: tema escuro/claro, atalhos de jog e tela de Wi-Fi */
(function(){var t={
"Theme":"Tema","Wi-Fi":"Wi-Fi","Status":"Status","Mode":"Modo","IP address":"Endereço IP","Network":"Rede","Name on network":"Nome na rede",
"Client (router)":"Cliente (roteador)","Access point":"Ponto de acesso","Off":"Desligado","Refresh":"Atualizar",
"Wi-Fi network (client)":"Rede Wi-Fi (cliente)","Scan networks":"Procurar redes","Scanning...":"Procurando...",
"No networks found":"Nenhuma rede encontrada","Network name (SSID)":"Nome da rede (SSID)","Password":"Senha","Show":"Mostrar","Hide":"Ocultar",
"Leave blank to keep the current password":"Deixe em branco para manter a senha atual","IP mode":"Endereço IP",
"Automatic (DHCP)":"Automático (DHCP)","Fixed":"Fixo","Netmask":"Máscara","Gateway":"Gateway",
"Access point (fallback)":"Ponto de acesso (reserva)",
"Network the laser creates when it cannot join the router.":"Rede que a gravadora cria quando não consegue entrar no roteador.",
"AP name":"Nome do AP","AP password":"Senha do AP","Save":"Salvar","Save and restart":"Salvar e reiniciar",
"Changes only take effect after restarting the laser.":"As mudanças só valem depois de reiniciar a gravadora.",
"Nothing changed.":"Nada foi alterado.","Saving":"Gravando","Saved":"Gravado","Failed":"Falhou",
"value on the board differs":"o valor na placa ficou diferente","no answer from the board":"a placa não respondeu",
"Network name must have 1 to 32 characters.":"O nome da rede deve ter de 1 a 32 caracteres.",
"Password must have 8 to 63 characters.":"A senha deve ter de 8 a 63 caracteres.",
"AP name must have 1 to 32 characters.":"O nome do AP deve ter de 1 a 32 caracteres.",
"AP password must have 8 to 63 characters.":"A senha do AP deve ter de 8 a 63 caracteres.",
"Invalid IP address":"Endereço IP inválido","Hostname: letters, numbers and - only.":"Nome na rede: use apenas letras, números e -.",
"Restart the laser now?":"Reiniciar a gravadora agora?",
"If the new network works, the laser may get a new IP address: check it on your router. If it cannot connect, it usually creates the access point network below.":"Se a nova rede funcionar, a gravadora pode receber outro endereço IP: confira no seu roteador. Se não conseguir conectar, normalmente ela cria a rede do ponto de acesso abaixo.",
"Open network: this screen cannot clear the saved password.":"Rede aberta: esta tela não consegue apagar a senha salva.",
"Not connected to the board.":"Sem conexão com a placa."
};for(var k in t)ptbrtrans[k]=t[k]})();

function T(e){return translate_text_item(e)}

/* ---------- Tema ---------- */
function laser_set_theme(e){
    var t=document.documentElement;
    t.className=t.className.replace(/\s*theme-dark/g,"")+("dark"==e?" theme-dark":"");
    try{localStorage.setItem("laser_theme",e)}catch(a){}
    var a=document.getElementById("laser_theme_btn");a&&(a.innerHTML="dark"==e?"&#9788;":"&#9790;")
}
function laser_toggle_theme(){laser_set_theme(-1!=document.documentElement.className.indexOf("theme-dark")?"light":"dark")}

/* ---------- Atalhos de velocidade e distancia ---------- */
function laser_chips(e,t,a,n){
    var r=document.getElementById(e);if(r){
    for(var o="<div class='laser-chips' data-for='"+e+"'>",i=0;i<t.length;i++)o+="<button type='button' class='laser-chip' data-v='"+t[i]+"'>"+t[i]+n+"</button>";
    var l=r.closest("[style*='display:flex']")||r.parentNode;l.insertAdjacentHTML("afterend",o+"</div>");
    var s=l.nextSibling,d=function(){for(var e=s.children,t=0;t<e.length;t++)e[t].classList.toggle("on",parseFloat(e[t].getAttribute("data-v"))==parseFloat(r.value))};
    s.addEventListener("click",function(e){var t=e.target.closest(".laser-chip");t&&(r.value=t.getAttribute("data-v"),a(),d())}),r.addEventListener("input",d),r.addEventListener("change",d),d()}
}

/* ---------- Wi-Fi ---------- */
var wf_vals={},wf_line_waiters=[],wf_net={},wf_loaded=!1;

function wf_decode(e){try{return decodeURIComponent(escape(e))}catch(t){return e}}

var laser_orig_process_socket_response=process_socket_response;
process_socket_response=function(e){
    var t=(e||"").replace(/[\r\n]+/g,"");
    if(t.length){
        var a=/^\$(5[0-4]|ESP110)=(.*)$/.exec(t);a&&(wf_vals[a[1]]=wf_decode(a[2]));
        for(var n=wf_line_waiters.slice(),r=0;r<n.length;r++)n[r].test(t)&&(wf_line_waiters.splice(wf_line_waiters.indexOf(n[r]),1),n[r].done(t))
    }
    return laser_orig_process_socket_response(e)
};

function wf_http(e){
    return new Promise(function(t,a){
        var n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&(200==n.status?t(n.responseText):a(n.status))},
        n.open("GET",e+(-1!=e.indexOf("?")?"&":"?")+"PAGEID="+page_id,!0),n.send()
    })
}

/* espera o WebSocket conectar: as respostas dos comandos $ chegam por ele */
function wf_ready(){
    return new Promise(function(e){
        var t=Date.now(),a=function(){"undefined"!=typeof ws_source&&ws_source&&1==ws_source.readyState&&page_id?e(!0):Date.now()-t>15e3?e(!1):setTimeout(a,250)};a()
    })
}

/* envia um comando $ e espera a primeira linha que satisfaz o teste */
function wf_ws(e,t,a){
    return wf_ready().then(function(){return new Promise(function(n){
        var r={test:t,done:function(e){clearTimeout(o),n(e)}},o=setTimeout(function(){var e=wf_line_waiters.indexOf(r);-1!=e&&wf_line_waiters.splice(e,1),n(null)},a||4e3);
        wf_line_waiters.push(r),wf_http("/command?commandText="+encodeURIComponent(e)).catch(function(){})
    })})
}
function wf_query(e){return wf_ws("$"+e,function(t){return 0==t.indexOf("$"+e+"=")}).then(function(t){return null==t?null:wf_decode(t.substring(e.length+2))})}
function wf_write(e,t){return wf_ws("$"+e+"="+t,function(e){return/^(ok|error:\d+)/.test(e)})}

function wf_esp400(){
    return wf_http("/command?plain="+encodeURIComponent("[ESP400]")).then(function(e){
        var t=JSON.parse(e),a={};
        return t.EEPROM.forEach(function(e){a[e.P]=e.V}),wf_net=a,a
    })
}

function wf_el(e){return document.getElementById(e)}
function wf_set(e,t){var a=wf_el(e);a&&(a.textContent=null==t||""===t?"—":t)}
function wf_bars(e){for(var t=parseInt(e)||0,a="<span class='wf-bars'>",n=1;n<=4;n++)a+="<i class='"+(t>=25*n-10?"on":"")+"' style='height:"+(3*n+2)+"px'></i>";return a+"</span>"}

function wf_mode_text(e){return"STA"==e?T("Client (router)"):"AP"==e?T("Access point"):e?T("Off"):""}

function wf_load(){
    wf_set("wf_st_mode","..."),wf_set("wf_st_ip","..."),wf_set("wf_st_ssid","..."),wf_set("wf_st_host","...");
    wf_http("/command?plain="+encodeURIComponent("[ESP111]")).then(function(e){wf_set("wf_st_ip",e.trim())}).catch(function(){wf_set("wf_st_ip","")});
    wf_esp400().then(function(e){
        wf_set("wf_st_host",e["System/Hostname"]),wf_el("wf_host").value=e["System/Hostname"]||"";
        var t="1"==e["Sta/IPMode"];wf_el("wf_ipm_static").checked=t,wf_el("wf_ipm_dhcp").checked=!t,
        wf_el("wf_ip").value="0.0.0.0"==e["Sta/IP"]?"":e["Sta/IP"]||"",wf_el("wf_mask").value="0.0.0.0"==e["Sta/Netmask"]?"":e["Sta/Netmask"]||"",
        wf_el("wf_gw").value="0.0.0.0"==e["Sta/Gateway"]?"":e["Sta/Gateway"]||"",wf_ipmode_ui()
    }).catch(function(){});
    /* consultas $ em sequencia: a resposta chega pelo WebSocket */
    wf_query("ESP110").then(function(e){return wf_set("wf_st_mode",wf_mode_text(e)),wf_query("53")}).then(function(e){
        return wf_set("wf_st_ssid",e),null!=e&&(wf_el("wf_ssid").value=e,wf_el("wf_ssid").setAttribute("data-orig",e)),wf_query("51")
    }).then(function(e){
        null!=e&&(wf_el("wf_apssid").value=e,wf_el("wf_apssid").setAttribute("data-orig",e)),
        null==wf_vals[53]&&wf_msg("<span class='err'>"+T("Not connected to the board.")+"</span>"),wf_loaded=!0
    })
}

function wf_open(){wf_loaded||wf_load()}

function wf_scan(){
    var e=wf_el("wf_scan_btn"),t=wf_el("wf_scan_list");
    e.disabled=!0,e.textContent=T("Scanning..."),t.innerHTML="";
    wf_http("/command?plain="+encodeURIComponent("[ESP410]")).then(function(a){
        var n=JSON.parse(a).AP_LIST||[],r={};
        n.forEach(function(e){var t=wf_decode(e.SSID);t&&(!r[t]||parseInt(e.SIGNAL)>parseInt(r[t].SIGNAL))&&(r[t]={SSID:t,SIGNAL:e.SIGNAL,P:"1"==e.IS_PROTECTED})});
        var o=Object.keys(r).map(function(e){return r[e]}).sort(function(e,t){return parseInt(t.SIGNAL)-parseInt(e.SIGNAL)});
        t.innerHTML=o.length?o.map(function(e,t){
            return"<div class='wf-ap' data-i='"+t+"'>"+wf_bars(e.SIGNAL)+"<span class='n'>"+esc_html(e.SSID)+"</span>"+(e.P?"&#128274;":"")+"<span class='s'>"+parseInt(e.SIGNAL)+"%</span></div>"
        }).join(""):"<div class='wf-ap'>"+T("No networks found")+"</div>",t._aps=o
    }).catch(function(){t.innerHTML="<div class='wf-ap'>"+T("No networks found")+"</div>"}).then(function(){e.disabled=!1,e.textContent=T("Scan networks")})
}

function wf_pick(e){
    var t=e.target.closest(".wf-ap"),a=wf_el("wf_scan_list");
    if(t&&a._aps&&null!=t.getAttribute("data-i")){
        var n=a._aps[parseInt(t.getAttribute("data-i"))];
        [].forEach.call(a.children,function(e){e.classList.remove("sel")}),t.classList.add("sel"),
        wf_el("wf_ssid").value=n.SSID,wf_el("wf_pw").value="",
        wf_msg(n.P?"":"<span class='info'>"+T("Open network: this screen cannot clear the saved password.")+"</span>"),n.P&&wf_el("wf_pw").focus()
    }
}

function wf_ipmode_ui(){wf_el("wf_static_rows").style.display=wf_el("wf_ipm_static").checked?"block":"none"}
function wf_toggle_pw(e,t){var a=wf_el(e);a.type="password"==a.type?"text":"password",t.textContent=T("password"==a.type?"Show":"Hide")}
function wf_msg(e){wf_el("wf_msg").innerHTML=e}
function wf_ip_ok(e){return/^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(e)}

async function wf_save(e){
    var t=wf_el("wf_ssid").value,a=wf_el("wf_pw").value,n=wf_el("wf_apssid").value,r=wf_el("wf_appw").value,
        o=wf_el("wf_host").value.trim(),i=wf_el("wf_ipm_static").checked,l=[],s=[];
    t!=wf_el("wf_ssid").getAttribute("data-orig")&&((t.length<1||32<t.length)&&s.push(T("Network name must have 1 to 32 characters.")),l.push({k:"53",v:t,label:T("Network name (SSID)"),check:!0}));
    a.length&&((a.length<8||63<a.length)&&s.push(T("Password must have 8 to 63 characters.")),l.push({k:"54",v:a,label:T("Password")}));
    n!=wf_el("wf_apssid").getAttribute("data-orig")&&((n.length<1||32<n.length)&&s.push(T("AP name must have 1 to 32 characters.")),l.push({k:"51",v:n,label:T("AP name"),check:!0}));
    r.length&&((r.length<8||63<r.length)&&s.push(T("AP password must have 8 to 63 characters.")),l.push({k:"52",v:r,label:T("AP password")}));
    o!=(wf_net["System/Hostname"]||"")&&(/^[A-Za-z0-9-]{1,32}$/.test(o)||s.push(T("Hostname: letters, numbers and - only.")),l.push({k:"System/Hostname",v:o,label:T("Name on network"),net:!0}));
    (i?"1":"0")!=wf_net["Sta/IPMode"]&&l.push({k:"Sta/IPMode",v:i?"Static":"DHCP",label:T("IP mode"),net:"Sta/IPMode",want:i?"1":"0"});
    i&&[["wf_ip","Sta/IP",T("IP address")],["wf_mask","Sta/Netmask",T("Netmask")],["wf_gw","Sta/Gateway",T("Gateway")]].forEach(function(e){
        var t=wf_el(e[0]).value.trim();wf_ip_ok(t)?t!=wf_net[e[1]]&&l.push({k:e[1],v:t,label:e[2],net:!0}):s.push(T("Invalid IP address")+": "+e[2])
    });
    if(s.length)return void wf_msg(s.map(function(e){return"<span class='err'>&#10007; "+esc_html(e)+"</span>"}).join("<br>"));
    if(!l.length&&!e)return void wf_msg("<span class='info'>"+T("Nothing changed.")+"</span>");
    var d=wf_el("wf_save_btn"),c=wf_el("wf_save_rst_btn");d.disabled=c.disabled=!0;
    for(var u=[],p=!0,f=0;f<l.length;f++){
        var g=l[f];wf_msg(u.join("<br>")+(u.length?"<br>":"")+"<span class='info'>"+T("Saving")+": "+esc_html(g.label)+"...</span>");
        var m=await wf_write(g.k,g.v),v=null;
        null==m?v=T("no answer from the board"):0==m.indexOf("error")?v=m+" "+translate_text_item(m):g.check?(await wf_query(g.k))!==g.v&&(v=T("value on the board differs")):g.net&&(await wf_esp400().catch(function(){return{}}),(wf_net[g.k]||"")!=(g.want||g.v)&&(v=T("value on the board differs")));
        v?(p=!1,u.push("<span class='err'>&#10007; "+esc_html(g.label)+": "+esc_html(v)+"</span>")):u.push("<span class='ok'>&#10003; "+esc_html(g.label)+": "+T("Saved")+"</span>")
    }
    l.length&&(wf_el("wf_ssid").setAttribute("data-orig",wf_el("wf_ssid").value),wf_el("wf_apssid").setAttribute("data-orig",wf_el("wf_apssid").value),wf_el("wf_pw").value=wf_el("wf_appw").value="");
    u.push("<span class='info'>"+T("Changes only take effect after restarting the laser.")+"</span>"),wf_msg(u.join("<br>")),d.disabled=c.disabled=!1;
    e&&p&&confirmdlg(T("Restart the laser now?"),T("If the new network works, the laser may get a new IP address: check it on your router. If it cannot connect, it usually creates the access point network below."),function(e){"yes"==e&&restartdlg()})
}

function wf_build(){
    var e="<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'><path d='M2 8.5a15 15 0 0 1 20 0'/><path d='M5 12a10 10 0 0 1 14 0'/><path d='M8.5 15.5a5 5 0 0 1 7 0'/><circle cx='12' cy='19' r='1.2' fill='currentColor'/></svg>",
        t="opentab(event, 'wifitab', 'mainuitabscontent', 'mainuitablinks');wf_open()",
        a=wf_el("configtablink");
    a&&a.insertAdjacentHTML("afterend"," <button class='tablinks' id='wifitablink' onclick=\""+t+"\">"+e+" <span translate>Wi-Fi</span></button>");
    var n=document.querySelector(".dropdown-content a[onclick*='configtab']");
    n&&n.insertAdjacentHTML("afterend","<div class='menu-divider'></div><a href='#' onclick=\""+t+"\"><span class='pull-right' translate>Wi-Fi</span> <span class='pull-left'>"+e+"</span><span class='clearfix'></span></a>");
    var r="<div id='wifitab' class='tabcontent'>"+
    "<div class='wf-card'><h4 translate>Status</h4><div class='wf-status'>"+
      "<div><small translate>Mode</small><b id='wf_st_mode'>—</b></div><div><small translate>IP address</small><b id='wf_st_ip'>—</b></div>"+
      "<div><small translate>Network</small><b id='wf_st_ssid'>—</b></div><div><small translate>Name on network</small><b id='wf_st_host'>—</b></div></div>"+
      "<div class='wf-actions'><button class='wf-btn' onclick='wf_load()' translate>Refresh</button></div></div>"+
    "<div class='wf-card'><h4 translate>Wi-Fi network (client)</h4>"+
      "<div class='wf-actions' style='margin:0 0 10px'><button class='wf-btn' id='wf_scan_btn' onclick='wf_scan()' translate>Scan networks</button></div>"+
      "<div class='wf-scan' id='wf_scan_list' onclick='wf_pick(event)'></div>"+
      "<div class='wf-row'><label for='wf_ssid' translate>Network name (SSID)</label><input class='wf-input' id='wf_ssid' maxlength='32' autocomplete='off' spellcheck='false'></div>"+
      "<div class='wf-row'><label for='wf_pw' translate>Password</label><div><div class='wf-pw'><input class='wf-input' id='wf_pw' type='password' maxlength='63' autocomplete='new-password'><button class='wf-btn' onclick=\"wf_toggle_pw('wf_pw',this)\" translate>Show</button></div><p class='wf-hint' translate>Leave blank to keep the current password</p></div></div>"+
      "<div class='wf-row'><label translate>IP mode</label><div class='wf-radio'><label><input type='radio' name='wf_ipm' id='wf_ipm_dhcp' onchange='wf_ipmode_ui()'> <span translate>Automatic (DHCP)</span></label><label><input type='radio' name='wf_ipm' id='wf_ipm_static' onchange='wf_ipmode_ui()'> <span translate>Fixed</span></label></div></div>"+
      "<div id='wf_static_rows' style='display:none'>"+
        "<div class='wf-row'><label for='wf_ip' translate>IP address</label><input class='wf-input' id='wf_ip' placeholder='192.168.1.50'></div>"+
        "<div class='wf-row'><label for='wf_mask' translate>Netmask</label><input class='wf-input' id='wf_mask' placeholder='255.255.255.0'></div>"+
        "<div class='wf-row'><label for='wf_gw' translate>Gateway</label><input class='wf-input' id='wf_gw' placeholder='192.168.1.1'></div></div>"+
      "<div class='wf-row'><label for='wf_host' translate>Name on network</label><input class='wf-input' id='wf_host' maxlength='32' spellcheck='false'></div></div>"+
    "<div class='wf-card'><h4 translate>Access point (fallback)</h4>"+
      "<div class='wf-row'><label for='wf_apssid' translate>AP name</label><input class='wf-input' id='wf_apssid' maxlength='32' spellcheck='false'></div>"+
      "<div class='wf-row'><label for='wf_appw' translate>AP password</label><div><div class='wf-pw'><input class='wf-input' id='wf_appw' type='password' maxlength='63' autocomplete='new-password'><button class='wf-btn' onclick=\"wf_toggle_pw('wf_appw',this)\" translate>Show</button></div><p class='wf-hint' translate>Leave blank to keep the current password</p></div></div>"+
      "<p class='wf-hint' translate>Network the laser creates when it cannot join the router.</p></div>"+
    "<div class='wf-card'><div class='wf-actions' style='margin:0'><button class='wf-btn primary' id='wf_save_rst_btn' onclick='wf_save(true)' translate>Save and restart</button><button class='wf-btn' id='wf_save_btn' onclick='wf_save(false)' translate>Save</button></div><div class='wf-msg' id='wf_msg'></div></div>"+
    "</div>";
    wf_el("mainuitabscontent").insertAdjacentHTML("beforeend",r)
}

(function(){
    var e=document.querySelector("nav.navbar");
    e&&(e.style.position="relative",e.insertAdjacentHTML("beforeend","<button id='laser_theme_btn' type='button' onclick='laser_toggle_theme()' title='Tema'></button>"));
    laser_set_theme(-1!=document.documentElement.className.indexOf("theme-dark")?"dark":"light");
    wf_build();
    laser_chips("fInput",[10,30,50,100,200],changeFInput," mm/s");
    laser_chips("sInput",[.1,1,5,10,50],changeSInput," mm");
    var t=document.querySelector("#jogdialLaser svg");t&&!t.getAttribute("viewBox")&&(t.setAttribute("viewBox","0 0 500 300"),t.removeAttribute("width"),t.removeAttribute("height"))
})();
