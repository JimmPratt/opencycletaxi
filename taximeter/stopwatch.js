var $start      = $('#start'),
	startText   = $start.text(),
	stopText    = $start.attr('alternate'),
	$split      = $('#split'),
	$reset      = $('#reset'),
	$timer      = $('#timer'),
	$splits     = $('#splits'),
	$help       = $('#help'),
	$helpSwitch = $('#help-switch'),
	$helpDiv    = $help.find('div'),
	kronerStart= 40,
	kronerRate = 4,
	/*
	 * I found this code on a few sites and am unsure of the original author.
	 * If you know please inform me so I can credit them here.
	 *
	 * 0 = start time
	 * 1 = end time
	 * 2 = state (stopped or counting)
	 * 3 = total elapsed time in ms
	 * 4 = timer (interval object)
	 * 5 = epoch (January 1, 1970)
	 * 6 = element (not used here, normally stores the DOM element to update with the time)
	 * 7 = split count
	 */
	t = [0, 0, 0, 0, 0, 0, 0, 0],
	
	format = function(ms) {
		var d = new Date(ms + t[5]).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
		var x = String(ms % 1000);
		while (x.length < 3) {
			x = '0' + x;
		}
		d += '.' + x;
		//return d.substr(0, d.length - 1);
		return d.substr(0, d.length - 4);
	},
	
	zero = function(num) {
		if (parseInt(num) < 0) var neg = true;
		if (Math.abs(parseInt(num)) < 10) {
			num = '0' + Math.abs(num);
		}
		if (neg) num = '-' + num;
		return num;
	},
	
	startStop = function() {
		t[t[2]] = (+new Date()).valueOf();
		t[2] = 1 - t[2];
		
		if (t[2] == 0) {
			clearInterval(t[4]);
			t[3] += t[1] - t[0];
			
			$start.text(startText);
			
			t[7]++;
			$splits.show();
			dkFare = kronerStart + (format(t[3]).substr(3,2) * kronerRate);
			usFare = dkFare * 0.171956;
			euroFare = dkFare * 0.134538;
			swedenFare = dkFare * 1.22852;
			norwayFare = dkFare * 1.02541;
			
			$('<li>' + dkFare + ' kroner<br>' + Math.floor(swedenFare.toFixed(2)) + ' SEK<br>' + Math.floor(norwayFare.toFixed(2)) + ' NOK<br>' + Math.floor(euroFare.toFixed(2)) + ' EURO<br>' + Math.floor(usFare.toFixed(2)) + ' USD</li>').appendTo($splits).slideDown('fast');

			$splits.find('li').removeClass('first last');
			$splits.find('li:first').addClass('first').end().find('li:last').addClass('last');
			
			t[4] = t[1] = t[0] = 0;
			
			display();
		}
		else {
			$start.text(stopText);
			t[4] = setInterval(display, 43);
		}
		
		return false;
	},

	reset = function() {
		if (t[2]) {
			startStop();
		}
		
		t[4] = t[3] = t[2] = t[1] = t[0] = 0;
		
		display();
		
		$start.text(startText);
		$splits.slideUp('fast', function() {
			$splits.empty();
		});
		
		t[7] = 0;
		
		return false;
	},
	
	display = function() {
		if (t[2]) {
			t[1] = (new Date()).valueOf();
		}
		
		$timer.text(format(t[3] + t[1] - t[0]));
	},
	
	split = function() {
		if (t[2] !== 0) {
			t[7]++;
			
			$splits.show();
			$('<li><span>' + zero(t[7]) + '</span> ' + format(t[3] + t[1] - t[0]) + '</li>').appendTo($splits).slideDown('fast');
			$splits.find('li').removeClass('first last');
			$splits.find('li:first').addClass('first').end().find('li:last').addClass('last');
		}
		
		return false;
	},
	
	load = function() {
		t[5] = new Date(1970, 1, 1, 0, 0, 0, 0).valueOf();

		display();
	};

$(function() {

	$splits.empty();
	
	load();
	
	$start.click(startStop);
	$split.click(split);
	$reset.click(reset);
	
	$helpSwitch.click(function() {
		$helpDiv.slideToggle('fast', function() {
			if ($helpDiv.filter(':visible')) {
				$.scrollTo($helpSwitch, 500);
			}
		});
		
		return false;
	});
	
	// Assign classes to special items
	$('#controls li:last').addClass('last');

});