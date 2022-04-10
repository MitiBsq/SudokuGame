//Declaring the global variables
const theWinningCombination = generate9x9Array();
//For tracking the last mouse action of the player
let lastClicked = '';

//Event Function for showing the rules button
document.getElementById('goRules').addEventListener('click', showRules);
function showRules() {
    addSomeFeatures('flex');
    document.getElementById('readyToPlay').addEventListener('click', playTheGame);
}

//Starting the generative functions
//Main function of the Game
document.getElementById('justPlay').addEventListener('click', playTheGame);
function playTheGame() {
    document.getElementById('theGame').style.display = 'flex';
    addSomeFeatures('none');
    generateTheNumbers();
    generateTheGameBox();
    generateTheNumPad();
    generateCheckButtons();
    helpThePlayer();
    createTheBoxes();
    document.getElementById('infoText').innerText = 'Your Sudoku game is ready to play';
}

//Function for generating the table Solutions(the Winning combinations) 
function generateTheNumbers() {
    const theNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    while (theNumbers.length !== 0) {
        let random = Math.floor(Math.random() * theNumbers.length);
        theWinningCombination[0].push(theNumbers[random]);
        theNumbers.splice(random, 1)
    }
    for (let i = 1; i < 9; ++i) {
        while (theWinningCombination[i].length < 9) {
            if (theWinningCombination[i].length < 3) {
                if (i === 3 || i === 6) {
                    pushIntoTheArray(i, 1, 4);
                } else {
                    pushIntoTheArray(i, 3, 6);
                }
            } else if (theWinningCombination[i].length >= 3 && theWinningCombination[i].length < 6) {
                if (i === 3 || i === 6) {
                    pushIntoTheArray(i, 4, 7);
                } else {
                    pushIntoTheArray(i, 6, 9);
                }
            } else {
                if (i === 3 || i === 6) {
                    pushIntoTheArray(i, 7, 9, 'firstElement');
                } else {
                    pushIntoTheArray(i, 0, 3);
                }
            }
        }
    }
}

//Helping to push into the winning combinations array
function pushIntoTheArray(theRow, columnStart, columnEnd, ifFirst) {
    for (let j = columnStart; j < columnEnd; ++j) {
        theWinningCombination[theRow].push(theWinningCombination[theRow - 1][j]);
    }
    if (ifFirst === 'firstElement') {
        theWinningCombination[theRow].push(theWinningCombination[theRow - 1][0]);
    }
}

//Function for generating the gameBox (the table)
function generateTheGameBox() {
    const theGameBox = document.createElement('table');
    theGameBox.id = 'theGameBox';
    document.getElementById('theGameBoxPlace').appendChild(theGameBox);
    for (let i = 0; i < 9; ++i) {
        const insideRow = document.getElementById('theGameBox').insertRow(i);
        insideRow.id = 'row' + i;
        for (let j = 0; j < 9; ++j) {
            const theBox = insideRow.insertCell(j);
            theBox.id = insideRow.id + 'C' + j;
            theBox.className = 'theBox';
            theBox.style.color = 'black';
            //Setting the table cell 'theBox' to 'act like an input' and adding events to it
            theBox.setAttribute('tabindex', '10000');
            //Hover events(highlight only)
            theBox.addEventListener('mouseenter', function (event) {
                highlightTheItems(theBox, insideRow, j)
            });
            theBox.addEventListener('mouseleave', function (event) {
                clearTheHighlight(theBox, insideRow, j);
            });
            //Click event for focus
            theBox.addEventListener('click', () => {
                if (theBox.hasAttribute('tabindex')) {
                    theBox.style.backgroundColor = '#d1bea8';
                }
                if (lastClicked !== '' && lastClicked !== theBox.id && document.getElementById(lastClicked).hasAttribute('tabindex')) {
                    if (document.getElementById(lastClicked).className.split(' ')[1] === theBox.className.split(' ')[1] || lastClicked[5] === theBox.id[5]) {
                        document.getElementById(lastClicked).style.backgroundColor = 'blanchedalmond';
                    } else {
                        document.getElementById(lastClicked).style.backgroundColor = 'transparent';
                    }
                }
                lastClicked = theBox.id;
                //Keyboard event for inserting values
                theBox.addEventListener('keydown', (event) => {
                    if (event.key > 0 && event.key < 10) {
                        theBox.innerText = event.key;
                        theBox.style.color = 'black';
                        if (autoCheck === true) {
                            checkTheValue(i, j, theBox.id);
                        }
                    } else if (event.key == 'Tab') {
                        //"removing" the "Tab" keypad default function(focusing next)
                        event.preventDefault();
                    } else if (event.key == 'Backspace') {
                        theBox.innerText = '';
                    } else if (event.key == '`') {
                        showHint();
                    }
                });
            });
        }
    }
    designTheTable();
}

//Function for generating the virtual numPad
function generateTheNumPad() {
    const theNumPad = document.createElement('div');
    theNumPad.id = 'theNumePad';
    document.getElementById('theGame').appendChild(theNumPad);
    const optionButtonsPlace = document.createElement('div');
    optionButtonsPlace.id = 'optionButtons';
    theNumPad.appendChild(optionButtonsPlace);
    const theNumbersPlace = document.createElement('div');
    theNumbersPlace.id = 'theNumbers';
    theNumPad.appendChild(theNumbersPlace);
    let j;
    for (let i = 0; i < 9; ++i) {
        if (i === 0 || i === 1) {
            const optionButtons = document.createElement('button');
            optionButtons.className = "btn btn-secondary btn-lg";
            if (i === 0) {
                optionButtons.innerText = 'Delete';
                optionButtons.addEventListener('click', () => {
                    if (lastClicked !== '') {
                        document.getElementById(lastClicked).innerText = '';
                    }
                })
            } else {
                optionButtons.innerText = 'Hint';
                optionButtons.addEventListener('click', showHint);
            }
            document.getElementById('optionButtons').appendChild(optionButtons);
        }
        if (i === 0 || i === 3 || i === 6) {
            j = i;
            const theDiv = document.createElement('div');
            theDiv.className = "btn-group";
            theDiv.id = 'div' + j;
            document.getElementById('theNumbers').appendChild(theDiv);
        }
        const theButtons = document.createElement('button');
        theButtons.className = "btn btn-outline-secondary";
        theButtons.innerText = i + 1;
        document.getElementById('div' + j).appendChild(theButtons);
        theButtons.addEventListener('click', () => {
            if (lastClicked !== '') {
                document.getElementById(lastClicked).innerText = theButtons.innerText;
                if (autoCheck === true) {
                    checkTheValue(lastClicked[3], lastClicked[5], lastClicked);
                }
            }
        });
        if (i === 8) {
            const newGame = document.createElement('button');
            newGame.className = "btn btn-outline-secondary";
            newGame.innerText = 'New Game';
            document.getElementById('theNumbers').appendChild(newGame);
            newGame.addEventListener('click', () => {
                newGameFunction()
            });
        }
    }
}

//Event function for showing a hint (button "hint" or keypad " ` ")
function showHint() {
    if (lastClicked !== '') {
        let i = lastClicked[3];
        let j = lastClicked[5];
        document.getElementById(lastClicked).innerText = theWinningCombination[i][j];
        document.getElementById(lastClicked).style.color = 'green';
    }
}

//Function for generating the check/auto-check buttons
let autoCheck = false;
function generateCheckButtons() {
    const checkAnswer = document.createElement('div');
    checkAnswer.id = "checkAnswer";
    document.body.appendChild(checkAnswer);
    const checkButton = document.createElement('button');
    checkButton.className = 'btn btn-secondary';
    checkButton.innerText = 'Check Your Game';
    checkButton.addEventListener('click', checkGameStatus);
    checkAnswer.appendChild(checkButton);
    const switchPlace = document.createElement('div');
    switchPlace.id = 'switchPlace';
    switchPlace.className = 'form-check form-switch';
    checkAnswer.appendChild(switchPlace);
    const switchButton = document.createElement('input');
    switchButton.type = 'checkbox';
    switchButton.setAttribute('role', 'switch');
    switchButton.id = "flexSwitchCheckDefault";
    switchButton.className = 'form-check-input';
    const label = document.createElement('label');
    label.className = "form-check-label";
    label.setAttribute('for', 'flexSwitchCheckDefault');
    label.innerText = 'EasyMode(Auto-Check mistakes)';
    switchPlace.appendChild(label);
    switchPlace.appendChild(switchButton);
    switchButton.addEventListener('click', () => {
        if (autoCheck === false) {
            autoCheck = true;
        } else {
            autoCheck = false;
        }
    });
}

//Function that revels some answer spots for helping the player(sets the clues of game)
function helpThePlayer() {
    const randomNumberShow = ['2', '3', '3', '4', '5', '4', '5', '6', '7'];
    for (let i = 0; i < 9; ++i) {
        let selectRandom = Math.floor(Math.random() * randomNumberShow.length);
        let count = randomNumberShow[selectRandom];
        const frecv = new Array();
        while (count > 0) {
            let random = Math.floor(Math.random() * 9);
            if (frecv[random] === undefined) {
                frecv[random] = 1;
                document.getElementById('row' + i + 'C' + random).innerText = theWinningCombination[i][random];
                document.getElementById('row' + i + 'C' + random).style.color = '#585858';
                disableTheBox(i, random);
                --count;
            }
        }
        randomNumberShow.splice(selectRandom, 1);
    }
}

//Function for creating the main 3x3 boxes inside the table(just for helping to style the game(to highlight))
const theBoxes = generate9x9Array();
function createTheBoxes() {
    let start = 0;
    let end = 3;
    for (let i = 0; i < 9; ++i) {
        for (let j = start; j < end; ++j) {
            theBoxes[i].push(document.getElementsByTagName('td')[j]);
            theBoxes[i].push(document.getElementsByTagName('td')[j + 9]);
            theBoxes[i].push(document.getElementsByTagName('td')[j + 18]);
        }
        if (start === 6 || start === 33) {
            start += 21;
            end += 21;
        } else {
            start += 3;
            end += 3;
        }
    }
    for (let i = 0; i < 9; ++i) {
        theBoxes[i].forEach((element) => {
            element.classList.add('theBox' + i)
        });
    }
}

//Helps to create an simple 9x9 unfilled array
function generate9x9Array() {
    const theArray = new Array(9);
    for (let i = 0; i < theArray.length; ++i) {
        theArray[i] = new Array();
    }
    return theArray;
}

//Function for checking if the game can be  finished or not 
function checkGameStatus() {
    let check = 0;
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (document.getElementById('row' + i + 'C' + j).hasAttribute('tabindex')) {
                if (document.getElementById('row' + i + 'C' + j).innerText === theWinningCombination[i][j]) {
                    document.getElementById('row' + i + 'C' + j).style.background = 'greenYellow';
                    document.getElementById('row' + i + 'C' + j).style.color = 'black';
                    disableTheBox(i, j);
                    ++check;
                } else if (document.getElementById('row' + i + 'C' + j).innerText !== theWinningCombination[i][j] && document.getElementById('row' + i + 'C' + j).innerText !== '') {
                    document.getElementById('row' + i + 'C' + j).style.color = 'red';
                }
            } else {
                ++check;
            }
        }
    }
    if (check === 81) {
        document.getElementById('infoText').innerText = "Congratulation, you solved the puzzle";
        setTimeout(() => {
            newGameFunction('gameFinished');
        }, 1.0 * 3000);
    } else {
        document.getElementById('infoText').innerText = "You are not finished yet";
    }
}

//Function for auto-checking if the value is good or not (auto-check:'ON' only)
function checkTheValue(theRow, theColumn, theBoxId) {
    for (let i = 0; i < 9; ++i) {
        if (document.getElementById('row' + theRow + 'C' + i).innerText === document.getElementById(theBoxId).innerText && theBoxId !== 'row' + theRow + 'C' + i) {
            document.getElementById(theBoxId).style.color = 'red';
            document.getElementById('row' + theRow + 'C' + i).style.color = 'red';
            setTimeout(() => {
                if (document.getElementById('row' + theRow + 'C' + i).hasAttribute('tabindex') === false) {
                    document.getElementById('row' + theRow + 'C' + i).style.color = '#585858';
                }
            }, 1.0 * 2500);
        }
        if (document.getElementsByClassName(document.getElementById(theBoxId).className.split(' ')[1])[i].innerText === document.getElementById(theBoxId).innerText && document.getElementsByClassName(document.getElementById(theBoxId).className.split(' ')[1])[i].id !== theBoxId) {
            document.getElementsByClassName(document.getElementById(theBoxId).className.split(' ')[1])[i].style.color = 'red'
            document.getElementById(theBoxId).style.color = 'red';
            setTimeout(() => {
                if (document.getElementsByClassName(document.getElementById(theBoxId).className.split(' ')[1])[i].hasAttribute('tabindex') === false) {
                    document.getElementsByClassName(document.getElementById(theBoxId).className.split(' ')[1])[i].style.color = '#585858';
                }
            }, 1.0 * 2500);
        }
        if (document.getElementById('row' + i + 'C' + theColumn).innerText === document.getElementById(theBoxId).innerText && theBoxId !== 'row' + i + 'C' + theColumn) {
            document.getElementById('row' + i + 'C' + theColumn).style.color = 'red';
            document.getElementById(theBoxId).style.color = 'red'
            setTimeout(() => {
                if (document.getElementById('row' + i + 'C' + theColumn).hasAttribute('tabindex') === false) {
                    document.getElementById('row' + i + 'C' + theColumn).style.color = '#585858';
                }
            }, 1.0 * 2500);
        }
    }
}

//Function for starting/restarting a new game session
function newGameFunction(gameFinished) {
    document.getElementById('theGame').style.display = 'none';
    document.getElementById('checkAnswer').style.display = 'none';
    const yesNo = document.createElement('div');
    yesNo.id = "yesNo";
    document.body.appendChild(yesNo);
    const yesButton = document.createElement('button');
    yesButton.className = "btn btn-dark btn-sm";
    yesNo.appendChild(yesButton);
    yesButton.addEventListener('click', restartGame);
    if (gameFinished === 'gameFinished') {
        document.getElementById('infoText').innerText = 'Do you want to start a new Game?';
        yesButton.innerText = "Start New Game";
    } else {
        document.getElementById('infoText').innerText = 'Are you sure you want to delete your curent progress?';
        yesButton.innerText = "YES";
        const noButton = document.createElement('button');
        noButton.innerText = "NO";
        noButton.className = "btn btn-dark btn-sm";
        yesNo.appendChild(noButton);
        noButton.addEventListener('click', () => {
            document.getElementById('theGame').style.display = 'flex';
            document.getElementById('checkAnswer').style.display = 'flex';
            yesNo.remove();
            document.getElementById('infoText').innerText = 'Still at your last progress';
        });
    }
}

//Function for restarting the game(removing features)
function restartGame() {
    document.getElementById('theGameBox').remove();
    document.getElementById('checkAnswer').remove();
    if (document.getElementById('yesNo')) {
        document.getElementById('yesNo').remove();
    }
    document.getElementById('theNumePad').remove();
    playTheGame();
}

//Function for helping the environment setup
function addSomeFeatures(displayStyle) {
    if (document.getElementById('header')) {
        document.getElementById('header').innerText = 'Sudoku.miti';
        document.getElementById('header').style.textAlign='start';
        document.getElementById('header').style.fontSize='3em';
        document.getElementById('header').style.marginTop="0";
        document.getElementById('header').style.borderBottom='1px black solid';
    }
    document.getElementById('playOrRules').style.display = 'none';
    document.getElementById('theRulles').style.display = displayStyle;
}

//Starting the 'Editing' functions
//Function for designing the table (gameBox)
function designTheTable() {
    for (let i = 0; i < 9; ++i) {
        if (i === 2 || i === 5) {
            document.getElementById('row' + i).style.borderBottom = '3px black solid ';
        }
        document.getElementById('row' + i + 'C' + 2).style.borderRight = '3px black solid ';
        document.getElementById('row' + i + 'C' + 5).style.borderRight = '3px black solid ';
    }
}

//Function for 'disabling' the table cells(game boxes)
function disableTheBox(theRow, theColumn) {
    document.getElementById('row' + theRow + 'C' + theColumn).removeAttribute('tabindex');
    lastClicked = '';
    document.getElementById('row' + theRow + 'C' + theColumn).addEventListener('click', () => {
        lastClicked = ''
    });
}

//Function that helps highlight the table rows,columns and 'boxes'(on hover)
function highlightTheItems(theBox, theRow, theColumn) {
    theRow.style.backgroundColor = 'blanchedalmond';
    for (let i = 0; i < 9; ++i) {
        if (document.getElementById('row' + i + "C" + theColumn).style.backgroundColor !== 'greenyellow' && lastClicked !== 'row' + i + "C" + theColumn) {
            document.getElementById('row' + i + "C" + theColumn).style.backgroundColor = 'blanchedalmond';
        }
        if (document.getElementsByClassName(theBox.className.split(' ')[1])[i].style.backgroundColor !== 'greenyellow' && document.getElementsByClassName(theBox.className.split(' ')[1])[i].id !== lastClicked) {
            document.getElementsByClassName(theBox.className.split(' ')[1])[i].style.backgroundColor = 'blanchedalmond';
        }
    }
}

//Clears the highlight(After hover)
function clearTheHighlight(theBox, theRow, theColumn) {
    theRow.style.backgroundColor = 'transparent'
    for (let i = 0; i < 9; ++i) {
        if (document.getElementById('row' + i + "C" + theColumn).style.backgroundColor !== 'greenyellow' && lastClicked !== 'row' + i + "C" + theColumn) {
            document.getElementById('row' + i + "C" + theColumn).style.backgroundColor = 'transparent';
        }
        if (document.getElementsByClassName(theBox.className.split(' ')[1])[i].style.backgroundColor !== 'greenyellow' && document.getElementsByClassName(theBox.className.split(' ')[1])[i].id !== lastClicked) {
            document.getElementsByClassName(theBox.className.split(' ')[1])[i].style.backgroundColor = 'transparent';
        }
    }
}
