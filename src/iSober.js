var iSober = {
  "SOBRIETY_SPEED" : (0.01 / 40),
  initialize : function(Settings) {
    console.log('We are initializing.');
    this.Settings = Settings;
  },
  sober : function() {
    this.Settings.data('startTime',null);
    this.Settings.data('totalConsumed',null);
  },
  
  getWeight : function() {
    var weight = this.Settings.data('weight');
    if(isNaN(weight)) {
      weight = 145;
    }
    if(weight <= 50) {
      weight = 50;
    } else if (weight >= 300) {
      weight = 300;
    }
    return weight;
  },
  
  setWeight : function(weight) {
    this.Settings.data('weight',weight);
  },
  
  getTotalConsumed : function() {
    var totalConsumed = parseFloat(this.Settings.data('totalConsumed'));
    if(isNaN(totalConsumed)) {
      totalConsumed = 0;
      this.Settings.data("totalConsumed",totalConsumed);
    }
		return totalConsumed;    
  },
  
  getSobrietyLevel : function() {
    var sobrietyLevel = this.Settings.data("sobrietyLevel");
    sobrietyLevel = parseFloat(sobrietyLevel);
	
    if(isNaN(sobrietyLevel)) {
      sobrietyLevel = 0.05;
    }
    if(sobrietyLevel <= 0.00) {
      sobrietyLevel = 0.00;
    } else if (sobrietyLevel >= 0.10) {
      sobrietyLevel = 0.10;
    }
    
    return sobrietyLevel;    
  },
  
  setSobrietyLevel : function(sobrietyLevel) {
    this.Settings.data('sobrietyLevel',sobrietyLevel);
  },
  
  getDrinkValueAmount : function() {
    var weight = this.getWeight(),
        weightLookup = Math.floor((weight - 100) / 20),
        result = 0.019;
      
    switch(weightLookup) {
      case 0: result = 0.045; break;
      case 1: result = 0.038; break;
      case 2: result = 0.032; break;
      case 3: result = 0.028; break;
      case 4: result = 0.025; break;
      case 5: result = 0.023; break;
      case 6: result = 0.021; break;
      case 7: result = 0.019; break;
    }

    return result;    
  },
  
  getStartTime : function() {
    var startTime = this.Settings.data("startTime");
    if(startTime) {
      startTime = new Date(startTime);
    } else {
      startTime = new Date();
      this.Settings.data("startTime", startTime);
    }
    
    return startTime;    
  },
  
  getElapsedMinutes : function() {
    var now = new Date(),
        difference = Math.floor((now - this.getStartTime()) / (1000 * 60));
  
    return difference;    
  },
  
  getBAC : function() {
    var totalConsumed = this.getTotalConsumed(),
        startTime = this.getStartTime(),
        elapsedMinutes = this.getElapsedMinutes(startTime),
        bac = totalConsumed - (this.getElapsedMinutes(startTime) * this.SOBRIETY_SPEED);
    
    console.log("getBAC - totalConsumed ["
                + totalConsumed
                + "], startTime ["
                + startTime
                + "], elapsedMinutes [" 
                + elapsedMinutes
                + "], SOBRIETY_SPEED ["
                + this.SOBRIETY_SPEED
                + "], bac ["
                + bac
                + "]");
    return bac;
  },
  
  drink : function(amount, drinkname) {
    var totalConsumed = this.getTotalConsumed();
    console.log("drink - Starting total consumed [" + totalConsumed + "]");
    if(totalConsumed <= 0) {
      console.log("drink - total consumed [" + totalConsumed + "] is <= 0 so changing to sober");
      this.sober();
    }
    totalConsumed += (this.getDrinkValueAmount() * amount);
    this.Settings.data('totalConsumed', totalConsumed);
    console.log("drink - Ending total consumed [" + totalConsumed + "]");
  },
  
  getTotalMinutesForSobriety : function() {
    var totalConsumed = this.getTotalConsumed(),
        sobrietyLevel = this.getSobrietyLevel(),
        totalMinutesForSobriety = Math.floor((totalConsumed - sobrietyLevel) / (this.SOBRIETY_SPEED));
    
    console.log("getTotalMinutesForSobriety - totalConsumed ["
                + totalConsumed
                + "], sobrietyLevel ["
                + sobrietyLevel
                + "], SOBRIETY_SPEED ["
                + this.SOBRIETY_SPEED
                + "], totalMinutesForSobriety ["
                + totalMinutesForSobriety
                + "]");    
    return totalMinutesForSobriety;
  },
  
  getDisplayString : function() {
    var displayString = "Stone Cold!",
        totalConsumed = this.getTotalConsumed(),
        sobrietyLevel = this.getSobrietyLevel(),
        remainingMinutes = this.getTotalMinutesForSobriety(totalConsumed, sobrietyLevel) - this.getElapsedMinutes(this.getStartTime()),
        bac = this.getBAC();
    
    if(remainingMinutes > 0) {
      displayString = remainingMinutes + " minutes";
    } else {
      if( bac > (sobrietyLevel * 0.7) ) {
        displayString = "Gettin' There";
      } else if (bac > (sobrietyLevel * 0.3)) {
        displayString = "Sober";
      } else {
        displayString = "Stone Cold!";
      }
    }
    
    return displayString;
  }
};
this.exports = iSober;