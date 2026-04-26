/******【定时执行】模块用******/
/***计算当前日期在当月第几周***/
function getWeekInMonth(variable){
  let result=1;
  if(variable){
    let date = new Date(variable);
    let w = date.getDay();
    let d = date.getDate();
    result=Math.ceil((d + 6 - w) / 7)
  }
  return result;
}

/***计算当前时间前20分钟时间***/
function newTimeBefore(nowTime){
  let newTime="";
  if(nowTime){
    newTime=nowTime-20*60*1000;
  }
  return newTime;
}

/***计算当前时间后10分钟时间***/
function newTimeAfter(nowTime){
  let newTime="";
  if(nowTime){
    newTime=nowTime+10*60*1000;
  }
  return newTime;
}

/***时间转换成日期时间***/
const regexDateTime1 = /^[0-9\-: ]+$/;
const regexDateTime2 = /^[0-9\/: ]+$/;

function formatVariableAsDateHmsS(variable){
  let result="";
  if(variable){   //&&(regexDateTime1.test(variable)||regexDateTime2.test(variable))
    result=Utilities.formatDate(new Date(variable),currentTimeZone,"yyyy-MM-dd HH:mm:ss:SSS");
  }
  return result;
}

function formatVariableAsDateHms(variable){
  let result="";
  if(variable){   //&&(regexDateTime1.test(variable)||regexDateTime2.test(variable))
    result=Utilities.formatDate(new Date(variable),currentTimeZone,"yyyy-MM-dd HH:mm:ss");
  }
  return result;
}

/***时间转换成日期时间(分钟)***/
function formatVariableAsDateHm(variable){
  let result="";
  if(variable){   //&&(regexDateTime1.test(variable)||regexDateTime2.test(variable))
    result=Utilities.formatDate(new Date(variable),currentTimeZone,"yyyy-MM-dd HH:mm");
  }
  return result;
}

/***时间转换成日期***/
function formatVariableAsDate(variable){
  let result="";
  if(variable){   //&&(regexDateTime1.test(variable)||regexDateTime2.test(variable))
    result=Utilities.formatDate(new Date(variable),currentTimeZone,"yyyy-MM-dd");
  }
  return result;
}

/***时间转换成日期***/
function formatVariableAsYM(variable){
  let result="";
  if(variable){   //&&(regexDateTime1.test(variable)||regexDateTime2.test(variable))
    result=Utilities.formatDate(new Date(variable),currentTimeZone,"yyyyMM");
  }
  return result;
}

function General_Htmltable(data,widths,head_backgrounds,aligns,scale,arrHideCol) {
  let htmltable="<table border='1' style='table-layout:fixed;margin-left:30px;border-collapse:collapse;font-size:12px;width:"+scale+"%;'>";
  for(let i=0;i<data.length;i++){
    htmltable += "<tr>"
    for(let j=0;j<data[i].length;j++){
      if(i==0&&arrHideCol.indexOf(j)!=-1){
        htmltable += "<td style='width:"+widths[j]+"%"+
                     ";text-align:center;display:none"+
                     ";background:" + head_backgrounds[j] +
                     "'>"+
                     data[i][j] + 
                     "</td>";
      }
      else if(i>0&&arrHideCol.indexOf(j)!=-1){
      htmltable += "<td style='width:"+widths[j]+"%"+
                     ";text-align:"+aligns[j]+
                     ";display:none'>"+
                     data[i][j] + 
                     "</td>";
      }
      if(i==0&&arrHideCol.indexOf(j)==-1){
        htmltable += "<td style='width:"+widths[j]+"%"+
                     ";text-align:center"+
                     ";background:" + head_backgrounds[j] +
                     "'>"+
                     data[i][j] + 
                     "</td>";
      }
      else if(i>0&&arrHideCol.indexOf(j)==-1){
      htmltable += "<td style='width:"+widths[j]+"%"+
                     ";text-align:"+aligns[j]+
                     "'>"+
                     data[i][j] + 
                     "</td>";
      }
    }
    htmltable += "</tr>";
  }
  htmltable + "</table>"
  return htmltable;
}

function Mail_HTML_TXT(tomail,title,call,describe1,describe2,describe3,describe4,describe5,describe6,ccmail){
  let html_txt='<font size="3" color="black">'+
               call+  //【称呼】
               '</font>'+
               '<font size="2" color="black"><div style="text-indent:2em"><p>'+
               describe1+   //【描述1】         
               '</p></div></font>'+
               '<font size="2" color="black"><div style="text-indent:0em"><p>'+
               describe2+   //【描述2】
               '</p></div></font>'+
               '<font size="2" color="black"><div style="text-indent:2em"><p>'+
               describe3+   //【描述3】
               '</p></div></font>'+
               '<font size="2" color="black"><div style="text-indent:0em"><p>'+
               describe4+   //【描述4】
               '</p></div></font>'+
               '<font size="2" color="black"><div style="text-indent:2em"><p>'+
               describe5+   //【描述5】
               '</p></div></font>'+ 
               '<font size="2" color="black"><div style="text-indent:0em"><p>'+
               describe6+   //【描述6】
               '</p></div></font>' 
  // tomail="jin_zhang@colpal.com";
  // ccmail="";
  let arrFromMails=GmailApp.getAliases();
  let fromMail="CSX_PlantSystem@colpal.com";
  let position=arrFromMails.indexOf(fromMail);
  if(position!=-1){
    GmailApp.sendEmail(tomail, title,'' ,{htmlBody: html_txt,cc:ccmail,from:fromMail}); //
  }
  else{
    GmailApp.sendEmail(tomail, title,'' ,{htmlBody: html_txt,cc:ccmail});
  }
}
