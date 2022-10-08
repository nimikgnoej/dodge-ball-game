$("document").ready(function(){
	// ---데이터 정의----
	
	// 공의 개수
	var circleNumber=0;
	
	// 공의 종류 -- 1.크기 2.색깔 3.속도
	var circleTypes = {
		"option":["width", "color", "border-radius", "speed"],
		"small":["black", 5, 2.5, 3000],
		"medium":["blue", 15, 7.5, 4000],
		"large":["yellow", 30, 15, 5000],
	};
	
	// 시간을 찍어주는 함수 --> 점수로 직결됨
	
	var t=0; //시간을 찍어주는 변수
	var gameOn = false; //게임 실행 여부, true면 실행중..
	
	//마우스 좌표
	var mouseX; var mouseY;
	//-------------
	
	// 마우스 함수
	
	$("body").mousemove(function(){
		mouseX = event.pageX;
		mouseY = event.pageY;  //현재 마우스의 위치값이 담김
	});
	
	function timer(){
		if(gameOn === true){
			setTimeout(function(){
				t+=0.01;
				$(".timer").html(`<h1><div class="center">${t.toFixed(2)}</div></h1>`);
				timer();
			},10)
		}
	};
	
	// 시작 기능
	$(".startbutton").click(function(){
		$(".startbutton").fadeToggle(500,function(){
			gameOn = true;
			timer();
			$(".space").mouseenter(function(){
				endgame();
			});
		});
		//공을 만들어주는 함수
		createCircle();
	});
	
	function createCircle(){
		circleNumber++;
		
		//1부터 3까지의 정수를 랜덤하게 뽑아서 small, medium, large 로 선택
		var randomOneThree = Math.floor(3 * Math.random()) + 1;
		
		if(randomOneThree == 1)
			var circleChoice = "small";
		else if(randomOneThree == 2)
			var circleChoice = "medium";
		else
			var circleChoice = "large";
		
		//공의 고유한 ID 값 만들어주기
		var circleName = "circle" + circleNumber;
		
		var circleColor = circleTypes[circleChoice][0];
		var circleSize = circleTypes[circleChoice][1];
		var circleRadius = circleTypes[circleChoice][2];
		var circleSpeed = circleTypes[circleChoice][3];
		
		//공이 움직일 수 있는 범위를 지정해야함
		var moveableWidth = $("body").width() - circleSize;
		var moveableHeight = $("body").height() - circleSize;
		
		var circlePositionLeft = (moveableWidth * Math.random()).toFixed();
		var circlePositionTop = (moveableHeight * Math.random()).toFixed();
		
		var newCircle = `<div class="circle" id="${circleName}"></div>`;
		$("body").append(newCircle);
		
		$("#"+circleName).css({
			"background-color" : circleColor,
			"width" : circleSize + "vmin",
			"height" : circleSize + "vmin",
			"border-radius" : circleRadius + "vmin",
			"top" : circlePositionTop + "px",
			"left" : circlePositionLeft + "px"
		});
		
		// 1ms 마다 마우스와의 거리를 계싼하는 함수 구현
		
		function timeCirclePositioin(circleTrackId){
			setTimeout(function(){
				var currentCirclePosition = $(circleTrackId).position();
				var calculateRadius = parseInt($(circleTrackId).css("width")) * 0.5;
				
				var distanceX = mouseX - (currentCirclePosition.left + calculateRadius);
				var distanceY = mouseY - (currentCirclePosition.top + calculateRadius);
				
				if(Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2)) <= calculateRadius){
					//부딪힌 공을 빨간색으로 설정
					$(circleTrackId).removeClass("circle").addClass("redcircle");
					$(circleTrackId).css("background-color" , "red");
					// 공이 마우스와 닿았다면 게임 종료
					endgame();
				}
				timeCirclePositioin(circleTrackId);
			},1);
		}
		timeCirclePositioin("#"+circleName);
		
		animateCircle(circleName,circleSpeed,circleSize);
		
		setTimeout(function(){
			if(gameOn == true){
				createCircle();
			}
		},3000);
	}
	
	function animateCircle(circleId, speed, circleSize){
		//jQuery의 animate() 사용
		var moveableWidth = $("body").width() - circleSize;
		var moveableHeight = $("body").height() - circleSize;
		var circleMoveLeft = (moveableWidth * Math.random()).toFixed();
		var circleMoveTop = (moveableHeight * Math.random()).toFixed();
		
		$("#" + circleId).animate({
			left : circleMoveLeft,
			top : circleMoveTop,
		},speed, function(){
			animateCircle(circleId, speed, circleSize);
		});
	}
	
	function endgame(){
		if(gameOn == true){
			gameOn = false;
			updateScore(t)
			$(".circle").remove();
			$(".redcircle").stop();
		}
	}
	
	var resetButton = `<div class="resetButton center"><h2>Play Again!</h2></div>`;
	
	var highsScore1 = 0.00;
	var highsScore2 = 0.00;
	var highsScore3 = 0.00;
	var highsScore4 = 0.00;
	var highsScore5 = 0.00;
	
	function updateScore(newScore){
		if(newScore > highsScore1){
			var redscore = "score1";
			highsScore5 = highsScore4;
			highsScore4 = highsScore3;
			highsScore3 = highsScore2;
			highsScore2 = highsScore1;
			highsScore1 = newScore;
		}
		
		else if(newScore > highsScore2){
			var redscore = "score2";
			highsScore5 = highsScore4;
			highsScore4 = highsScore3;
			highsScore3 = highsScore2
			highsScore2 = newScore;
		}
		
		else if(newScore > highsScore3){
			var redscore = "score3";
			highsScore5 = highsScore4;
			highsScore4 = highsScore3;
			highsScore3 = newScore;
		}
		
		else if(newScore > highsScore4){
			var redscore = "score4";
			highsScore5 = highsScore4;
			highsScore4 = newScore;
		}
		
		else if(newScore > highsScore5){
			var redscore = "score5";
			highsScore5 = newScore;
		}
		var highScorePlace1 = `<div class="score center" id="score1"><h2>${highsScore1.toFixed(2)}</h2></div>`
		var highScorePlace2 = `<div class="score center" id="score2"><h2>${highsScore2.toFixed(2)}</h2></div>`
		var highScorePlace3 = `<div class="score center" id="score3"><h2>${highsScore3.toFixed(2)}</h2></div>`
		var highScorePlace4 = `<div class="score center" id="score4"><h2>${highsScore4.toFixed(2)}</h2></div>`
		var highScorePlace5 = `<div class="score center" id="score5"><h2>${highsScore5.toFixed(2)}</h2></div>`
		
		$("#highscores").append(highScorePlace1,highScorePlace2,highScorePlace3,highScorePlace4,highScorePlace5,resetButton);
		$("#"+redscore).css("color", "red");
		$("#highscores").toggle();
		
		
		$(".resetButton").click(function(){
			gameReset();
		});
		
		function gameReset(){
			$("#highscores").fadeToggle(100,function(){
				t=0;
				$(".timer").html(`<h1><div class="center">${t.toFixed(2)}</div></h1>`);
				$(".resetButton").remove();
				$(".score").remove();
				$(".startbutton").toggle();
				$(".redcircle").remove();
			});
		}
	}
});