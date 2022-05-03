//Only js file (other than the ones included in packegs like bootstrap) that's included in the index
import AppController from './Controller/appController.js'
import appViewModel from './View/View_Model/local_view_model.js'
import Animations from './Controller/animations.js'

$(document).ready(function(){  
  (async function() {    
    let animation = new Animations();
    let app = new AppController(appViewModel);    
  	await app.render();
  })();
})