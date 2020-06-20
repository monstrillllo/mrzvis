google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawGraphics);

var m;
var p;
var q;

var tSum;
var tDifference;
var tMultiplicity;
var tDivision;
var tComparation;
var timeTable;

var callSum;
var callDifference;
var callMultiplicity;
var callDivision;
var callComparation;

var n;
var r;
var T1;
var Tn;
var Ky;
var E;
var D;
var Lsum
var Lavg;
var implicationStageBranch1, implicationStageBranch2;

var informationTable;
var a;
var b;
var e;
var g;
var c;
var f;
var d;

//Запуск программы
function launch() {
    if (!readParameters()) {
        return false;
    }
    initializeParameters();
    writeParameters();
}

//Чтение вводимых данных
function readParameters() {
    m = +document.getElementById("m").value;
    p = +document.getElementById("p").value;
    q = +document.getElementById("q").value;
    n = +document.getElementById("n").value;
    if (isNaN(m) || m < 1 || isNaN(p) || p < 1 || isNaN(q) || q < 1 || isNaN(n) || n < 1) {
        alert("Параметр m, p, q или n введены неправильно");
        return false;
    }
    tSum = +document.getElementById("tSum").value;
    tDifference = +document.getElementById("tDifference").value;
    tMultiplicity = +document.getElementById("tMultiplicity").value;
    tDivision = +document.getElementById("tDivision").value;
    tComparation = +document.getElementById("tComparation").value;
    if (isNaN(tSum) || tSum < 1 || isNaN(tDifference) || tDifference < 1 
        || isNaN(tMultiplicity) || tMultiplicity < 1
        || isNaN(tDivision) || tDivision < 1 || isNaN(tComparation) || tComparation < 1) {
        alert("Параметры времени введены неправильно");
        return false;
    }
    return true;
}

//Вычисление всех значений
function initializeParameters() {
	r = p * q * m;
	implicationStageBranch1 = 0;
	implicationStageBranch2 = 0;
	Lsum = 0;
    callSum = 0;
    callDifference = 0;
    callMultiplicity = 0;
    callDivision = 0;
    callComparation = 0;
    Tn = 0;
    a = generateMatrix(p, m);
    b = generateMatrix(m, q);
    e = generateMatrix(1, m);
    g = generateMatrix(p, q);
    d = getDijk();
    f = getFijk();
    c = getCij();
    var allSumTime = tSum * callSum;
    var allDifferenceTime = tDifference * callDifference;
    var allMultiplicityTime = tMultiplicity * callMultiplicity;
    var allDivisionTime = tDivision * callDivision;
    var allComparationTime = tComparation * callComparation;
    var allTime = allSumTime + allDifferenceTime + allMultiplicityTime + allDivisionTime + allComparationTime;  
    T1 = allTime;
    Ky = T1 / Tn;
    E = Ky / n;
    Lavg = calculateLavg();
    D = Lsum / Lavg;
    timeTable = [["Операция", "Cложение", "Вычитание", "Умножение", "Деление", "Сравнение"],
                 ["Время", tSum, tDifference, tMultiplicity, tDivision, tComparation],
                 ["Cуммарное время операций", allSumTime, allDifferenceTime, allMultiplicityTime, allDivisionTime, allComparationTime]];
    informationTable = [["n", "r", "T1", "Tn", "Ky", "e", "Lsum", "Lavg", "D"],
    					[n, r, T1, Tn, Ky, E, Lsum, Lavg, D]];
}

function writeParameters() {
	drawTable(a, p, m, "a");
    drawTable(b, m, q, "b");
    drawTable(e, 1, m, "e");
    drawTable(g, p, q, "g");
    drawTable(c, p, q, "c");
    drawTable(timeTable, 3, 6, "timeTable");
    drawTable(informationTable, 2, 9, "informationTable");
}

//Отрисовка таблицы
function drawTable(argument, rows, columns, tableName) {
	var htmlCode = "";
    for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
    	htmlCode += "<tr>";
    	for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
        	htmlCode += "<td>" + argument[rowIndex][columnIndex] + "</td>";
        }
        htmlCode += "</tr>";
    }
    document.getElementById(tableName).innerHTML = htmlCode;
}

//Генерация матрицы
function generateMatrix(rows, columns) {
    var matrix = [];
    for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
        matrix[rowIndex] = [];
        for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
            matrix[rowIndex][columnIndex] = Math.random() * 2 - 1;
        }
    }
    return matrix;
}

//Вычисление D
function getDijk() {
    var result = [];
    for (var i = 0; i < p; i++) {
        result[i] = [];
        for (var j = 0; j < q; j++) {
            result[i][j] = [];
            for (var k = 0; k < m; k++) {
            	callMultiplicity++;
                result[i][j][k] = a[i][k] * b[k][j];
            }
        }
    }
    var time = tMultiplicity * Math.ceil(p * q * m / n);
    Lsum += time;
    Tn += time;
    return result;
}

//Вычисление F
function getFijk() {
    var result = [];
    var implication1 = 0;
    var implication2 = 0;
    var implication3 = 0;
    for (var i = 0; i < p; i++) {
        result[i] = [];
        for (var j = 0; j < q; j++) {
            result[i][j] = [];
            for (var k = 0; k < m; k++) {
            	callMultiplicity += 7;
    			callDifference += 3;
    			callSum += 2;
                result[i][j][k] = implication(a[i][k], b[k][j]) * (2 * e[0][k] - 1) * e[0][k] + 
                                  implication(b[k][j], a[i][k]) * (1 + (4 * implication(a[i][k], b[k][j]) - 2) * e[0][k]) * (1 - e[0][k]);
                if (a[i][k] === 1) {
                	implication1++;
                } else {
                	if (b[k][j] === 1) {
                		implication2++;
                	} else {
                		implication3++;
                	}
                }
            }
        }
    }
    var time = (7 * tMultiplicity + 2 * tSum + 3 * tDifference + 3 * (tDivision + tDifference + 2 * tComparation)) * Math.ceil(implication3 / n);
    time += (7 * tMultiplicity + 2 * tSum + 3 * tDifference + 2 * (tDivision + tDifference + 2 * tComparation) + tComparation) * Math.ceil(implication2 / n);
    time += (7 * tMultiplicity + 2 * tSum + 3 * tDifference + 1 * (tDivision + tDifference + 2 * tComparation) + 2 * tComparation) * Math.ceil(implication1 / n);
    Lsum += time;
    Tn += time;
    return result;
}

//Вычисление матрицы C
function getCij() {
	var time = 0;
    var result = [];
    for (var i = 0; i < p; i++) {
        result[i] = [];
        for (var j = 0; j < q; j++) {
        	callMultiplicity += 8;
            callSum += 2;
            callDifference += 3;
            result[i][j] = notAndF(i, j) * (3 * g[i][j] - 1) * g[i][j] + 
                           (notOrD(i, j) + (4 * notAndF(i, j) * notOrD(i, j) - 3 * notOrD(i, j)) * g[i][j]) * (1 - g[i][j]);
        }
    }
    var time = (8 * tMultiplicity + 2 * tSum + 3 * tDifference + 2 * (m - 1) * tMultiplicity + 3 * (tDifference * m + tMultiplicity * (m - 1) + tDifference)) * Math.ceil(p * q / n);
	Lsum += time
    Tn += time;
    return result;
}

//Вычисление функции не или F
function notAndF(i, j) {
    var result = 1;
    for (var k = 0; k < m; k++) {
        result *= f[i][j][k];
    }
    callMultiplicity += m - 1;
    return result;
}

//Вычисление функции не или D
function notOrD(i, j) {
    var result = 1;
    for (var k = 0; k < m; k++) {
        callDifference++;
        result *= 1 - d[i][j][k];
    }
    callMultiplicity += m - 1;
    callDifference++;
    return 1 - result;
}

//Вычисление импликации
function implication(arg1, arg2) {
	callComparation++;
    if (arg1 === 1) {
    	implicationStageBranch1++;
        return 1;
    } else {
    	implicationStageBranch2++;
    	callDivision++;
    	callDifference++;
    	callComparation++;
    	var result = arg2 / (1 - arg1);
    	return result > 1 ? 1 : result;
    }
}

//Подсчет Lavg
function calculateLavg() {
	//Dijk
	var L = tMultiplicity * m * p * q;

	//Fijk
	L += (7 * tMultiplicity + 2 * tSum + 3 * tDifference) * m * p * q;
	//Implication
	L += implicationStageBranch1 * tComparation + implicationStageBranch2 * (tDivision + 2 * tComparation + tDifference);

	//Cij
	L += (8 * tMultiplicity + 2 * tSum + 3 * tDifference) * p * q;
	//notAndF
	L += (tDifference * m + tDifference + tMultiplicity * (m - 1)) * 3 * p * q;
	//notOrD
	L += tMultiplicity * (m - 1) * 2 * p * q;
	
	return Math.ceil(L / r);
}

function drawGraphics() {
	var KyN1 = [];
	var KyN2 = [];
	var KyN3 = [];
	var KyN4 = [];
	var En1 = [];
	var En2 = [];
	var En3 = [];
	var En4 = [];
	var Dn1 = [];
	var Dn2 = [];
	var Dn3 = [];
	var Dn4 = [];
	var KyN = [];
	var En = [];
	var Dn = [];
	for (var i = 1; i <= 50; i++) {
		calculate(1, 1, 1, i);
		KyN1.push(Ky);
		En1.push(Ky / n);
		Dn1.push(D);
		calculate(2, 1, 1, i);
		KyN2.push(Ky);
		En2.push(Ky / n);
		Dn2.push(D);
		calculate(3, 1, 1, i);
		KyN3.push(Ky);
		En3.push(Ky / n);
		Dn3.push(D);
		calculate(4, 1, 1, i);
		KyN4.push(Ky);
		En4.push(Ky / n);
		Dn4.push(D);
		KyN.push([i, KyN1[i - 1], KyN2[i - 1], KyN3[i - 1], KyN4[i - 1]]);
		En.push([i, En1[i - 1], En2[i - 1], En3[i - 1], En4[i - 1]]);
		Dn.push([i, Dn1[i - 1], Dn2[i - 1], Dn3[i - 1], Dn4[i - 1]]);
	}
	var KyR1 = [];
	var KyR2 = [];
	var KyR3 = [];
	var KyR4 = [];
	var Er1 = [];
	var Er2 = [];
	var Er3 = [];
	var Er4 = [];
	var Dr1 = [];
	var Dr2 = [];
	var Dr3 = [];
	var Dr4 = [];
	var KyR = [];
	var Er = [];
	var Dr = [];
	for (var i = 1; i <= 50; i++) {
		calculate(i, 1, 1, 1);
		KyR1.push(Ky);
		Er1.push(Ky / 1);
		Dr1.push(D);
		calculate(i, 1, 1, 2);
		KyR2.push(Ky);
		Er2.push(Ky / 2);
		Dr2.push(D);
		calculate(i, 1, 1, 3);
		KyR3.push(Ky);
		Er3.push(Ky / 3);
		Dr3.push(D);
		calculate(i, 1, 1, 4);
		KyR4.push(Ky);
		Er4.push(Ky / 4);
		Dr4.push(D);
		KyR.push([i, KyR1[i - 1], KyR2[i - 1], KyR3[i - 1], KyR4[i - 1]]);
		Er.push([i, Er1[i - 1], Er2[i - 1], Er3[i - 1], Er4[i - 1]]);
		Dr.push([i, Dr1[i - 1], Dr2[i - 1], Dr3[i - 1], Dr4[i - 1]]);
	}
	drawGraphic("1", "2", "3", "4", KyN, "n", "Ky", "g1");
	drawGraphic("1", "2", "3", "4", En, "n", "e", "g2");
	drawGraphic("1", "2", "3", "4", Dn, "n", "D", "g3");
	drawGraphic("1", "2", "3", "4", KyR, "r", "Ky", "g4");
	drawGraphic("1", "2", "3", "4", Er, "r", "e", "g5");
	drawGraphic("1", "2", "3", "4", Dr, "r", "D", "g6");
}

function calculate(m, p, q, n) {
	readParameters();
	this.m = m;
	this.p = p;
	this.q = q;
	this.n = n;
	initializeParameters();
}
