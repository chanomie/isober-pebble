/**
 * iSober - a port of iSober onto the Pebble Watch
 */

var UI = require('ui');
var Settings = require('settings');
var iSober = require('iSober');

var main = new UI.Card({
  title: 'iSober',
  body: 'Stone Cold',
  style: 'large',
  action: {
    up: 'images/action_icon_plus.png',
    select: 'images/action_icon_setting.png',
    down: 'images/action_icon_drink.png'
  }
});

iSober.initialize(Settings);
main.show();
updateElements();
setInterval(updateElements,60000);

main.on('click', 'up', function(e) {
  iSober.drink(1, "Shot (1)");
  updateElements();
});

main.on('click', 'select', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Weight'
      }, {
        title: 'Sobriety'
      }, {
        title: 'Debug'
      }]
    }]
  });
  
  menu.on('select', function(e) {
    var itemTitle = e.item.title;
    if(itemTitle == 'Debug') {
      var debugString =
          "Drink Value\n"
          + iSober.getDrinkValueAmount() + "\n"
          + "Consumed\n"
          + iSober.getTotalConsumed() + "\n"
          + "BaC\n"
          + iSober.getBAC() + "\n"
          + "Start Time\n"
          + iSober.getStartTime() + "\n"
          + "Minutes Sober\n"
          + iSober.getTotalMinutesForSobriety() + "\n"
          + "Elapsed Minutes\n"
          + iSober.getElapsedMinutes() + "\n";
      
      var debugCard = new UI.Card({
        body: debugString,
        scrollable: true
      });
      debugCard.show();
    } else if(itemTitle == 'Weight') {
      var weightCard = new UI.Card({
        body: iSober.getWeight() + " lb",
        style: "large",
        action: {
          up: 'images/action_icon_plus.png',
          down: 'images/action_icon_minus.png'
        }        
      });
      weightCard.on('click','up', function(e) {
        iSober.setWeight(iSober.getWeight() + 1);
        weightCard.body(iSober.getWeight() + " lb");
      });
      weightCard.on('click','down', function(e) {
        iSober.setWeight(iSober.getWeight() - 1);
        weightCard.body(iSober.getWeight() + " lb");
      });

      weightCard.show();
    } else if(itemTitle == 'Sobriety') {
      var sobrietyCard = new UI.Card({
        body: iSober.getSobrietyLevel(),
        style: "large",
        action: {
          up: 'images/action_icon_plus.png',
          down: 'images/action_icon_minus.png'
        }        
      });
      sobrietyCard.on('click','up', function(e) {
        iSober.setSobrietyLevel(iSober.getSobrietyLevel() + 0.01);
        sobrietyCard.body(iSober.getSobrietyLevel());
      });
      sobrietyCard.on('click','down', function(e) {
        iSober.setSobrietyLevel(iSober.getSobrietyLevel() - 0.01);
        sobrietyCard.body(iSober.getSobrietyLevel());
      });

      sobrietyCard.show();
    }
  });
          
  menu.show();
});

main.on('click', 'down', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Half (0.5)',
        icon: 'images/action_icon_drink05.png'
      }, {
        title: 'Shot (1)',
        icon: 'images/action_icon_drink1.png'
      }, {
        title: 'Jigger (1.5)',
        icon: 'images/action_icon_drink15.png'
      }, {
        title: 'Double (2)',
        icon: 'images/action_icon_drink2.png'
      }, {
        title: 'Mistake (-0.5)',
      }, {
        title: 'Sober',
      }]
    }]
  });
  
  menu.on('select', function(e) {
    var itemTitle = e.item.title;
 
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    
    if(itemTitle == 'Half (0.5)') {
      iSober.drink(0.5, e.item.title);
    } else if(itemTitle == 'Shot (1)') {
      iSober.drink(1, e.item.title);
    } else if(itemTitle == 'Jigger (1.5)') {
      iSober.drink(1.5, e.item.title);
    } else if(itemTitle == 'Double (2)') {
      iSober.drink(2, e.item.title);
    } else if(itemTitle == 'Mistake (-0.5)') {
      iSober.drink(-0.5, e.item.title);
    } else if(itemTitle == 'Sober') {
      iSober.sober();
    }
    
    updateElements();
    menu.hide();
  });
  menu.show();
});

function updateElements() {
  main.body(iSober.getDisplayString());
}