const saas=SpreadsheetApp.getActiveSpreadsheet();
const sbnTestMaterial=saas.getSheetByName("测试物料领用");
const sbnColorMaterial=saas.getSheetByName("色母含量");
const sbnMenuSet=saas.getSheetByName("菜单设置");
const sbnTimingSet=saas.getSheetByName("定时设置");
const currentTimeZone=saas.getSpreadsheetTimeZone();
const scriptProperties = PropertiesService.getScriptProperties();
const scriptRunOwner=Session.getActiveUser().getEmail();
let GOOGLE_CHAT_WEBHOOK_LINK = "https://chat.googleapis.com/v1/spaces/AAAAyKrTKQ4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=1q38g4i2uw8Sp6-xbb-Rv2_95nnVrhx16-feSjrm-os%3D";    /**张俊【GoogleChat网络钩子】**/

function onOpen(){
  let sbnMenuSetLr=sbnMenuSet.getLastRow();
  let arrMenus=[];
  let arrMenusData=[];
  let arrRunScript=[];
  if(sbnMenuSetLr>2){
    arrMenusData=sbnMenuSet.getRange(3,1,sbnMenuSetLr-2,4).getValues();
    arrMenus=arrMenusData.filter(v=>{return v[0]!=""&&v[2]=="是"});
    arrOpenRun=arrMenusData.filter(v=>{return v[0]!=""&&v[3]=="是"});
  }
  if(arrMenus.length>0){
    arrRunScript.push(null);
    for(let i=0;i<arrMenus.length;i++){
      arrRunScript.push({name:arrMenus[i][0],functionName:arrMenus[i][1]});
      if(i<arrMenus.length-1){
        arrRunScript.push(null)
      }
    }
  }
  saas.addMenu("专项菜单",arrRunScript);
}

function getDataAndSend(){
  let arrTestMaterial=sbnTestMaterial.getRange(2,1,sbnTestMaterial.getLastRow()-1,17).getDisplayValues();
  arrTestMaterial.forEach((v,index)=>v.push(index+2));
  let arrTestMaterialHead=[arrTestMaterial[0]];
  let arrSendData=arrTestMaterial.filter(v=>v[16]=="Y");
  if(arrSendData.length>0){
    let arrNewSendData=arrTestMaterialHead.concat(arrSendData);
    let tomail=sbnColorMaterial.getRange(2,8,sbnColorMaterial.getLastRow()-1,1).getDisplayValues().filter(v=>v[0]!="").join(",");
    let ccmail="houyi_dai@colpal.com";
    let title="测试物料领用";
    let call="Dear,";
    let describe1="明细如下：";
    let widths=[7,7,7,7,9,7,7,7,7,7,7,7,7,7,7,0,0];
    let head_backgrounds=["unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset","unset"];
    let aligns=["center","center","center","center","center","center","center","center","center","center","center","center","center","center","center","center","center"];
    let scale=90;
    let arrHideCol=[15,16];
    let describe2=General_Htmltable(arrNewSendData,widths,head_backgrounds,aligns,scale,arrHideCol);
    let describe3="";
    let describe4="";
    let describe5="";
    let describe6="";
    Mail_HTML_TXT(tomail,title,call,describe1,describe2,describe3,describe4,describe5,describe6,ccmail);
    let nowDateTime=Utilities.formatDate(new Date(),"Asia/Shanghai","yyyy-MM-dd HH:mm:ss");
    for(let i=0;i<arrSendData.length;i++){
      sbnTestMaterial.getRange(arrSendData[i][17],17,1,1).setValue("已发送_"+nowDateTime);
    }
  }
}
