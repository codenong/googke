var lr = 'lang_zh-CN|lang_zh-TW';
var tbs = 'x';

function sprintf(format, etc)
{
    var arg = arguments;
    var i = 1;
    return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] })
}

function strncasecmp(argStr1, argStr2, len) {
  var diff, i = 0;
  var str1 = (argStr1 + '')
    .toLowerCase()
    .substr(0, len);
  var str2 = (argStr2 + '')
    .toLowerCase()
    .substr(0, len);

  if (str1.length !== str2.length) {
    if (str1.length < str2.length) {
      len = str1.length;
      if (str2.substr(0, str1.length) == str1) {
        // return the difference of chars
        return str1.length - str2.length;
      }
    } else {
      len = str2.length;
      // str1 is longer than str2
      if (str1.substr(0, str2.length) == str2) {
        // return the difference of chars
        return str1.length - str2.length;
      }
    }
  } else {
    // Avoids trying to get a char that does not exist
    len = str1.length;
  }

  for (diff = 0, i = 0; i < len; i++) {
    diff = str1.charCodeAt(i) - str2.charCodeAt(i);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function strcasestr(argStr1, argStr2)
{
    var str1 = (argStr1 + '').toLowerCase();
    var str2 = (argStr2 + '').toLowerCase();
    return str1.indexOf(str2);
}


function formatNumber(num, precision, separator)
{
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
        // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
        // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
        // 的值变成了 12312312.123456713
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

        return parts.join('.');
    }
    return NaN;
}

/**
* google 分页
* @param curpage 当前页
* @param shownum 页面显示的页数
* @param pages      实际页数
* @return
*/

function pagessplit(curpage, shownum, pages)
{
    var swindow = shownum / 2;
    var end_index, middle_index = curpage;
    var p = false;
    var n = false;

    var start_index = middle_index - swindow;
    if (start_index>0)
    {
        end_index = start_index + shownum;
        p = (start_index>1);
    }

    if (start_index<=0)
    {
        start_index = 0;
        end_index = start_index + shownum;
        p = false;
    }

    if (end_index>=pages)
    {
        end_index = pages;
    }
    else
    {
        n = (end_index<pages);
    }

    return {begin:start_index, end:end_index, previous:p, next:n};
}

var isIE = function(ver){
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return (b.getElementsByTagName('i').length === 1);
}

function parse_url(uri)
{
    var host = '#';
    if (uri.length>0)
    {
        if ((strncasecmp(uri, "http://", 7) == 0) || (strncasecmp(uri, "https://", 8) == 0))
        {
            var urlparser = new Poly9.URLParser(uri);
            host = urlparser.getHost();
        }
        else
        {
            var len = 7;
            var d = strcasestr(uri, "http://");
            if (d == -1)
            {
                len = 8;
                d = strcasestr(uri, "https://");
            }

            var url2 = uri.substr(d, uri.length - d);
            if (url2.length>0)
            {
                var urlparser = new Poly9.URLParser(url2);
                host = urlparser.getHost();
            }

        }
    }

    return host;
}

function valid_link(s)
{
    // /interstitial?url=http://btlove.net/tag/1.html
    var pos = s.indexOf('/interstitial?url=http');
    if (pos<0)
    {
        return s;
    }

    var s1 = s.substr(18);
    return s1;
}

function byId(x)
{
    return document.getElementById(x);
}

function make_query_link(q)
{
    var qs = '';
    var filter = '';
    var qstring = q;
    var site_flag = (qstring.length>5? qstring.substr(0, 5).toLowerCase() : '');
    if (site_flag.length>0)
    {
        if (site_flag == "site:")
        {
            var idx = qstring.indexOf(" ");
            if (idx>=0)
            {
                qs += qstring.substr(0, idx-1) + encodeURIComponent(qstring.substr(idx-1, qstring.length-idx+1));
            }
            else
            {
                qs += encodeURIComponent(qstring);
            }
        }
        else
        {
            qs += encodeURIComponent(qstring);
        }
    }
    else
    {
        qs += encodeURIComponent(qstring);
    }

    return sprintf("q=%s", qs);
}

function post(path, params, method, new_window)
{
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    if (new_window)
    {
        form.setAttribute("target", "_blank");
    }

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}

function make_tbs(t)
{
    var s = (t != 'x') ? sprintf("tbs=qdr:%s", t) : "tbas=0";
    return s;
}

function do_submit_form(uri, q)
{
    if (typeof(q) != 'undefined' && q.value.length>0)
    {
        var pass = create_pass();
        var json = sprintf("%s&lr=%s&%s", make_query_link(q.value), lr, make_tbs(tbs));
        json = CryptoJS.AES.encrypt(JSON.stringify(json), pass, {format: CryptoJSAesJson}).toString();
        //alert(json);
        post(uri, {'json':json, 'pass': pass});

        //window.alert(link);
        //window.location.href = link;
    }

    return false;
}

function do_goto_page(data, uri)
{
    //var json = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s", lr) + sprintf("&googke_nor=%s", nums_of_result);
    var pass = create_pass();

    data = CryptoJS.AES.encrypt(JSON.stringify(data), pass, {format: CryptoJSAesJson}).toString();
    post(uri, {'json':data, 'pass': pass});

    return false;
}

var image = {
    /*
    goto_page : function (page)
    {
        var json = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s", lr);
        do_goto_page(json, '/image');
        return false;
    },
    */

    goto_page : function (page)
    {
        var data = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid); // + sprintf("&lr=%s", lr);
        var pass = create_pass();

        data = CryptoJS.AES.encrypt(JSON.stringify(data), pass, {format: CryptoJSAesJson}).toString();
        return ({'j':data, 'p': pass});
    },


    check_form : function ()
    {
        return do_submit_form('/image', byId('q'));
    },
};

var lng_opt = [
    { 'id':'lang_zh-CN|lang_zh-TW', 'desc':'中文(简+繁)' },
    { 'id':'lang_zh-CN', 'desc':'中文(简体)' },
    { 'id':'lang_zh-CN|lang_en', 'desc':'中文(简体)+英文' },
    { 'id':'lang_zh-TW', 'desc':'中文(繁体)' },
    { 'id':'lang_zh-TW|lang_en', 'desc':'中文(繁体)+英文' },
    { 'id':'lang_zh-CN|lang_zh-TW|lang_en', 'desc':'中文(简+繁)+英' },
    { 'id':'lang_en', 'desc':'英语' },
    { 'id':'lang_ja', 'desc':'日语' },
    { 'id':'lang_th', 'desc':'泰语' },
    { 'id':'lang_ru', 'desc':'俄语' },
    { 'id':'lang_ko', 'desc':'韩语' },
    { 'id':'lang_nl', 'desc':'荷兰语' },
    { 'id':'lang_iw', 'desc':'希伯来语' },
    { 'id': null, 'desc':null },
];


function create_language_menu_item(lng_opt, def)
{
    var html = '';
    for (var i = 0; lng_opt[i].id != null; ++i)
    {
        if (lng_opt[i].id != def)
        {
            var row = sprintf('<li><a href="#" onclick="return select_language(\'%s\')">%s</a></li>\n', lng_opt[i].id, lng_opt[i].desc);
            html += row;
        }
    }

    return html;
}

function get_language_desc_by_id(lng_opt, idx)
{
    var html = '';
    for (var i = 0; lng_opt[i].id != null; ++i)
    {
        if (lng_opt[i].id == idx)
        {
            return lng_opt[i].desc;
        }
    }

    return '';
}

function create_language_menu(lng_opt)
{
    byId("lng_menu").innerHTML = sprintf("%s&nbsp;<span class=\"caret\"></span>", get_language_desc_by_id(lng_opt, lr));
    byId("lng_menu_item").innerHTML = create_language_menu_item(lng_opt, lr);
   // alert(document.body.clientWidth);
}

var web = {
    search : function(q)
    {
        if (typeof(q) != 'undefined' && q.length>0)
        {
            var pass = create_pass();
            var json = sprintf("q=%s&lr=%s", q, lr);
            json = CryptoJS.AES.encrypt(JSON.stringify(json), pass, {format: CryptoJSAesJson}).toString();
            //alert(json);
            post('/search', {'json':json, 'pass': pass}, 'post', true);

            //window.alert(link);
            //window.location.href = link;

            return false;
        }

        return false;
    },

    search_site : function(host, q)
    {
        if (typeof(q) != 'undefined' && q.length>0)
        {
            var pass = create_pass();
            var json = sprintf("q=%s%20site:%s&lr=%s", q, host, lr);
            json = CryptoJS.AES.encrypt(JSON.stringify(json), pass, {format: CryptoJSAesJson}).toString();
            //alert(json);
            post('/search', {'json':json, 'pass': pass}, 'post', true);

            //window.alert(link);
            //window.location.href = link;

            return false;
        }

        return false;
    },

    search_related : function (url, q)
    {
        //q=related:www.ittribalwo.com/article/2011.html+%E7%BD%91%E9%A1%B5%E5%BF%AB%E7%85%A7&tbo=1&sa=X&ei=-3fdVICOJY30oASe8YKYAQ&ved=0CDQQHzAC

        //var json = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s", lr) + sprintf("&googke_nor=%s", nums_of_result);


        if (typeof(q) != 'undefined' && q.length>0)
        {
            var pass = create_pass();
            var json = sprintf("q=related:%s%20%s&lr=%s&ei=%s&tbo=1&sa=X", url, q, lr, eid);
            json = CryptoJS.AES.encrypt(JSON.stringify(json), pass, {format: CryptoJSAesJson}).toString();
            //alert(json);
            post('/search', {'json':json, 'pass': pass}, 'post', true);

            //window.alert(link);
            //window.location.href = link;

            return false;
        }

        return false;
    },

    //<a href="#" onclick="AddFavorite(window.location,document.title)"> 收藏本站 </a>
    add_favorite : function(sURL, sTitle)
    {
        try
        {
            window.external.addFavorite(sURL, sTitle);
        }
        catch (e)
        {
             try
            {
                 window.sidebar.addPanel(sTitle, sURL, "");
            }
            catch (e)
            {
                 alert("您的浏览器不支持自动添加到收藏，请使用Ctrl+D进行添加");
            }
        }
    },

    // < a onclick="SetHome(this,window.location)" > 设为首页 < /a>
    set_as_home_page : function(url)
    {
        if (document.all)
        {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage(url);

        }
        else if (window.sidebar)
        {
            if (window.netscape)
            {
                try
                {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }
                catch (e)
                {
                    //alert("this action was aviod by your browser，if you want to enable，please enter about:config in your address line,and change the value of signed.applets.codebase_principal_support to true");
                    alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
                }
            }

            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', url);
        }
        else
        {
            alert("您的浏览器不支持自动设为首页，请手动添加");
        }
    },

    set_as_default_search_engine : function ()
    {
        var a = window.external;
        //var a1 = window.sidebar;
        //if ((typeof(a) == "object") &&
        //    (typeof(a.AddSearchProvider) == "function") &&
        //    (typeof(a.IsSearchProviderInstalled) == "function"))
        if (typeof(a) == "object")
        {
            var b=0;
            try
            {
                /*
                0  没有已安装的搜索引擎匹配该url。
                1  一个或多个已安装的搜索引擎匹配该url，但它们都不是用户的默认搜索引擎。
                2  用户的默认搜索引擎匹配该url。

                使用前缀匹配法比较url与已安装的搜索引擎的结果页URL。仅检查域名与调用该方法的脚本相同的结果页。
                */

                b=a.IsSearchProviderInstalled("http://googke.me/");
            }
            catch(e)
            {
                b=0;
                //console.log(e.name);
                //console.log(e.message);
                //console.log(e.description);
            }

            //console.log("isInstalled: "+b);
            if (!b)
            {
                try
                {
                    a.AddSearchProvider("http://googke.me/opensearch/opensearch.xml");
                }
                catch(e)
                {
                    b=0;
                    console.log(e.name);
                    console.log(e.message);
                    console.log(e.description);
                }
            }
        }
        else
        {
            //window.open("http://googke.me/set_as_default_search_engine/");
            alert("您的浏览器不支持自动添加到搜索引擎列表，请手动添加。");
        }
    },

    /*
    goto_page : function (page)
    {
        var json = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s", lr) + sprintf("&googke_nor=%s", nums_of_result);
        do_goto_page(json, '/search');
        return false;
    },
    * */

    goto_page : function (page)
    {
        var pass = create_pass();
        var data = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s&", lr) + make_tbs(tbs);
        if (page>0)
        {
            data += sprintf("&googke_nor=%s", nums_of_result);
        }

        data = CryptoJS.AES.encrypt(JSON.stringify(data), pass, {format: CryptoJSAesJson}).toString();
        return ({'j':data, 'p': pass});
    },

    check_form : function()
    {
        return do_submit_form('/search', byId('q'));
    },
};

function getType(o)
{
    var _t;
    return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
}

function deep_copy(destination,source)
{
    for(var p in source)
    {
        if(getType(source[p])=="array"||getType(source[p])=="object")
        {
            destination[p]=getType(source[p])=="array"?[]:{};
            arguments.callee(destination[p],source[p]);
        }
        else
        {
            destination[p]=source[p];
        }
    }
}

var wangpan = {
    sites : [ {'url': 'pan.baidu.com', 'desc':'百度网盘', 'checked': true} ,
             {'url': 'dbank.com', 'desc':'华为网盘', 'checked': true} ,
             {'url': 'vdisk.weibo.com', 'desc':'微盘', 'checked': true} ,
             {'url': 'wenku.baidu.com', 'desc':'百度文库', 'checked': true} ,
             {'url': 'book118.com', 'desc':'e书联盟', 'checked': true} ,
             {'url': null, 'desc':null, 'checked': true} ,
             ],
    temp_sites : [],
    checked_count : function()
    {
        var k = 0;
        for (var i = 0; this.sites[i].url; ++i)
        {
            k += this.sites[i].checked ? 1 : 0;
        }

        return k;
    },

    to_string : function ()
    {
        var s1 = '';
        for (var i = 0; this.sites[i].url; ++i)
        {
            if (this.sites[i].checked)
            {
                s1 += sprintf("%ssite:%s", (s1.length>0) ? " OR " : "", this.sites[i].url);
            }
        }

        return encodeURIComponent(s1);
    },

    check_form : function()
    {
        var q = byId('q');
        if (typeof(q) != 'undefined' && q.value.length>0)
        {
            var pass = create_pass();
            var json = sprintf("%s&lr=%s&sites=%s", make_query_link(q.value), lr, this.to_string());
            json = CryptoJS.AES.encrypt(JSON.stringify(json), pass, {format: CryptoJSAesJson}).toString();
            //alert(json);
            post('/wangpan', {'json':json, 'pass': pass});

            //window.alert(link);
            //window.location.href = link;

            return false;
        }

        return false;
    },

    show_dialog : function ()
    {
        var html = '';
        //this.temp_sites = this.sites.slice(0);
        deep_copy(this.temp_sites, this.sites);

        for (var i = 0; this.sites[i]; ++i)
        {
            if (this.sites[i].url)
            {
                html += sprintf("<input type='checkbox' id='ncbox_%s' onclick='return netdisk_option_change(this, %s);' %s /><label for='ncbox_%s'>%s</label>\n",
                  i, i, this.sites[i].checked ? "checked" : "", i, this.sites[i].desc);
            }

            if (i && (i%5==0))
            {
                html += '<br>';
            }
        };

        html += '<div class="alert alert-danger" id="netdisk_alert" style="visibility:hidden;">请至少选择一个网盘！</div>';
        byId('netdisk_dialog_body').innerHTML = html;
        $('#myModal').modal('show');
    },

    option_change : function (box, i)
    {
        this.sites[i].checked = box.checked;
        var x = this.checked_count();
        byId('netdisk_alert').style.visibility = (x>0) ? "hidden" : "visible";

        return true;
    },

    dialog_ok : function ()
    {
        if (this.checked_count()>0)
        {
            $('#myModal').modal('hide');
            this.init_button_title();
        }
    },

    dialog_cancel : function ()
    {
        //this.sites = this.temp_sites;
        deep_copy(this.sites, this.temp_sites);

        $('#myModal').modal('hide');
        this.init_button_title();
    },

    init_button_title : function ()
    {
        byId('netdisk_button').value = sprintf(" 已选择: %s >>", this.checked_count());
    },

    goto_page : function (page)
    {
        var json = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s", lr) + sprintf("&googke_nor=%s", nums_of_result);
        do_goto_page(json, '/wangpan');

        return false;
    },

    select_site_by_url : function(url, checked)
    {
        for (var i = 0; this.sites[i].url; ++i)
        {
            if (this.sites[i].url && this.sites[i].url == url)
            {
                this.sites[i].checked = checked;
            }
        }
    },

    init_button_title_by_qstirng : function (qs)
    {
        // clear checked
        for (var i = 0; this.sites[i].url; ++i)
        {
            this.sites[i].checked = false;
        }

        //
        var last_offset = 0;
        var off = 0;

        while (off>=0)
        {
            off = qs.indexOf("site:", off);
            if (off>=0)
            {
                var url = '';
                var off2 = qs.indexOf(" ", off);
                if (off2>=0)
                {
                    url = qs.substr(off+5, off2-off-5);
                    off = off2;
                }
                else
                {
                    url = qs.substr(off+5, qs.length - off - 5);
                    off = -1;
                }

                this.select_site_by_url(url, true);
            }
        }

        this.init_button_title();
    },
};


var bt = {
    sites : [ {'url': 'www.btcherry.com', 'desc':'BT樱桃', 'checked': true} ,
             {'url': 'diaosisou.com', 'desc':'屌丝搜', 'checked': true} ,
             {'url': 'btdigg.org', 'desc':'btdigg.org', 'checked': true} ,
             {'url': 'btkitty.org', 'desc':'BT Kitty', 'checked': true} ,
             {'url': 'torrentkittycn.com', 'desc':'TorrentKitty', 'checked': true} ,
             {'url': 'thepiratebay.se', 'desc':'海盗湾', 'checked': true} ,
             {'url': 'shousibaocai.com', 'desc':'手撕包菜', 'checked': true} ,
             {'url': 'btlove.net', 'desc':'爱磁力', 'checked': true} ,
             {'url': 'rrmj.tv', 'desc':'人人美剧', 'checked': true} ,
             {'url': 'ed2000.com', 'desc':'ed2000', 'checked': true} ,
             {'url': 'iverycd.net', 'desc':'iverycd.net', 'checked': true} ,
             {'url': 'simplecd.me', 'desc':'simplecd.me', 'checked': true} ,
             {'url': 'suppig.net', 'desc':'猪猪乐园', 'checked': true} ,
             {'url': 'btspread.com', 'desc':'btspread.com', 'checked': true} ,
             {'url': 'weibase.com', 'desc':'weibase.com', 'checked': true} ,
             {'url': null, 'desc':null, 'checked': true} ,
             ],
    temp_sites : [],
    checked_count : function()
    {
        var k = 0;
        for (var i = 0; this.sites[i].url; ++i)
        {
            k += this.sites[i].checked ? 1 : 0;
        }

        return k;
    },

    to_string : function ()
    {
        var s1 = '';
        for (var i = 0; this.sites[i].url; ++i)
        {
            if (this.sites[i].checked)
            {
                s1 += sprintf("%ssite:%s", (s1.length>0) ? " OR " : "", this.sites[i].url);
            }
        }

        return encodeURIComponent(s1);
    },

    check_form : function()
    {
        var q = byId('q');
        if (typeof(q) != 'undefined' && q.value.length>0)
        {
            var pass = create_pass();
            var json = sprintf("%s&lr=%s&sites=%s", make_query_link(q.value), lr, this.to_string());
            json = CryptoJS.AES.encrypt(JSON.stringify(json), pass, {format: CryptoJSAesJson}).toString();
            //alert(json);
            post('/btsearch', {'json':json, 'pass': pass});

            //window.alert(link);
            //window.location.href = link;

            return false;
        }

        return false;
    },

    show_dialog : function ()
    {
        var html = '';
        //this.temp_sites = this.sites.slice(0);
        deep_copy(this.temp_sites, this.sites);

        for (var i = 0; this.sites[i]; ++i)
        {
            if (this.sites[i].url)
            {
                html += sprintf("<input type='checkbox' id='ncbox_%s' onclick='return netdisk_option_change(this, %s);' %s /><label for='ncbox_%s'>%s</label>\n",
                  i, i, this.sites[i].checked ? "checked" : "", i, this.sites[i].desc);
            }

            if (i && (i%5==0))
            {
                html += '<br>';
            }
        };

        html += '<div class="alert alert-danger" id="netdisk_alert" style="visibility:hidden;">请至少选择一个网盘！</div>';
        byId('netdisk_dialog_body').innerHTML = html;
        $('#myModal').modal('show');
    },

    option_change : function (box, i)
    {
        this.sites[i].checked = box.checked;
        var x = this.checked_count();
        byId('netdisk_alert').style.visibility = (x>0) ? "hidden" : "visible";

        return true;
    },

    dialog_ok : function ()
    {
        if (this.checked_count()>0)
        {
            $('#myModal').modal('hide');
            this.init_button_title();
        }
    },

    dialog_cancel : function ()
    {
        //this.sites = this.temp_sites;
        deep_copy(this.sites, this.temp_sites);

        $('#myModal').modal('hide');
        this.init_button_title();
    },

    init_button_title : function ()
    {
        byId('netdisk_button').value = sprintf(" 已选择: %s >>", this.checked_count());
    },

    goto_page : function (page)
    {
        var json = sprintf("q=%s", qstring) + sprintf("&page=%s", page) + sprintf("&ei=%s", eid) + sprintf("&lr=%s", lr) + sprintf("&googke_nor=%s", nums_of_result);
        do_goto_page(json, '/btsearch');
        return false;
    },

    select_site_by_url : function(url, checked)
    {
        for (var i = 0; this.sites[i].url; ++i)
        {
            if (this.sites[i].url && this.sites[i].url == url)
            {
                this.sites[i].checked = checked;
            }
        }
    },

    init_button_title_by_qstirng : function (qs)
    {
        // clear checked
        for (var i = 0; this.sites[i].url; ++i)
        {
            this.sites[i].checked = false;
        }

        //
        var last_offset = 0;
        var off = 0;

        while (off>=0)
        {
            off = qs.indexOf("site:", off);
            if (off>=0)
            {
                var url = '';
                var off2 = qs.indexOf(" ", off);
                if (off2>=0)
                {
                    url = qs.substr(off+5, off2-off-5);
                    off = off2;
                }
                else
                {
                    url = qs.substr(off+5, qs.length - off - 5);
                    off = -1;
                }

                this.select_site_by_url(url, true);
            }
        }

        this.init_button_title();
    },
};

function rand(n,m)
{
    var c = m-n+1;
    return Math.floor(Math.random() * c + n);
}

function create_pass()
{
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|<>?,./;[]\=-`~';
    var s = '';

    for (var i=0; i<chars.length; ++i)
    {
        s += chars[ rand(0, chars.length-1 ) ];
    }

    return s;
}
