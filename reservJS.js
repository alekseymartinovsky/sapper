const options = {
	level:  ["Новичок", "Любитель", "Профи"],
	numberLevel: 0,
	changeLevel(lvl){
		const level = document.getElementById('level');
		if((lvl == 1) && (this.numberLevel < 2)){
			this.numberLevel += 1;
			level.textContent = this.level[this.numberLevel];
		}else if((lvl == 0) && (this.numberLevel > 0)){
			this.numberLevel -= 1;
			level.textContent = this.level[this.numberLevel];
		}else if((lvl == 1) && (this.numberLevel == 2)){
			this.numberLevel = 0;
			level.textContent = this.level[this.numberLevel];
		}else if((lvl == 0) && (this.numberLevel == 0)){
			this.numberLevel = 2;
			level.textContent = this.level[this.numberLevel];
		}
		this.selectLevel(this.numberLevel);
	},
	horCell: [9, 16, 30],
	verCell: [9, 16, 16],
	numberBomb: [10, 40, 99],
	select: {
		width: 9,
		heigth: 9,
		bomb: 10,
		level: 'Новичок',
	},
	selectLevel(num){
		this.select.width = this.horCell[num];
		this.select.heigth = this.verCell[num];
		this.select.bomb = this.numberBomb[num];
		this.select.level = this.level[num];
	}
}

const game = {
	field: [],

	numberFlags: 0,

	status: true,

	start(){
		document.getElementById("flag").textContent = options.select.bomb;
		document.getElementById("options").hidden = true;
		document.getElementById("game").hidden = false;
		document.getElementById("all_result").hidden = true;
		document.getElementById("info_button").hidden = true;
		info.close();


		const table = document.getElementById("field");


		for(let i = 0; i < options.select.width; i++){

			const tr = document.createElement("tr");
			const trTable = table.appendChild(tr);

			for(let j = 0; j < options.select.heigth; j++){

				const id = this.createId(i, j);

				let tdTable = trTable;
				let td = document.createElement("td");

				tdTable = tdTable.appendChild(td);
				tdTable.id = id;
				tdTable.setAttribute("onclick", "game.click(this)");
				tdTable.oncontextmenu = function(e){
					e.preventDefault();
					game.flag(tdTable);
				}
				tdTable.setAttribute("class", "closeCell");
			}
		}

		this.fillField();
		this.fillBomb();
	},

	fillField(){
		for(let i = 0; i < options.select.width; i++){
			this.field.push([]);
			for(let j = 0; j < options.select.heigth; j++){
				this.field[i].push(0);
			}
		}
	},

	fillBomb(){
		let i = 0;
		while(i < options.select.bomb){
			const x = this.random(0, options.select.width-1);
			const y = this.random(0, options.select.heigth-1);
			if(this.field[x][y] != 10){
				this.field[x][y] = 10;
				//document.getElementById(this.createId(x, y)).textContent = 'A'; //убрать
				this.calcCell(x, y);
				i += 1;
			}
		}
	},

	calcCell(x, y){
		for(let i = -1; i < 2; i++){
			for(let j = -1; j < 2; j++){
				if((x + i >= 0) && (x + i < options.select.width) && (y + j >= 0) && (y + j < options.select.heigth)){
					if(this.field[x + i][y + j] != 10){
						this.field[x + i][y + j] += 1;
						//document.getElementById(this.createId((x + i),(y + j))).textContent = this.field[x + i][y + j];//убрать
					}
				}
			}
		}
	},

	click(obj){  
		if(this.status == true){
			if(obj.classList.contains("closeCell") && !(obj.classList.contains('flag'))){
				if(stopwatch.status == false){  //если таймер не запущен, такое состояние он имеет в начале игры, запускаем таймер
					stopwatch.start();
				}
	
				const x = +obj.id.slice(5, 7);
				const y = +obj.id.substr(7, 9);
				
				if(this.field[x][y] == 0){
					this.openEmpty(x, y);
					this.checkWin();
				}else if(this.field[x][y] == 10){
					//document.getElementById(this.createId(x, y)).classList.add("bombCell");
					this.gameOver();
				}else{
					this.openNumber(x, y, obj);
					this.checkWin();
				}
			}
		}
	},

	openEmpty(x, y){
		for(let i = -1; (i < 2); i++){
			for(let j = -1; (j < 2); j++){
				if((x + i >= 0) && (x + i < options.select.width) && (y + j >= 0) && (y + j < options.select.heigth)){
					if((this.field[x + i][y + j] == 0) && (document.getElementById(this.createId((x+i), (y+j))).classList.contains("closeCell"))){
						document.getElementById(this.createId((x + i), (y + j))).classList.remove("closeCell");
						document.getElementById(this.createId((x + i), (y + j))).classList.add("emptyCell");
						this.openEmpty((x + i), (y + j));
					}else if((this.field[x + i][y + j] < 10) && (document.getElementById(this.createId((x+i), (y+j))).classList.contains("closeCell"))){
						let obj = document.getElementById(this.createId((x + i), (y + j)));
						/*obj.classList.remove("closeCell");
						obj.classList.add("lotCell");
						obj.textContent = this.field[x + i][y + j];*/
						this.openNumber((x + i), (y + j), obj );
					}
				}
			}
		}
	},

	openNumber(x, y, obj){
		if(obj.classList.contains("closeCell")){
			obj.classList.remove("closeCell");
			if(this.field[x][y] <= 2){
				obj.classList.add("fewCell");
			}else if((this.field[x][y] > 2) && (this.field[x][y] < 5)){
				obj.classList.add("middleCell");
			}else if(this.field[x][y] >= 5){
				obj.classList.add("lotCell");
			}

			obj.textContent = this.field[x][y];
		}
	},

	flag(obj){
		if(obj.classList.contains("flag")){
			obj.classList.remove("flag");
			this.numberFlags -= 1;
			document.getElementById("flag").textContent = options.select.bomb - this.numberFlags;
		}else{
			if(options.select.bomb - this.numberFlags > 0){
				obj.classList.add("flag");
				this.numberFlags += 1;
				document.getElementById("flag").textContent = options.select.bomb - this.numberFlags;
			}
		}
	},

	checkWin(){
		let count = 0;
		for(let i = 0; i < options.select.width; i++){
			for(let j = 0; j < options.select.heigth; j++){
				let id = this.createId(i, j);
				const obj = document.getElementById(id);
				if(obj.classList.contains('closeCell')){
					count += 1;
				}
			}
		}
		if(count == options.select.bomb){
			this.gameWin();
		}
	},

	gameOver(){
		this.gameEnd();
		user.statusGame = 'lose';
		document.getElementById('timeGame').textContent = "Ваше время: --:--";
		document.getElementById('statusGame').textContent = "Проигрыш, попробуй ещё";
	},

	gameWin(){
		this.gameEnd();
		user.statusGame = 'win';
		document.getElementById('timeGame').textContent = "Ваше время: " + stopwatch.compileTime(user.time);
		if(localStorage.getItem(options.select.level) != null){
			if(localStorage.getItem(options.select.level) > user.time){
				document.getElementById('statusGame').textContent = "Новый рекорд!";
			}else{
				document.getElementById('statusGame').textContent = "Победа";
			}
		}else{
			document.getElementById('statusGame').textContent = "Вы установили рекорд!";
		}
	},

	gameEnd(){
		//document.getElementById('game').hidden = true;
		document.getElementById('result').hidden = false;

		const bestTime = document.getElementById('bestTime');

		if(localStorage.getItem(options.select.level) != null){

			bestTime.textContent = "Лучшее время: " + stopwatch.compileTime(localStorage.getItem(options.select.level));
		}else{
			bestTime.textContent = "Лучшее время: --:--";
		}
		

		this.openField();
		stopwatch.stop();
	},

	openField(){
		for(let i = 0; i < options.select.width; i++){
			for(let j = 0; j < options.select.heigth; j++){
				const id = this.createId(i, j);
				const obj = document.getElementById(id);

				if(obj.classList.contains("closeCell")){
					if(this.field[i][j] == 0){
						this.openEmpty(i, j);
					}else if((this.field[i][j] < 10) && (this.field[i][j] > 0)){
						this.openNumber(i, j, obj);
					}else if(this.field[i][j] == 10){
						obj.classList.remove("closeCell");
						obj.classList.add("bombCell");
					}
				}
			}
		}
	},

	newGame(){
		this.clearGame();
		document.getElementById('result').hidden = true;
		document.getElementById('options').hidden = false;
		document.getElementById('all_result').hidden = false;
		document.getElementById("info_button").hidden = false;
	},

	clearGame(){
		document.getElementById('field').childNodes.forEach((el) => el.remove());
		this.field = [];
	},

	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
	},

	createId(i, j){
		let id = 'cell_';
		if(i < 10){
			id += '0' + i;
		}else{
			id += i;
		}
		if(j < 10){
			id += '0' + j;
		}else{
			id += j;
		}
		return id;
	},
}

const user = {
	time: '',
	statusGame: '',
	set statusGame(val){
		if(val == 'win'){
			this.lastRes(options.select.level);
		}
	},
	lastRes(complexity){
		const lastRes = localStorage.getItem(complexity);
		if(lastRes == null){
			localStorage.setItem(complexity, this.time);
		}else{
			if(Number(lastRes) > this.time){
				localStorage.setItem(complexity, this.time);
			}
		}
	},
}

const stopwatch = {
	time: 0,
	status: false,

	start(){
		this.status = true;
		timer = setInterval(() => {
			stopwatch.time += 1;
			stopwatch.showTime(stopwatch.time);
		}, 1000);
	},

	stop(){
		clearInterval(timer);
		user.time = this.time;
		this.time = 0;
		this.status = false;
	},

	showTime(time){
		document.getElementById('stopwatch').textContent = this.compileTime(this.time);
	},

	compileTime(time){
		min = Math.trunc(time/60);
		sec = time - (min * 60);

		let res = '';
		
		if(min >= 10){
			res += min + ':';
		}else{
			res += '0' + min + ':';
		}

		if(sec >= 10){
			res += sec;
		}else{
			res += '0' + sec;
		}
		return res;
	},
}

const allRes = {
	show(){
		for(let i = 1; i <= 3; i++){
			const id =  'res_' + i;
			this.showRes(id, i-1);
		}
		this.status = true;
	},

	showRes(id, index){
		let obj = document.getElementById(id);
		if(localStorage.getItem(options.level[index])){
			obj.textContent = stopwatch.compileTime(localStorage.getItem(options.level[index]));
		}else{
			obj.textContent = '--:--';
		}
	},
}

const info = {
	statusHidden: true,

	click(){
		log(document.getElementById('regulations'));
		if(this.statusHidden == true){
			this.show();
		}else{
			this.close();
		}
	},

	show(){
		document.getElementById('regulations').hidden = false;
		this.statusHidden =  false;
		document.getElementById('i').hidden = true;
		document.getElementById('x').hidden = false;
	},

	close(){
		document.getElementById('regulations').hidden = true;
		this.statusHidden =  true;
		document.getElementById('i').hidden = false;
		document.getElementById('x').hidden = true;
	},
}

function log(param){
	console.log(param);
}

allRes.show();
