var sw_mode = '<% nvram_get_x("", "sw_mode"); %>';
var productid = '<% nvram_get_x("", "productid"); %>';
var wan_route_x = '<% nvram_get_x("", "wan_route_x"); %>';
var wan_nat_x = '<% nvram_get_x("", "wan_nat_x"); %>';
var wan_proto = '<% nvram_get_x("", "wan_proto"); %>';

var uptimeStr = "<% uptime(); %>";
var timezone = uptimeStr.substring(26,31);
var boottime = parseInt(uptimeStr.substring(32,42));
var newformat_systime = uptimeStr.substring(8,11) + " " + uptimeStr.substring(5,7) + " " + uptimeStr.substring(17,25) + " " + uptimeStr.substring(12,16);  //Ex format: Jun 23 10:33:31 2008
var systime_millsec = Date.parse(newformat_systime); // millsec from system
var JS_timeObj = new Date(); // 1970.1.1

var uagent = navigator.userAgent.toLowerCase();
var is_ie11p = (/trident\/7\./).test(uagent);
var is_mobile = (/iphone|ipod|ipad|iemobile|android|blackberry|fennec/).test(uagent);

var new_wan_internet = "2";
var id_of_check_changed_status = 0;

<% firmware_caps_hook(); %>

function unload_body(){
	disableCheckChangedStatus();
	no_flash_button();
	
	return true;
}

function enableCheckChangedStatus(flag){
	var tm_int_sec = 1;

	disableCheckChangedStatus();

	if (new_wan_internet == "0")
		tm_int_sec = 3;
	else if (new_wan_internet == "1")
		tm_int_sec = 5;

	id_of_check_changed_status = setTimeout("get_changed_status();", tm_int_sec * 1000);
}

function disableCheckChangedStatus(){
	clearTimeout(id_of_check_changed_status);
	id_of_check_changed_status = 0;
}

function check_changed_status(){
	if(location.pathname == "/" || location.pathname == "/index.asp"){
		if (new_wan_internet == "1")
			showMapWANStatus(1);
		else if(new_wan_internet == "2")
			showMapWANStatus(2);
		else
			showMapWANStatus(0);
	}
	
	enableCheckChangedStatus();
}

function set_changed_status(wan_internet){
	this.new_wan_internet = wan_internet;
}

function get_changed_status() {
	var $j = jQuery.noConflict();
	$j.ajax({
		url: '/status_internet.asp',
		dataType: 'script',
		cache: true,
		error: function(xhr) {
			;
		},
		success: function(response) {
			set_changed_status(now_wan_internet);
			check_changed_status();
		}
	});
}

// for detect if the status of the machine is changed. }

function getRadioBandStatus(data)
{
    var $j = jQuery.noConflict();
    if(typeof data.wifi2 === 'object' && typeof data.wifi5 === 'object')
    {
        var wifi2 = parseInt(data.wifi2.state);
        var wifi5 = parseInt(data.wifi5.state);

        var wifi2Guest = parseInt(data.wifi2.guest);
        var wifi5Guest = parseInt(data.wifi5.guest);

        if(wifi2 > 0)
            $j('#wifi2_b').addClass('btn-info');
        else
            $j('#wifi2_b').removeClass('btn-info');

        if(wifi5 > 0)
            $j('#wifi5_b').addClass('btn-info');
        else
            $j('#wifi5_b').removeClass('btn-info');

        // guest ap
        if(wifi2Guest > 0)
            $j('#wifi2_b_g').addClass('btn-info');
        else
            $j('#wifi2_b_g').removeClass('btn-info');

        if(wifi5Guest > 0)
            $j('#wifi5_b_g').addClass('btn-info');
        else
            $j('#wifi5_b_g').removeClass('btn-info');
    }
}

var banner_code, menu_code="", menu1_code="", menu2_code="", tab_code="", footer_code;
var enabled2Gclass = '<% nvram_match_x("","rt_radio_x", "1", "btn-info"); %>';
var enabled5Gclass = '<% nvram_match_x("","wl_radio_x", "1", "btn-info"); %>';
var enabledGuest2Gclass = '<% nvram_match_x("","rt_guest_enable", "1", "btn-info"); %>';
var enabledGuest5Gclass = '<% nvram_match_x("","wl_guest_enable", "1", "btn-info"); %>';
var enabledBtnCommit = '<% nvram_match_x("","nvram_manual", "0", "display:none;"); %>';

function show_banner(L3){// L3 = The third Level of Menu

    var style_2g = 'width:55px;';
    var style_5g = 'width:55px;';
    var banner_code = "";
    if (!support_5g_radio()) {
        style_2g = 'width:114px;';
        style_5g = 'width:21px;display:none;';
    }

    // log panel
    if (!is_mobile){
        banner_code += '<div class="syslog_panel">\n';
        banner_code += '<button id="syslog_panel_button" class="handle" href="/"><span class="log_text">Log</span></button>\n';
        banner_code += '<table class="" style="margin-top: 0px; margin-bottom: 5px" width="100%" border="0">\n';
        banner_code += '  <tr>\n';
        banner_code += '    <td width="60%" style="text-align: left">\n';
        banner_code += '      <b><#General_x_SystemTime_itemname#>:</b><span class="alert alert-info" style="margin-left: 10px; padding-top: 4px; padding-bottom: 4px;" id="system_time_log_area"></span></td>\n';
        banner_code += '    <td style="text-align: right">\n';
        banner_code += '      <button type="button" id="clearlog_btn" class="btn btn-info" style="min-width: 170px;" onclick="clearlog();"><#CTL_clear#></button></td>\n';
        banner_code += '  </tr>\n';
        banner_code += '</table>\n';
        banner_code += '<span><textarea rows="28" wrap="off" class="span12" readonly="readonly" id="log_area"></textarea></span>\n';
        banner_code += '</div>\n';
    }

    // for chang language
    banner_code +='<form method="post" name="titleForm" id="titleForm" action="/start_apply.htm" target="hidden_frame">\n';
    banner_code +='<input type="hidden" name="current_page" value="">\n';
    banner_code +='<input type="hidden" name="sid_list" value="LANGUAGE;">\n';
    banner_code +='<input type="hidden" name="action_mode" value=" Apply ">\n';
    banner_code +='<input type="hidden" name="preferred_lang" value="">\n';
    banner_code +='<input type="hidden" name="flag" value="">\n';
    banner_code +='</form>\n';

    // --->
    banner_code += '<div class="container-fluid" style="padding-left: 0px; margin-left: -6px;">\n';
    banner_code += '<div class="row-fluid">\n';

    // block system info
    banner_code += '<div class="span6">\n';
    banner_code += '<div class="well" style="margin-bottom: 0px; padding: 7px 6px 6px 6px; height: 109px;">\n';
    banner_code += '<div class="row-fluid">\n';
    banner_code += '<iframe style="visibility:hidden;" onload="this.style.visibility = \'visible\'" src="/system_status.asp" frameborder="0" scrolling="no" width="100%" height="102px" ALLOWTRANSPARENCY="true"></iframe>\n';
    banner_code += '</div>\n';
    banner_code += '</div>\n';
    banner_code += '</div>\n';

    // block firmware version
    banner_code += '<div class="span6">\n';
    banner_code += '<div class="well" style="margin-bottom: 0px; height: 109px; padding: 5px 6px 8px 6px;">\n';
    banner_code += '<div class="row-fluid">\n';
    banner_code += '<table class="table table-condensed" style="margin-bottom: 0px">\n';
    banner_code += '<tbody>\n';
    banner_code += '<tr>\n';
    banner_code += '    <td width="50%" style="border: 0 none;"><#menu5_1#>:</td>\n';
    banner_code += '    <td style="border: 0 none; min-width: 115px;"><div class="form-inline"><input type="button" id="wifi2_b" class="btn btn-mini '+enabled2Gclass+'" style="'+style_2g+'" value="2.4GHz" onclick="go_setting(2);">&nbsp;<input type="button" id="wifi5_b" style="'+style_5g+'" class="btn btn-mini '+enabled5Gclass+'" value="5GHz" onclick="go_setting(5);"></div></td>\n';
    banner_code += '</tr>\n';
    banner_code += '<tr>\n';
    banner_code += '    <td><#menu5_1_2#>:</td>\n';
    banner_code += '    <td><div class="form-inline"><input type="button" id="wifi2_b_g" class="btn btn-mini '+enabledGuest2Gclass+'" style="'+style_2g+'" value="2.4GHz" onclick="go_wguest(2);">&nbsp;<input type="button" id="wifi5_b_g" style="'+style_5g+'" class="btn btn-mini '+enabledGuest5Gclass+'" value="5GHz" onclick="go_wguest(5);"></div></td>\n';
    banner_code += '</tr>\n';
    banner_code += '<tr><td><#General_x_FirmwareVersion_itemname#></td><td><a href="/Advanced_FirmwareUpgrade_Content.asp"><span id="firmver" class="time"></span></a></td></tr>\n';
    banner_code += '<tr><td><button type="button" id="commit_btn" class="btn btn-mini" style="width: 114px; height: 21px; outline:0; '+enabledBtnCommit+'" onclick="commit();"><i class="icon icon-fire"></i>&nbsp;<#CTL_Commit#></button></td><td><button type="button" id="logout_btn" class="btn btn-mini" style="width: 114px; height: 21px; outline:0;" onclick="logout();"><#t1Logout#></button> <button type="button" id="reboto_btn" class="btn btn-mini" style="height: 21px; outline:0;" onclick="reboot();"><i class="icon icon-off"></i></button></td></tr>\n';
    banner_code += '</tbody>\n';
    banner_code += '</table>\n';
    banner_code += '</div>\n';
    banner_code += '</div>\n';
    banner_code += '</div>\n';
    banner_code += '</div>\n';
    banner_code += '</div>\n';

    banner_code +='</td></tr></table>\n';

    $("TopBanner").innerHTML = banner_code;

    show_loading_obj();

    id_of_check_changed_status = setTimeout('hideLoading();', 3000);

    //show_time();
    show_top_status();
}


var tabtitle = new Array(10);
tabtitle[0] = new Array("", "<#menu5_1_1#>", "<#menu5_1_2#>", "<#menu5_1_3#>", "<#menu5_1_4#>", "<#menu5_1_5#>", "<#menu5_1_6#>");
tabtitle[1] = new Array("", "<#menu5_1_1#>", "<#menu5_1_2#>", "<#menu5_1_3#>", "<#menu5_1_4#>", "<#menu5_1_5#>", "<#menu5_1_6#>");
tabtitle[2] = new Array("", "<#menu5_2_1#>", "<#menu5_2_2#>", "<#menu5_2_3#>", "<#menu5_2_4#>", "<#menu5_2_5#>", "Wake-on-LAN");
tabtitle[3] = new Array("", "<#menu5_3_1#>", "<#menu5_3_4#>", "<#menu5_3_5#>", "<#menu5_3_6#>");
tabtitle[4] = new Array("", "IPv6");
tabtitle[5] = new Array("", "<#menu5_5_1#>", "<#menu5_5_5#>", "<#menu5_5_2#>", "<#menu5_5_3#>", "<#menu5_5_4#>");
tabtitle[6] = new Array("", "<#menu5_4_3#>", "<#menu5_4_1#>", "<#menu5_4_2#>", "<#menu5_4_4#>", "<#menu5_4_5#>");
tabtitle[7] = new Array("", "<#menu5_6_2#>", "<#menu5_6_6#>", "<#menu5_6_1#>", "<#menu5_6_3#>", "<#menu5_6_4#>", "<#menu5_6_5#>");
tabtitle[8] = new Array("", "<#menu5_11#>", "<#menu5_12#>", "WAN", "LAN1", "LAN2", "LAN3", "LAN4");
tabtitle[9] = new Array("", "<#menu5_7_2#>", "<#menu5_7_3#>", "<#menu5_7_5#>", "<#menu5_7_6#>", "<#menu5_7_8#>");

//Level 3 Tab title
var tablink = new Array(10);
tablink[0] = new Array("", "Advanced_Wireless2g_Content.asp", "Advanced_WGuest2g_Content.asp", "Advanced_WMode2g_Content.asp", "Advanced_ACL2g_Content.asp", "Advanced_WSecurity2g_Content.asp", "Advanced_WAdvanced2g_Content.asp");
tablink[1] = new Array("", "Advanced_Wireless_Content.asp", "Advanced_WGuest_Content.asp", "Advanced_WMode_Content.asp", "Advanced_ACL_Content.asp", "Advanced_WSecurity_Content.asp", "Advanced_WAdvanced_Content.asp");
tablink[2] = new Array("", "Advanced_LAN_Content.asp", "Advanced_DHCP_Content.asp", "Advanced_GWStaticRoute_Content.asp", "Advanced_IPTV_Content.asp", "Advanced_Switch_Content.asp", "Advanced_WOL_Content.asp");
tablink[3] = new Array("", "Advanced_WAN_Content.asp", "Advanced_VirtualServer_Content.asp", "Advanced_Exposed_Content.asp", "Advanced_ASUSDDNS_Content.asp");
tablink[4] = new Array("", "Advanced_IPv6_Content.asp");
tablink[5] = new Array("", "Advanced_BasicFirewall_Content.asp", "Advanced_Netfilter_Content.asp", "Advanced_URLFilter_Content.asp", "Advanced_MACFilter_Content.asp", "Advanced_Firewall_Content.asp");
tablink[6] = new Array("", "Advanced_AiDisk_others.asp", "Advanced_AiDisk_samba.asp", "Advanced_AiDisk_ftp.asp", "Advanced_Modem_others.asp", "Advanced_Printer_others.asp");
tablink[7] = new Array("", "Advanced_System_Content.asp", "Advanced_Tweaks_Content.asp","Advanced_OperationMode_Content.asp", "Advanced_FirmwareUpgrade_Content.asp", "Advanced_SettingBackup_Content.asp", "Main_AdmStatus_Content.asp");
tablink[8] = new Array("", "Main_WStatus2g_Content.asp", "Main_WStatus_Content.asp", "Main_EStatusW_Content.asp", "Main_EStatusL1_Content.asp", "Main_EStatusL2_Content.asp", "Main_EStatusL3_Content.asp", "Main_EStatusL4_Content.asp");
tablink[9] = new Array("", "Main_LogStatus_Content.asp", "Main_DHCPStatus_Content.asp", "Main_IPTStatus_Content.asp", "Main_RouteStatus_Content.asp", "Main_CTStatus_Content.asp");

//Level 2 Menu
menuL2_title = new Array("", "<#menu5_11#>", "<#menu5_12#>", "<#menu5_2#>", "<#menu5_3#>", "IPv6", "<#menu5_5#>", "<#menu5_4#>", "<#menu5_6#>", "<#menu5_9#>", "<#menu5_7#>");
menuL2_link  = new Array("", tablink[0][1], tablink[1][1], tablink[2][1], tablink[3][1], tablink[4][1], tablink[5][1], tablink[6][1], tablink[7][1], tablink[8][1], tablink[9][1]);

//Level 1 Menu in Gateway, Router mode
menuL1_title = new Array("", "<#menu1#>", "<#menu3#>", "<#menu2#>", "<#menu6#>", "<#menu4#>", "<#menu5_8#>", "<#menu5#>");
menuL1_link = new Array("", "index.asp", "aidisk.asp", "vpnsrv.asp", "vpncli.asp", "Main_TrafficMonitor_realtime.asp", "Advanced_System_Info.asp", "as.asp");
menuL1_icon = new Array("", "icon-home", "icon-hdd", "icon-retweet", "icon-globe", "icon-tasks", "icon-random", "icon-wrench");

function show_menu(L1, L2, L3){
	if(sw_mode == '4'){
		tablink[3].splice(2,2);
		tabtitle[3].splice(2,2);
	}

	if(sw_mode == '3'){
		tabtitle[2].splice(2,3);//LAN
		tabtitle[3].splice(1,4);//WAN
		tabtitle[4].splice(1,1);//IPv6
		tabtitle[5].splice(1,5);//firewall
		tabtitle[6].splice(4,1);//USB
		tabtitle[9].splice(2,4);//log

		tablink[2].splice(2,3);
		tablink[2][1] = "Advanced_APLAN_Content.asp";
		menuL2_link[3] = "Advanced_APLAN_Content.asp";
		tablink[3].splice(1,4);
		tablink[4].splice(1,1);
		tablink[5].splice(1,5);
		tablink[6].splice(4,1);
		tablink[9].splice(2,4);

		menuL2_link[4] = "";  //remove WAN
		menuL2_title[4] = "";
		menuL2_link[5] = "";  //remove IPv6
		menuL2_title[5] = "";
		menuL2_link[6] = "";  //remove Firewall
		menuL2_title[6] = "";

		menuL1_link[2] = "";  //remove AiDisk;
		menuL1_title[2] = "";
		menuL1_link[3] = "";  //remove VPN svr
		menuL1_title[3] = "";
		menuL1_link[4] = "";  //remove VPN cli
		menuL1_title[4] = "";
		menuL1_link[5] = "";  //remove Traffic
		menuL1_title[5] = "";

		menuL2_link[2] = tablink[1][1];
		menuL2_link[8] = tablink[7][1];
	}

	if(!support_5g_radio()){
		menuL2_link[2] = "";  //remove 5GHz
		menuL2_title[2] = "";
		tabtitle[1].splice(1,6);
		tablink[1].splice(1,6);
		tabtitle[8].splice(2,1);
		tablink[8].splice(2,1);
	}

	if(!support_ipv6()){
		menuL2_link[5] = "";  //remove IPv6
		menuL2_title[5] = "";
	}

	if(!found_app_smbd() && !found_app_ftpd()){
		tabtitle[6].splice(2,2);
		tablink[6].splice(2,2);
		menuL1_link[2] = "";  //remove AiDisk
		menuL1_title[2] = "";
	}
	else if(!found_app_smbd()){
		tabtitle[6].splice(2,1);
		tablink[6].splice(2,1);
	}
	else if(!found_app_ftpd()){
		tabtitle[6].splice(3,1);
		tablink[6].splice(3,1);
		menuL1_link[2] = "";  //remove AiDisk
		menuL1_title[2] = "";
	}

	for(i = 1; i <= menuL1_title.length-1; i++){
		if(menuL1_title[i] == "")
			continue;
		else if(L1 == i && L2 <= 0){
			menu1_code += '<li class="active" id="option'+i+'"><a href="javascript:;"><i class="'+menuL1_icon[i]+'"></i>&nbsp;&nbsp;'+menuL1_title[i]+'</a></li>\n';
		}
		else{
			menu1_code += '<li id="option'+i+'"><a href="'+menuL1_link[i]+'" title="'+menuL1_link[i]+'"><i class="'+menuL1_icon[i]+'"></i>&nbsp;&nbsp;'+menuL1_title[i]+'</a></li>\n';
		}
	}
	
	$("mainMenu").innerHTML = menu1_code;
	
	for(var i = 1; i <= menuL2_title.length-1; ++i){
		if(menuL2_title[i] == "")
			continue;
		else if(L2 == i)
			menu2_code += '<a href="javascript: void(0)" style="color: #005580; font-weight: bold"><i class="icon-minus"></i>&nbsp;&nbsp;'+menuL2_title[i]+'</a>\n';
		else
			menu2_code += '<a href="'+menuL2_link[i]+'"><i class="icon-minus"></i>&nbsp;&nbsp;'+menuL2_title[i]+'</a>\n';
	}
	$("subMenu").innerHTML = menu2_code;

	if(L3){
		tab_code = '<ul class="nav nav-tabs" style="margin-bottom: 0px;">\n';
		for(var i = 1; i < tabtitle[L2-1].length; ++i){
			if(tabtitle[L2-1][i] == "")
				continue;
			else if(L3 == i)
				tab_code += '<li class="active"><a href="javascript: void(0)">'+ tabtitle[L2-1][i] +'</a></li>\n';
			else
				tab_code += '<li><a href="' +tablink[L2-1][i]+ '">'+ tabtitle[L2-1][i] +'</a></li>\n';
		}
		tab_code += '</ul>\n';
		$("tabMenu").innerHTML = tab_code;
	}
	else
		$("tabMenu").innerHTML = "";
}

function show_footer(){
	footer_code = '<div align="center" class="bottom-image"></div>\n';
	footer_code +='<div align="center" class="copyright"><#footer_copyright_desc#></div>\n';

	$("footer").innerHTML = footer_code;

	flash_button();
}

function show_top_status(){
	showtext($("firmver"), '<% nvram_get_x("",  "firmver_sub"); %>');
	
	/*if(sw_mode == "3")
		$("sw_mode_span").innerHTML = "AP";
	else
		$("sw_mode_span").innerHTML = "Router";*/
}

function go_setting(band){
	if(band == "2")
		location.href = "Advanced_Wireless2g_Content.asp";
	else
		location.href = "Advanced_Wireless_Content.asp";
}

function go_wguest(band){
	if(band == "2")
		location.href = "Advanced_WGuest2g_Content.asp";
	else
		location.href = "Advanced_WGuest_Content.asp";
}

function show_time(){	
	JS_timeObj.setTime(systime_millsec); // Add millsec to it.	
	JS_timeObj3 = JS_timeObj.toString();	
	JS_timeObj3 = checkTime(JS_timeObj.getHours()) + ":" +
				  			checkTime(JS_timeObj.getMinutes()) + ":" +
				  			checkTime(JS_timeObj.getSeconds());
	$('systemtime').innerHTML ="<a href='/Advanced_System_Content.asp'>" + JS_timeObj3 + "</a>";
	systime_millsec += 1000;		
	
	stime_ID = setTimeout("show_time();", 1000);
}

function checkTime(i)
{
if (i<10) 
  {i="0" + i}
  return i
}

function show_loading_obj(){
	var obj = $("Loading");
	var code = "";

    code += '<center><div id="loadingBlock" class="loadingBlock">';
    code += '<div class="container-fluid">';
    code += '<div class="well" style="background-color: #212121; width: 60%;">';
    code += '<div class="progress progress-striped active" style="width: 50%; text-align: left;"><div class="bar" id="proceeding_bar" style="width: 0%;"><span id="proceeding_txt"></span></div></div>';
    code += '<span id="proceeding_main_txt"><#Main_alert_proceeding_desc4#></span></span>';
    code += '</div>';
    code += '</div>';
    code += '</div></center>';

	obj.innerHTML = code;
}

var nav;

if(navigator.appName == 'Netscape')
	nav = true;
else{
	nav = false;
	document.onkeydown = MicrosoftEventHandler_KeyDown;
}

function MicrosoftEventHandler_KeyDown(){
	return true;
}

function submit_language(){
	if($("select_lang").value != $("preferred_lang").value){
		showLoading();
		
		with(document.titleForm){
			action = "/start_apply.htm";
			
			if(location.pathname == "/")
				current_page.value = "/index.asp";
			else
				current_page.value = location.pathname;
			
			preferred_lang.value = $("select_lang").value;
			flag.value = "set_language";
			
			submit();
		}
	}
}

function logout(){
	if(confirm('<#JS_logout#>')){
		setTimeout('location = "Logout.asp";', 1);
	}
}

function reboot(){
	if(confirm("<#Main_content_Login_Item7#>")){
		if(window.frames["statusframe"] && window.frames["statusframe"].stopFlag == 0){
			window.frames["statusframe"].stopFlag = 1;
		}
		showLoading(40);
		setTimeout("location.href = '/index.asp';", 40000);
		$("hidden_frame").src = "Reboot.asp";
	}
}

function commit(){
	if(!confirm('<#Commit_confirm#>'))
		return;
	var $j = jQuery.noConflict();
	$j.getJSON('/nvram_action.asp', {nvram_action: "commit_nvram"},
	function(response){
		var respRes = (response != null && typeof response === 'object' && "nvram_result" in response)
				? response.nvram_result : -1;
		
		var $respBtn = $j("#commit_btn");
		
		if(respRes != 0){
			$respBtn.removeClass('alert-success')
			.addClass('alert-error');
		}else{
			$respBtn.removeClass('alert-error')
			.addClass('alert-success');
		}
		
		var idTimeOut = setTimeout(function(){
			clearTimeout(idTimeOut);
			$respBtn.removeClass('alert-success')
			.removeClass('alert-error');
		}, 1500);
	});
}

function clearlog(){
	var $j = jQuery.noConflict();
	$j.post('/apply.cgi',
	{
		'current_page': 'Main_LogStatus_Content.asp',
		'action_mode': ' Clear '
	});
	setLogData();
}

function kb_to_gb(kilobytes){
	if(typeof(kilobytes) == "string" && kilobytes.length == 0)
		return 0;
	
	return (kilobytes*1024)/(1024*1024*1024);
}

function simpleNum(num){
	if(typeof(num) == "string" && num.length == 0)
		return 0;
	
	return parseInt(kb_to_gb(num)*1000)/1000;
}

function simpleNum2(num){
	if(typeof(num) == "string" && num.length == 0)
		return 0;
	
	return parseInt(num*1000)/1000;
}

function simpleNum3(num){
	if(typeof(num) == "string" && num.length == 0)
		return 0;
	
	return parseInt(num)/1024;
}

function $(){
	var elements = new Array();
	
	for(var i = 0; i < arguments.length; ++i){
		var element = arguments[i];
	if(typeof element == 'string')
		element = document.getElementById(element);
		
		if(arguments.length == 1)
			return element;
		
		elements.push(element);
	}
	
	return elements;
}

function getElementsByName_iefix(tag, name){
	var tagObjs = document.getElementsByTagName(tag);
	var objsName;
	var targetObjs = new Array();
	var targetObjs_length;
	
	if(!(typeof(name) == "string" && name.length > 0))
		return [];
	
	for(var i = 0, targetObjs_length = 0; i < tagObjs.length; ++i){
		objsName = tagObjs[i].getAttribute("name");
		
		if(objsName && objsName.indexOf(name) == 0){
			targetObjs[targetObjs_length] = tagObjs[i];
			++targetObjs_length;
		}
	}
	
	return targetObjs;
}

function getElementsByClassName_iefix(tag, name){
	var tagObjs = document.getElementsByTagName(tag);
	var objsName;
	var targetObjs = new Array();
	var targetObjs_length;
	
	if(!(typeof(name) == "string" && name.length > 0))
		return [];
	
	for(var i = 0, targetObjs_length = 0; i < tagObjs.length; ++i){
		if(navigator.appName == 'Netscape')
			objsName = tagObjs[i].getAttribute("class");
		else
			objsName = tagObjs[i].getAttribute("className");
		
		if(objsName == name){
			targetObjs[targetObjs_length] = tagObjs[i];
			++targetObjs_length;
		}
	}
	
	return targetObjs;
}

function showtext(obj, str){
	if(obj)
		obj.innerHTML = str;//*/
}

function showhtmlspace(ori_str){
	var str = "", head, tail_num;
	
	head = ori_str;
	while((tail_num = head.indexOf(" ")) >= 0){
		str += head.substring(0, tail_num);
		str += "&nbsp;";
		
		head = head.substr(tail_num+1, head.length-(tail_num+1));
	}
	str += head;
	
	return str;
}

function showhtmland(ori_str){
	var str = "", head, tail_num;
	
	head = ori_str;
	while((tail_num = head.indexOf("&")) >= 0){
		str += head.substring(0, tail_num);
		str += "&amp;";
		
		head = head.substr(tail_num+1, head.length-(tail_num+1));
	}
	str += head;
	
	return str;
}

// A dummy function which just returns its argument. This was needed for localization purpose
function translate(str){
	return str;
}

function trim(val){
	val = val+'';
	for (var startIndex=0;startIndex<val.length && val.substring(startIndex,startIndex+1) == ' ';startIndex++);
	for (var endIndex=val.length-1; endIndex>startIndex && val.substring(endIndex,endIndex+1) == ' ';endIndex--);
	return val.substring(startIndex,endIndex+1);
}

function IEKey(){
	return event.keyCode;
}

function NSKey(){
	return 0;
}

function is_string(o){
	if(!nav)
		keyPressed = IEKey();
	else
		keyPressed = NSKey();
	
	if(keyPressed == 0)
		return true;
	else if(keyPressed >= 0 && keyPressed <= 126)
		return true;
	
	alert('<#JS_validchar#>');
	return false;
}

function validate_string(string_obj, flag){
	if(string_obj.value.charAt(0) == '"'){
		if(flag != "noalert")
			alert('<#JS_validstr1#> ["]');
		
		string_obj.value = "";
		string_obj.focus();
		
		return false;
	}
	else{
		invalid_char = "";
		
		for(var i = 0; i < string_obj.value.length; ++i){
			if(string_obj.value.charAt(i) < ' ' || string_obj.value.charAt(i) > '~'){
				invalid_char = invalid_char+string_obj.value.charAt(i);
			}
		}
		
		if(invalid_char != ""){
			if(flag != "noalert")
				alert("<#JS_validstr2#> '"+invalid_char+"' !");
			string_obj.value = "";
			string_obj.focus();
			
			return false;
		}
	}
	
	return true;
}

function validate_hex(obj){
	var obj_value = obj.value
	var re = new RegExp("[^a-fA-F0-9]+","gi");
	
	if(re.test(obj_value))
		return false;
	else
		return true;
}

function validate_psk(psk_obj){
	var psk_length = psk_obj.value.length;
	
	if(psk_length < 8){
		alert("<#JS_passzero#>");
		psk_obj.value = "00000000";
		psk_obj.focus();
		psk_obj.select();
		
		return false;
	}
	
	if(psk_length > 64){
		alert("<#JS_PSK64Hex#>");
		psk_obj.value = psk_obj.value.substring(0, 64);
		psk_obj.focus();
		psk_obj.select();
		
		return false;
	}
	
	if(psk_length >= 8 && psk_length <= 63 && !validate_string(psk_obj)){
		alert("<#JS_PSK64Hex#>");
		psk_obj.value = "00000000";
		psk_obj.focus();
		psk_obj.select();
		
		return false;
	}
	
	if(psk_length == 64 && !validate_hex(psk_obj)){
		alert("<#JS_PSK64Hex#>");
		psk_obj.value = "00000000";
		psk_obj.focus();
		psk_obj.select();
		
		return false;
	}
	
	return true;
}

function checkDuplicateName(newname, targetArray){
	var existing_string = targetArray.join(',');
	existing_string = ","+existing_string+",";
	var newstr = ","+trim(newname)+",";
	
	var re = new RegExp(newstr, "gi");
	var matchArray = existing_string.match(re);
	
	if(matchArray != null)
		return true;
	else
		return false;
}

function alert_error_msg(error_msg){
	alert(error_msg);
	refreshpage();
}

function refreshpage(seconds){
	if(typeof(seconds) == "number")
		setTimeout("refreshpage()", seconds*1000);
	else
		location.href = location.href;
}

function hideLinkTag(){
	if(document.all){
		var tagObjs = document.all.tags("a");
		
		for(var i = 0; i < tagObjs.length; ++i)
			tagObjs(i).outerHTML = tagObjs(i).outerHTML.replace(">"," hidefocus=true>");
	}
}

function buttonOver(o){	//Lockchou 1206 modified
	o.style.color = "#FFFFFF";
	o.style.background = "url(/images/bgaibutton.gif) #ACCCE1";
	o.style.cursor = "hand";
}

function buttonOut(o){	//Lockchou 1206 modified
	o.style.color = "#000000";
	o.style.background = "url(/images/bgaibutton0.gif) #ACCCE1";
}

function flash_button(){
	if(navigator.appName.indexOf("Microsoft") < 0)
		return;
	
	var btnObj = getElementsByClassName_iefix("input", "button");
	
	for(var i = 0; i < btnObj.length; ++i){
		btnObj[i].onmouseover = function(){
				buttonOver(this);
			};
		
		btnObj[i].onmouseout = function(){
				buttonOut(this);
			};
	}
}

function no_flash_button(){
	if(navigator.appName.indexOf("Microsoft") < 0)
		return;
	
	var btnObj = getElementsByClassName_iefix("input", "button");
	
	for(var i = 0; i < btnObj.length; ++i){
		btnObj[i].onmouseover = "";
		
		btnObj[i].onmouseout = "";
	}
}

function gotoprev(formObj){
	var prev_page = formObj.prev_page.value;
	
	if(prev_page == "/")
		prev_page = "/index.asp";
	
	if(prev_page.indexOf('QIS') < 0){
		formObj.action = prev_page;
		formObj.target = "_parent";
		formObj.submit();
	}
	else{
		formObj.action = prev_page;
		formObj.target = "";
		formObj.submit();
	}
}

function add_option(selectObj, str, value, selected){
	var tail = selectObj.options.length;
	
	if(typeof(str) != "undefined")
		selectObj.options[tail] = new Option(str);
	else
		selectObj.options[tail] = new Option();
	
	if(typeof(value) != "undefined")
		selectObj.options[tail].value = value;
	else
		selectObj.options[tail].value = "";
	
	if(selected == 1)
		selectObj.options[tail].selected = selected;
}

function free_options(selectObj){
	if(selectObj == null)
		return;
	
	for(var i = selectObj.options.length-1; i >= 0; --i){
		selectObj.options[i].value = null;
		selectObj.options[i] = null;
	}
}

function blocking(obj_id, show){
	var state = show?'block':'none';
	
	if(document.getElementById)
		$(obj_id).style.display = state;
	else if(document.layers)
		document.layers[obj_id].display = state;
	else if(document.all)
		document.all[obj_id].style.display = state;
}

function inputCtrl(obj, flag){
	if(flag == 0){
		obj.disabled = true;
	}
	else{
		obj.disabled = false;
	}
}

// add eagle23
jQuery(document).ready(function() {
    var $j = jQuery.noConflict();

    $j("#logo").click(function(){
        location.href = '/';
    });

    // tabindex navigation
    $j(function(){
        var tabindex = 1;
        $j('input,select').each(function() {
            if (this.type != "hidden"  && this.type != 'radio') {
                var $input = $j(this);
                $input.attr("tabindex", tabindex);
                tabindex++;
            }
        });
    });

    var idFindSyslogPanel = setInterval(function(){
        if(is_mobile){
            clearInterval(idFindSyslogPanel);
        }else if($j('.syslog_panel').size() > 0){
            clearInterval(idFindSyslogPanel);

            var offsetLeft = $j('.wrapper').offset().left;
            $j('.syslog_panel').css({opacity: 1});
            $j('.syslog_panel').tabSlideOut({
                tabHandle: '.handle',
                imageHeight: '20px',
                imageWidth: '62px',
                tabLocation: 'top',
                speed: 300,
                action: 'click',
                topPos: '400px',
                leftPos: (offsetLeft+5)+'px',
                fixedPosition: true
            });

            setLogData();
            showClockLogArea();
        }
    }, 100);
});

// fix for ie
String.prototype.nl2br = function()
{
    return this.replace(/\n/g, "\n\r");
}

var idUpdateLogArea;
function updateLogArea()
{
    idUpdateLogArea = setTimeout(function(){
        setLogData();
    }, 5000);
}

/**
 * Local Storage HTML5 Standart
 * http://www.w3.org/TR/webstorage/
 */
/**
 * ckeck if localStorage available
 * @return void
 */
function isLocalStorageAvailable()
{
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

/**
 * set value to localStorage
 * @param name string
 * @param value mixed
 */
function setToLocalStorage(name, value)
{
    if(isLocalStorageAvailable())
    {
        try {
            localStorage.setItem(name, value);
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                console.info('Local storage full');
            }
        }
    }
}

/**
 * get from localStorage
 * @param name
 * @return mixed
 */
function getFromLocalStorage(name)
{
    if(isLocalStorageAvailable())
    {
        return localStorage.getItem(name);
    }
}

/**
 * remove from localStorage
 * @param name
 * @return void
 */
function removeFromLocalStorage(name)
{
    if(isLocalStorageAvailable())
    {
        localStorage.removeItem(name);
    }
}

var curItemsLog, oldItemsLog = 0;
function setLogData()
{
    // get syslog
    jQuery.get('/log_content.asp', function(data){

        clearTimeout(idUpdateLogArea);

        var log = data;

        // fix for ie
        if(jQuery.browser.msie && !is_ie11p)
            log = log.nl2br();

        // remember scroll position
        if(jQuery("#log_area").val() == '')
        {
            jQuery("#log_area").text(log);
            jQuery("#log_area").prop('scrollTop', jQuery("#log_area").prop('scrollHeight'));
        }
        else
        {
            var scrTop = jQuery("#log_area").prop('scrollTop');
            jQuery("#log_area").text(log);
            jQuery("#log_area").prop('scrollTop', scrTop);
        }

        oldItemsLog = getFromLocalStorage('log_length') == null ? 0 :  getFromLocalStorage('log_length');
        curItemsLog = jQuery('#log_area').val().split('\n').length;

        var curText = 'Log';
        // show important if log_area not opened
        if(!jQuery('.syslog_panel').hasClass('open'))
        {
            curText += '  <span class="label label-important">!</span>';
        }

        if(curItemsLog != oldItemsLog )
        {
            jQuery(".log_text").html(curText);
        }

        updateLogArea();
    });
}

function showClockLogArea(){

    if(jQuery('#system_time').size() == 0)
    {
        JS_timeObj.setTime(systime_millsec);
        systime_millsec += 1000;

        JS_timeObj2 = JS_timeObj.toString();
        JS_timeObj2 = JS_timeObj2.substring(0,3) + ", " +
        JS_timeObj2.substring(4,10) + "  " +
        checkTime(JS_timeObj.getHours()) + ":" +
        checkTime(JS_timeObj.getMinutes()) + ":" +
        checkTime(JS_timeObj.getSeconds()) + "  " +
        JS_timeObj.getFullYear() + " GMT" + timezone;
    }

    jQuery("#system_time_log_area").html(JS_timeObj2);
    setTimeout("showClockLogArea()", 1000);
}

function onCompleteSlideOutLogArea()
{
    var idTimeout = setTimeout(function(){
        clearTimeout(idTimeout);

        removeFromLocalStorage('log_length');
        setToLocalStorage('log_length', curItemsLog);
        jQuery(".log_text").html('Log');

    }, 1500);
}

function passwordShowHide(id)
{
    var obj = $j('#'+id);
    var changeTo = (obj.attr('type') == 'password') ? 'text' : 'password';
    if ($j.browser.msie && parseInt($j.browser.version, 10) < 9){
        var marker = $j('<span />').insertBefore('#'+id);
        obj.detach().attr('type', changeTo).insertAfter(marker);
        marker.remove();
    }else{
        document.getElementById(id).type = changeTo;
    }
}

(function($){
    var $j = $.noConflict();
    $j.fn.tabSlideOut = function(callerSettings) {
        var settings =  $j.extend({
            tabHandle: '.handle',
            speed: 300,
            action: 'click',
            tabLocation: 'left',
            topPos: '200px',
            leftPos: '20px',
            fixedPosition: false,
            positioning: 'absolute',
            pathToTabImage: null,
            imageHeight: null,
            imageWidth: null
        }, callerSettings||{});

        settings.tabHandle =  $j(settings.tabHandle);
        var obj = this;
        if (settings.fixedPosition === true) {
            settings.positioning = 'fixed';
        } else {
            settings.positioning = 'absolute';
        }

        //ie6 doesn't do well with the fixed option
        if (document.all && !window.opera && !window.XMLHttpRequest) {
            settings.positioning = 'absolute';
        }

        //set initial tabHandle css
        settings.tabHandle.css({
            'display': 'block',
            'width' : settings.imageWidth,
            'height': settings.imageHeight,
            //'textIndent' : '-99999px',
            //'background' : 'url('+settings.pathToTabImage+') no-repeat',
            'outline' : 'none',
            'position' : 'absolute',
            'border-radius': '0px 0px 4px 4px',
            'background-color': '#f5f5f5',
            'border-left': '1px solid #ddd',
            'border-right': '1px solid #ddd',
            'border-bottom': '1px solid #ddd'
        });

        obj.css({
            'line-height' : '1',
            'position' : settings.positioning
        });


        var properties = {
            containerWidth: parseInt(obj.outerWidth(), 10) + 'px',
            containerHeight: parseInt(obj.outerHeight(), 10) + 'px',
            tabWidth: parseInt(settings.tabHandle.outerWidth(), 10) + 'px',
            tabHeight: parseInt(settings.tabHandle.outerHeight(), 10) + 'px'
        };

        //set calculated css
        if(settings.tabLocation === 'top' || settings.tabLocation === 'bottom') {
            obj.css({'left' : settings.leftPos});
            settings.tabHandle.css({'right' : -1});
        }

        if(settings.tabLocation === 'top') {
            obj.css({'top' : '-' + properties.containerHeight});
            settings.tabHandle.css({'bottom' : '-' + properties.tabHeight});
        }

        if(settings.tabLocation === 'bottom') {
            obj.css({'bottom' : '-' + properties.containerHeight, 'position' : 'fixed'});
            settings.tabHandle.css({'top' : '-' + properties.tabHeight});

        }

        if(settings.tabLocation === 'left' || settings.tabLocation === 'right') {
            obj.css({
                'height' : properties.containerHeight,
                'top' : settings.topPos
            });

            settings.tabHandle.css({'top' : 0});
        }

        if(settings.tabLocation === 'left') {
            obj.css({ 'left': '-' + properties.containerWidth});
            settings.tabHandle.css({'right' : '-' + properties.tabWidth});
        }

        if(settings.tabLocation === 'right') {
            obj.css({ 'right': '-' + properties.containerWidth});
            settings.tabHandle.css({'left' : '-' + properties.tabWidth});

            $j('html').css('overflow-x', 'hidden');
        }

        //functions for animation events

        settings.tabHandle.click(function(event){
            event.preventDefault();
        });

        var slideIn = function() {

            if (settings.tabLocation === 'top') {
                obj.animate({top:'-' + properties.containerHeight}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'left') {
                obj.animate({left: '-' + properties.containerWidth}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'right') {
                obj.animate({right: '-' + properties.containerWidth}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'bottom') {
                obj.animate({bottom: '-' + properties.containerHeight}, settings.speed).removeClass('open');
            }

        };

        var slideOut = function() {

            if (settings.tabLocation == 'top') {
                obj.animate({top:'-3px'},  settings.speed, onCompleteSlideOutLogArea()).addClass('open');
            } else if (settings.tabLocation == 'left') {
                obj.animate({left:'-3px'},  settings.speed, onCompleteSlideOutLogArea()).addClass('open');
            } else if (settings.tabLocation == 'right') {
                obj.animate({right:'-3px'},  settings.speed, onCompleteSlideOutLogArea()).addClass('open');
            } else if (settings.tabLocation == 'bottom') {
                obj.animate({bottom:'-3px'},  settings.speed, onCompleteSlideOutLogArea()).addClass('open');
            }
        };

        var clickScreenToClose = function() {
            obj.click(function(event){
                event.stopPropagation();
            });

            $j(document).click(function(){
                slideIn();
            });
        };

        var clickAction = function(){
            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    slideIn();
                } else {
                    slideOut();
                }
            });

            clickScreenToClose();
        };

        var hoverAction = function(){
            obj.hover(
                function(){
                    slideOut();
                },

                function(){
                    slideIn();
                });

            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    slideIn();
                }
            });
            clickScreenToClose();

        };

        //choose which type of action to bind
        if (settings.action === 'click') {
            clickAction();
        }

        if (settings.action === 'hover') {
            hoverAction();
        }
    };
})(jQuery);
