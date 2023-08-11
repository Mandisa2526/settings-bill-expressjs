import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './settings-bill.js';
import moment from 'moment';
let today = moment();

let app = express();

let settingsBill = SettingsBill();


//configure
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/", function(req, res) {
  //let Totals = settingsBill.totals();
  res.render('index', {
    setting: settingsBill.getSettings(),
    totals : settingsBill.totals(),
    warningLevel: settingsBill.hasReachedWarningLevel(),
    criticalLevel: settingsBill.hasReachedCriticalLevel(),
    //roundCall: totals.callTotal().toFixed(2),
    //roundSms:  totals.smsTotal().toFixed(2),
    //roundTotal:totals.grandTotal().toFixed(2),
  });
});

app.post('/settings', function(req, res){

  settingsBill.setSettings({
    smsCost: req.body.smsCost,
    callCost: req.body.callCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel,
  })
  console.log(settingsBill.getSettings());
  res.redirect("/");
});
app.post('/action', function(req, res){
  //capture the callCost
  console.log(req.body.billItemTypeWithSettings);
  settingsBill.recordAction(req.body.billItemTypeWithSettings);
  res.redirect("/");
});
app.get("/actions", function(req, res){

  res.render('actions', {actions: settingsBill.actions()});
  actionsList.forEach((action)=>{
    action.timestamp = moment(action.timestamp).fromNow();
  });

});
app.get("/actions/:actionType", function(req, res){
  const  actionType = req.params.actionType;
  const actionsTypes = settingsBill.actionsFor(actionType);
  res.render('actions', {actions: settingsBill.actionsFor(actionType)});
  actionsTypes.forEach((action)=>{
    action.timestamp = moment(action.timestamp).fromNow();
  })
  
});


let PORT = process.env.PORT || 3021;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});