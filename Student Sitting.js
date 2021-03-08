// Matt Schiedermayer, UWO Spring 2021 - ELEM ED 110-004D
// Weekly Reflective Learning Journal - Week 5.
// Why Are All the White Students Sitting Together in College?
// Showing random picking of seats based on a majority - to display that we should actively seek out cross-racial interactions, 
// and shouldn't leave it to chance or bias by sitting next to same ethnicity

// Number of adjacent same ethnicity or other ethnicity will be values from 0-8, (8 total of both) for stating infrequent to frequent cross-racial seating
// 0 is never, 1-2 is low, 2-3 is infrequent, 4-5 is moderate, 5-6 is frequent, 7-8 is very frequent (near another ethnicity, or their own)

var log = console.log.bind(console);
var totalIterations = 10000;
var numSeats = 50; // using same number of students as seats
var seatsPerRow = 10; //for setting up the 2D seats array, to better view and detect adjacent students [COLUMNS]
var numSeatRows = numSeats / seatsPerRow; // [ROWS]
var studentMajorityPercent = 0.75;
var studentType = {
    white : "W",
    nonWhite : "NW"
}
var numStudents = {
    white : 0,
    nonWhite : 0
}
var students = new Array(numSeats); // will hold a student type for every element
//var studentsAdjacent =  new Array(numSeats); // each element, an object showing which ethnicity they are adjacent to {same: numSame, diff: numDifferent}
var studentSeated = new Array(numSeats);    // shows if same index(of "students" array) of student has already been seated : BOOLEAN
//var seatedOrder1D =  new Array(numSeats); // representation of the 2d seats array??
var seatedStudentsInfo; // for storing additional info about each student once they are seated
var seats;  // to set student type per seat - 2D array

var metrics = new Array();
var finalAvgMetrics = {
    whiteSamePercent : 0,
    whiteDiffPercent : 0,
    nonWhiteSamePercent : 0,
    nonWhiteDiffPercent : 0
}

loopMain();

function loopMain() {
    for (let iteration = 0; iteration < totalIterations; iteration++) {
        main();
    }
    let whiteSame = 0; 
    let whiteDiff = 0; 
    let nonWhiteSame = 0; 
    let nonWhiteDiff = 0;
    let len = metrics.length;
    for (let i = 0; i < len; i++) {
        met = metrics[i];
        whiteSame += met.whiteSamePercent;
        whiteDiff += met.whiteDiffPercent;
        nonWhiteSame += met.nonWhiteSamePercent;
        nonWhiteDiff += met.nonWhiteDiffPercent;
    }
    finalAvgMetrics.whiteSamePercent = whiteSame / len;
    finalAvgMetrics.whiteDiffPercent = whiteDiff / len;
    finalAvgMetrics.nonWhiteSamePercent = nonWhiteSame / len;
    finalAvgMetrics.nonWhiteDiffPercent = nonWhiteDiff / len;
    log("ALL ITERATIONS COMPLETE.  FINAL AVG METRIC OBJECT:  ", finalAvgMetrics);
}
//main();

function main() {
    resetSeats();   //initialize/clear seats
    //seats: ", seats);
    //log("seatedStudentsInfo: ", seatedStudentsInfo);
    setMajority(studentMajorityPercent);
    initStudents();
    let selectedStudent;
    for (let i = 0; i < students.length; i++) {
        selectedStudent = pickStudent();
        chooseSeatandSit(selectedStudent);        
    }
    //printClassroom();
    initAdjacents();
    findAdjacents();
    gatherMetrics();
    //log("END seatedStudentsInfo: ", seatedStudentsInfo);
    //log("For Checking Student in seat 25...");
    //log("students: ", students);
    //log("seatedStudentsInfo: ", seatedStudentsInfo);
    //log("Type: " + studentsAdjacent[25].type + ". same: " + 
        //studentsAdjacent[25].same + ". different: " + studentsAdjacent[25].diff +
        //". totalAdjacents: " + studentsAdjacent[25].totalAdjacents);
}

function gatherMetrics() {
    let metricObj = {
        whiteSamePercent : 0,
        whiteDiffPercent : 0,
        nonWhiteSamePercent : 0,
        nonWhiteDiffPercent : 0
    }
    // arrays to push each students info to, for final average to put into this iteration
    let whiteSame = new Array();
    let whiteDiff = new Array();
    let nonWhiteDiff = new Array();
    let nonWhiteSame = new Array();

    for (let i = 0; i < numSeatRows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            currentObj = seatedStudentsInfo[i][j];
            let samePercent = currentObj.same / currentObj.totalAdjacents * 100;
            let diffPercent = currentObj.diff / currentObj.totalAdjacents * 100;
            if(currentObj.type == "W") {    //white case
                whiteSame.push(samePercent);
                whiteDiff.push(diffPercent);
            } else {    //non-white case
                nonWhiteSame.push(samePercent);
                nonWhiteDiff.push(diffPercent);
            }
        }
    }
    //log("whiteSame: ", whiteSame);
    //log("whiteDiff: ", whiteDiff);
    //log("nonWhiteSame: ", nonWhiteSame);
    //log("nonWhiteSame: ", nonWhiteDiff);
    let whiteSameTotal = 0;
    for (let i = 0; i < whiteSame.length; i++) {
        whiteSameTotal += whiteSame[i];
    }
    metricObj.whiteSamePercent = whiteSameTotal / whiteSame.length;
    let whiteDiffTotal = 0;
    for (let i = 0; i < whiteDiff.length; i++) {
        whiteDiffTotal += whiteDiff[i];
    }
    metricObj.whiteDiffPercent = whiteDiffTotal / whiteDiff.length;
    let nonWhiteSameTotal = 0;
    for (let i = 0; i < nonWhiteSame.length; i++) {
        nonWhiteSameTotal += nonWhiteSame[i];
    }
    metricObj.nonWhiteSamePercent = nonWhiteSameTotal / nonWhiteSame.length;
    let nonWhiteDiffTotal = 0;
    for (let i = 0; i < nonWhiteDiff.length; i++) {
        nonWhiteDiffTotal += nonWhiteDiff[i];
    }
    metricObj.nonWhiteDiffPercent = nonWhiteDiffTotal / nonWhiteDiff.length;
    //log("Gather Metrics Object: ", metricObj);
    metrics.push(metricObj);
}

function avgMetrics() {

}

function printClassroom() {
    log("All Students Seated.  Classroom Seats:");
    log(seats);
}

function initAdjacents() {
    //log("initAdjacents.  seats: ", seats);
    let obj;
    for (let i = 0; i < numSeatRows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            //log("seats[i][j]: "+ seats[i][j]);
            obj = new Object();
            obj.type = seats[i][j];
            //obj.originalIndex = students[get1DFrom2DSeat(i,j)];
            obj.same = 0;
            obj.diff = 0;
            obj.totalAdjacents = 0;
            seatedStudentsInfo[i][j] = obj;
            //log("seatedStudentsInfo[" + i + "][" + j + "]: ");
            //log(seatedStudentsInfo[i][j]);
        }
    }
}

function findAdjacents() {
    for (let i = 0; i < numSeatRows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            if (checkInBounds(i-1,j)) checkSameDiff(i, j, i-1, j); // top
            if (checkInBounds(i-1,j+1)) checkSameDiff(i, j, i-1, j+1); // top-right
            if (checkInBounds(i,j+1)) checkSameDiff(i, j, i, j+1); // right
            if (checkInBounds(i+1,j+1)) checkSameDiff(i, j, i+1, j+1); // bottom-right
            if (checkInBounds(i+1,j)) checkSameDiff(i, j, i+1, j); // bottom
            if (checkInBounds(i+1,j-1)) checkSameDiff(i, j, i+1, j-1); // bottom-left
            if (checkInBounds(i,j-1)) checkSameDiff(i, j, i, j-1); // left
            if (checkInBounds(i-1,j-1)) checkSameDiff(i, j, i-1, j-1); // top-left
        }
    }
}

function checkInBounds(row, col) {
    
    let inBounds = true;
    if (row < 0 || row >= numSeatRows) inBounds = false;
    if (col < 0 || col >= seatsPerRow) inBounds = false;
    //log("checkInBounds! row: " + row + ". col: " + col + ". returning: " + inBounds);
    return inBounds;
}

function checkSameDiff(row, col, checkRow, checkCol) {
    //log("checkSameDiff!  row: " + row + ". col: " + col + ". checkRow: " + checkRow + ". checkCol: " + checkCol +"."); 
    //log("seats[row][col]: " + seats[row][col] +". seats[checkRow][checkCol]: " + seats[checkRow][checkCol]);
    //let student = get1DFrom2DSeat(row, col);
    //log("1D from 2D student number: " + student);
    let obj = seatedStudentsInfo[row][col];
    //log("Student Info Object: ", obj);
    if (seats[row][col] == seats[checkRow][checkCol]) obj.same++;
    else obj.diff++;

    obj.totalAdjacents++;
}

// called AFTER majority has been set based on percentage
function initStudents() {      
    // Setting array of all students' types
    // all white then all non whites are put in sequentially, but will be randomly selected from for sitting turns
    for (let i = 0; i < numStudents.white; i++) {
        //log ("setting student " + i + " to: " + studentType.white);
        students[i] = studentType.white;
    }
    //log ("numSeats - numStudents.nonWhite: " + (numSeats - numStudents.nonWhite));
    for (let i = (numSeats - numStudents.nonWhite); i < numSeats; i++) {
        //log ("setting student " + i + " to: " + studentType.nonWhite);
        students[i] = studentType.nonWhite;
    }
    //log("After initStudent(), students: ", students);
}

function pickStudent() {
    let studentSelected = getRandomInt(numSeats); // random student
    while (studentSeated[studentSelected]) {    // true = already seated
        //log("Student [" + studentSelected + "] has already been seated. Retrying...");
        studentSelected = getRandomInt(numSeats); // select again and re-check
    }
    return studentSelected;
}

function setMajority(majorityPercent) {
    numMajority = Math.ceil(numSeats * studentMajorityPercent);
    numMinority = Math.floor(numSeats * (1 - studentMajorityPercent));
    numStudents.white = numMajority;
    numStudents.nonWhite = numMinority;
    //log("numSeats: " + numSeats + ". numMajority: " + numMajority + ". numMinority: " + numMinority + ". " +
     //"numStudents.white: " + numStudents.white + ". numStudents.nonWhite: " + numStudents.nonWhite + ".");
}

function  chooseSeatandSit(selectedStudent) {
    selectedSeat = getRandomInt(numSeats); // random seat - needs to be checked if it is already taken
    seat2DObj = get2DFrom1DSeat(selectedSeat);
    //log("1D Seat: " + selectedSeat + ". 2D seat Object: ", seat2DObj);
    let row = seat2DObj.row;
    let col = seat2DObj.column;
    let seatValue = seats[row][col];
    //log("Conditional: (typeof seatValue === 'string') || (seatValue instanceof String) : " + ((typeof seatValue === 'string') || (seatValue instanceof String)));
    //return;
    while ((typeof seatValue === 'string') || (seatValue instanceof String)) {        
        selectedSeat = getRandomInt(numSeats);
        seat2DObj = get2DFrom1DSeat(selectedSeat);
        
        //log("Seat " + selectedSeat + " [" + row + "][" + col + "] already taken, retrying...");
        row = seat2DObj.row;
        col = seat2DObj.column;
        seatValue = seats[row][col];
    }
    seats[row][col] = students[selectedStudent];
    studentSeated[selectedStudent] = true;
    //log("Student " + selectedStudent + " (type: " + students[selectedStudent] + ") successfully sat in seat " +
        //selectedSeat + " [" + row + "][" + col + "]");
}

function get2DFrom1DSeat (seat1D) {
    let column = seat1D % seatsPerRow;
    let row = (seat1D - column) / seatsPerRow;
    //log("this.row: " + this.row + ". this.column: " + this.column);
    let obj = {row: row, column: column};
    return obj;
}

function get1DFrom2DSeat (row, col) {
    //log("get1DFrom2DSeat.  row: " + row +". col: " + col);
    return (row * 10 + col);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function resetSeats() {
    seats = new Array(numSeatRows);
    seatedStudentsInfo = new Array(numSeatRows);
    //log("seats after init: ", seats);
    for (let i = 0; i < seats.length; i++) {
        seats[i] = new Array(seatsPerRow);
        seatedStudentsInfo[i] = new Array(seatsPerRow);
    }
    // seats now is 2D array, seats[Rows][Columns]

    // resetting to show no student is yet seated
    for (let i = 0; i < studentSeated.length; i++) {
        studentSeated[i] = false;
    }
}