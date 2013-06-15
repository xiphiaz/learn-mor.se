
var morse = {
	ctx: new(window.audioContext || window.webkitAudioContext),
	osc: null,
	init: function(){
	},
	beepStart: function(){
		morse.osc = morse.ctx.createOscillator();
		morse.osc.type = 0;
		morse.osc.frequency.value = 750;
		morse.osc.connect(morse.ctx.destination);
		morse.osc.noteOn(0);
	},
	beepEnd: function(){
		morse.osc.noteOff(0);
	},
	speed: 100, // millis per dit
	mapCharToCode: {
		'a': '.-',
		'b': '-...',
		'c': '-.-.',
		'd': '-..',
		'e': '.',
		'f': '..-.',
		'g': '--.',
		'h': '....',
		'i': '..',
		'j': '.---',
		'k': '-.-',
		'l': '.-..',
		'm': '--',
		'n': '-.',
		'o': '---',
		'p': '.--.',
		'q': '--.-',
		'r': '.-.',
		's': '...',
		't': '-',
		'u': '..-',
		'v': '...-',
		'w': '.--',
		'x': '-..-',
		'y': '-.--',
		'z': '--..',
		
		'1': '.----',
		'2': '..---',
		'3': '...--',
		'4': '....-',
		'5': '....-',
		'6': '-....',
		'7': '--...',
		'8': '---..',
		'9': '----.',
		'0': '-----',
		
		'.': '.-.-.-',
		',': '--..--',
		'?': '..--..',
		'\'': '.----.',
		'!': '-.-.--',
		'/': '-..-.',
		'(': '-.--.',
		')': '-.--.-',
		'&': '.-...',
		':': '---...',
		';': '-.-.-.',
		'=': '-...-',
		'+': '.-.-.',
		'-': '-....-',
		'_': '..--.-',
		'"': '.-..-.',
		'$': '...-..-',
		'@': '.--.-.',
		'|': '|', //separation char is of length 3
		' ': '~' //space is 7 units long
	},
	mapCodeToChar: {
		'.-': 		'a',
		'-...': 	'b',
		'-.-.': 	'c',
		'-..': 		'd',
		'.': 		'e',
		'..-.': 	'f',
		'--.': 		'g',
		'....': 	'h',
		'..': 		'i',
		'.---': 	'j',
		'-.-': 		'k',
		'.-..': 	'l',
		'--': 		'm',
		'-.': 		'n',
		'---': 		'o',
		'.--.': 	'p',
		'--.-': 	'q',
		'.-.': 		'r',
		'...': 		's',
		'-': 		't',
		'..-': 		'u',
		'...-': 	'v',
		'.--': 		'w',
		'-..-': 	'x',
		'-.--': 	'y',
		'--..': 	'z',
		
		'.----': 	'1',
		'..---': 	'2',
		'...--': 	'3',
		'....-': 	'4',
		'....-': 	'5',
		'-....': 	'6',
		'--...': 	'7',
		'---..': 	'8',
		'----.': 	'9',
		'-----': 	'0',
		
		'.-.-.-': 		'.',
		'--..--': 		',',
		'..--..': 		'?',
		'.----.': 		'\'',
		'-.-.--': 		'!',
		'-..-.': 		'/',
		'-.--.': 		'(',
		'-.--.-': 		')',
		'.-...': 		'&',
		'---...': 		':',
		'-.-.-.': 		';',
		'-...-': 		'=',
		'.-.-.': 		'+',
		'-....-': 		'-',
		'..--.-': 		'_',
		'.-..-.': 		'"',
		'...-..-': 		'$',
		'.--.-.': 		'@'
	},
	player: {
		queue: [],
		characterQueue: [],
		getChar: function(char){
			return morse.mapCharToCode[char];
		},
		queueChar: function(character, callback){
			var code = morse.mapCharToCode[character];
			console.log(character, code);
			var dahdits = code.split('');
			
			var space = {
				length: 1,
				on: false
			}
			
			for (i=0; i<dahdits.length; i++){
				var length = 0;
				var on=false;
				switch(dahdits[i]){
					case '.':
						length = 1;
						on = true;
					break;
					case '-':
						length = 3;
						on = true;
					break;
					case '|':
						length = 3;
						on = false;
					break;
					case '~':
						length = 7;
						on = false;
					break;
				}
				instruction = {
					length: length,
					on: on
				}
				
	/* 			console.log(dahdits[i], '=>', length, on); */
				
				morse.player.queue.push(instruction);
				
				
				if (i<dahdits.length-1 && on)	morse.player.queue.push(space);
			}
		},
		playCode: function(code, callback){
			
			morse.player.queueChar(code);
			
			
	 		// console.log(morse.player.queue); 
			
			morse.player.processQueue(function(){
	/* 			console.log('playchar complete'); */
				callback();
			});
		},
		processQueue: function(callback){
		
			if (morse.player.queue.length == 0){
	/* 			console.log('empty queue tried to process'); */
			}else{
				nextUp = morse.player.queue.shift(); //get the first element
				
	/* 			console.log('nextUp', nextUp); */
				
				var finished = function(){
					if (morse.player.queue.length>0){
						morse.player.processQueue(callback);
					}else{
	/* 					console.log('queue complete'); */
						if (typeof callback == 'function'){
							callback();
						}
					}
				}
			
				if (nextUp.on){
					morse.player.beep(nextUp.length, finished);
				}else{
					morse.player.space(nextUp.length, finished);
				}
			} 
			
			
		},
		beep: function (duration, finishedCallback) {

	        duration = duration*morse.speed;

	        morse.beepStart();

	        setTimeout(function () {
	            morse.beepEnd();
	            finishedCallback();
	        }, duration);

	    }, /* beep function adapted from alex via stackoverflow http://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep#13194087 */
	    space: function(duration, callback){
		    duration = duration*morse.speed;
		    setTimeout(function () {
	            callback();
	        }, duration);
	    },
	    playPhrase: function(phrase){
		    letters = phrase.toLowerCase().split('');
		    
	/* 	    console.log('letters:', letters); */
		    
		    for (i=0; i<letters.length; i++){
			    morse.player.characterQueue.push(letters[i]);
			    if (i<letters.length-1)	morse.player.characterQueue.push('|'); //special char for separation of characters
		    }
		    
		    console.log(morse.player.characterQueue);
		    
		    morse.player.processCharacterQueue();
	    },
	    processCharacterQueue: function(callback){
		    
		    if (morse.player.characterQueue.length == 0){
	/* 			console.log('empty queue tried to process'); */
			}else{
				nextUpChar = morse.player.characterQueue.shift(); //get the first element
				
	/* 			console.log('nextUp char', nextUpChar); */
	/* 			console.log('remaining:', morse.player.characterQueue); */
				
				var finished = function(){
					if (morse.player.characterQueue.length>0){
						morse.player.processCharacterQueue(callback);
					}else{
	/* 					console.log('character queue complete'); */
						if (typeof callback == 'function'){
							callback();
						}
					}
				}
				
				morse.player.playCode(nextUpChar, finished);
			}
	    }
		
	}, //end morse.player

	listener: {
		startTime: new Date().getTime(),
		lastEvent: 0,
		getTimeSinceStart: function(){
			return new Date().getTime() - morse.listener.startTime;
		},
		getTimeSinceLast: function(){
			timeSinceStart = morse.listener.getTimeSinceStart();
			timeSinceLast = timeSinceStart - morse.listener.lastEvent;
			morse.listener.lastEvent = timeSinceStart;
			return timeSinceLast;
		},
		startTimeOutTimer: function(){

			timeoutBeats = 15; //timeout after 15 dits of space

			lastEvent = morse.listener.lastEvent;

			setTimeout(function(){

				if (lastEvent < (morse.listener.getTimeSinceStart() - morse.speed*timeoutBeats )){
					console.log('TIMED OUT');
					morse.listener.processCodeLog();
					$('#char').append('<br />');
				}

			}, morse.speed*timeoutBeats); 

		},
		keyDownState: false,	
		keyDown: function(){
			if (!morse.player.keyDownState){
				morse.player.keyDownState = true;
				console.log('key down');

				morse.listener.addRawInput('space');

				morse.beepStart();
			}
		},
		keyUp: function(){
			console.log('key up');
			morse.player.keyDownState = false;

			morse.listener.addRawInput('beep');

			morse.beepEnd();
		},
		
		inputLog: [],
		rawInput: [],
		charLog: [],
		codeLog: [],

		addRawInput: function(eventType){

			input = {
				event: eventType,
				duration: morse.listener.getTimeSinceLast()
			}

			morse.listener.rawInput.push(input);

			morse.listener.processInput(input);
		},

		processInput: function(input){

			beep = null;
			length = null;

			if (input.event == 'beep'){
				beep = true;
				if (input.duration < morse.speed * (1 + 1)){ 		//0-2 units assume 1
					length = 1;
				}else{ 												//more than 2 units assume 3
					length = 3;
				}

			}else if (input.event == 'space'){
				beep = false;
				if (input.duration < morse.speed * (1 + 1)){ 		//0-2 units assume 1
					length = 1;
				}else  if (input.duration > morse.speed * (7 - 2)){	//5-infin units assume 7
					length = 7;
				}else{												//2-5 units assume 3
					length = 3;
				}
			}else{
				console.log('invalid raw input type')
			}

			quality = (input.duration - (length*morse.speed))/morse.speed + 1;
			morse.listener.addInput(beep, length, quality);

		},

		addInput: function(keydown, length, quality){

			input = {};

			type = null;

			if (keydown){

				switch (length){
					case 1:
						type = '.';
					break;
					case 3:
						type = '-';
					break;
					default:
						console.log('invalid length given on key down');
					break;
				}

			}else{
				switch (length){
					case 1:
						type = '|';
					break;
					case 3:
						type = '~';
					break;
					case 7:
						type = ' ';
					break;
					default:
						console.log('invalid length given on key down');
					break;
				}

				morse.listener.startTimeOutTimer();
			}

			input = {
				code: type,
				quality: quality
			}

			morse.listener.inputLog.push(input);

			switch(type){
				case '.':
				case '-':
					morse.listener.codeLog.push(type);
				break;

				case '~':
					morse.listener.processCodeLog(); //an end code char recieved, work out the character
				break;

				case ' ':
					morse.listener.processCodeLog();
					morse.listener.processCharLog();
				break;
			}

			$('#raw').append('[<strong>' + input.code + '</strong><small>'+input.quality+'</small>]');
		},
		processCodeLog: function(){
			code = morse.listener.codeLog.join('');
			$('#code').append(code);



			if (morse.mapCodeToChar.hasOwnProperty(code)){
				character = morse.mapCodeToChar[code];

				$('#char').append(character);
			}else{
				console.log('invalid code processed: ['+code+']');
			}
			
			morse.listener.codeLog.length = 0; //truncate array

			
		},
		processCharLog: function(){
			return 0;
		}

	} //end morse.listener

} //end morse

$(document).ready(function() {
  // Handler for .ready() called.
/*   $('#input').keydown(morse.player.keyDown); */
  
/*   $('#input').keyup(morse.player.keyUp); */
  
	document.onkeydown = morse.listener.keyDown;
  
	document.onkeyup = morse.listener.keyUp;
	
	$('body').mouseup(function(){
		morse.player.playPhrase(window.getSelection().toString());
	});
  
});

