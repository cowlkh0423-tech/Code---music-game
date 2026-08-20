/* =====================================================
   COLOR BEAT
   GAME ENGINE
===================================================== */


/* =====================================================
   DOM
===================================================== */

const screens = {
    menu: document.getElementById("menuScreen"),
    game: document.getElementById("gameScreen"),
    result: document.getElementById("resultScreen")
};

const music = document.getElementById("music");

const gameArea = document.getElementById("gameArea");
const noteContainer = document.getElementById("noteContainer");

const playingSong = document.getElementById("playingSong");

const hitCountElement =
    document.getElementById("hitCount");

const missCountElement =
    document.getElementById("missCount");

const judgeText =
    document.getElementById("judgeText");

const countdown =
    document.getElementById("countdown");

const pauseOverlay =
    document.getElementById("pauseOverlay");

const resultTitle =
    document.getElementById("resultTitle");

const resultSongName =
    document.getElementById("resultSongName");

const resultHit =
    document.getElementById("resultHit");

const resultMiss =
    document.getElementById("resultMiss");

const resultAccuracy =
    document.getElementById("resultAccuracy");

const rewardBox =
    document.getElementById("rewardBox");

const rewardTitle =
    document.getElementById("rewardTitle");

const rewardMessage =
    document.getElementById("rewardMessage");

const rewardIcon =
    document.getElementById("rewardIcon");


/* =====================================================
   게임 상태
===================================================== */

let currentSongKey = null;

let currentSong = null;

let gameRunning = false;

let gamePaused = false;

let countdownRunning = false;

let animationFrame = null;


/* =====================================================
   기록
===================================================== */

let hitCount = 0;

let missCount = 0;

let totalNotes = 0;


/* =====================================================
   노트
===================================================== */

let activeNotes = [];

let nextNoteIndex = 0;


/* =====================================================
   시간 설정
===================================================== */

/*
    노트가 화면 위에서 등장해서
    판정선까지 내려오는 시간

    너무 빠르지 않게 1.5초
*/

const NOTE_TRAVEL_TIME = 1.5;


/*
    PERFECT 판정

    ±0.09초
*/

const PERFECT_WINDOW = 0.09;


/*
    GOOD 판정

    ±0.18초
*/

const GOOD_WINDOW = 0.18;


/*
    CLEAR 기준

    기본 90%

    나중에 부스 난이도에 맞춰
    쉽게 또는 어렵게 조절 가능
*/

const CLEAR_ACCURACY = 0.90;


/* =====================================================
   노트 위치
===================================================== */

const NOTE_SIZE = 48;


/* =====================================================
   곡 데이터
===================================================== */

const SONGS = {

    lemonade: () => {

        if (
            typeof lemonadeSong ===
            "undefined"
        ) {

            return null;

        }

        return lemonadeSong;

    },


    love_attack: () => {

        if (
            typeof loveAttackSong ===
            "undefined"
        ) {

            return null;

        }

        return loveAttackSong;

    },


    blue_valentine: () => {

        if (
            typeof blueValentineSong ===
            "undefined"
        ) {

            return null;

        }

        return blueValentineSong;

    }

};


/* =====================================================
   초기화
===================================================== */

function init() {

    setupSongButtons();

    setupTouchButtons();

    setupKeyboard();

    setupGameButtons();

    music.addEventListener(
        "ended",
        handleMusicEnded
    );

}


/* =====================================================
   곡 버튼
===================================================== */

function setupSongButtons() {

    const buttons =
        document.querySelectorAll(
            ".songButton"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    const songKey =
                        this.dataset.song;

                    startSong(
                        songKey
                    );

                }
            );

        }
    );

}


/* =====================================================
   터치 버튼
===================================================== */

function setupTouchButtons() {

    const buttons =
        document.querySelectorAll(
            ".touchButton"
        );


    buttons.forEach(
        button => {

            const lane =
                Number(
                    button.dataset.lane
                );


            /*
                click도 지원
            */

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    pressLane(
                        lane
                    );

                }
            );


            /*
                모바일에서
                빠른 입력을 위해
                pointerdown 사용
            */

            button.addEventListener(
                "pointerdown",
                function(event) {

                    event.preventDefault();

                    pressLane(
                        lane
                    );

                }
            );

        }
    );

}


/* =====================================================
   키보드
===================================================== */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                !gameRunning ||
                gamePaused
            ) {

                return;

            }


            /*
                이미 누르고 있는 키의
                반복 입력 방지
            */

            if (
                event.repeat
            ) {

                return;

            }


            const key =
                event.key.toLowerCase();


            if (
                key === "a"
            ) {

                pressLane(0);

            }

            else if (
                key === "s"
            ) {

                pressLane(1);

            }

            else if (
                key === "d"
            ) {

                pressLane(2);

            }

            /*
                ESC
                일시정지
            */

            else if (
                key === "escape"
            ) {

                togglePause();

            }

        }
    );

}


/* =====================================================
   게임 버튼
===================================================== */

function setupGameButtons() {

    /*
        뒤로가기
    */

    document
        .getElementById("backButton")
        .addEventListener(
            "click",
            function() {

                goMenu();

            }
        );


    /*
        다시하기
    */

    document
        .getElementById("retryButton")
        .addEventListener(
            "click",
            function() {

                if (
                    currentSongKey
                ) {

                    startSong(
                        currentSongKey
                    );

                }

            }
        );


    /*
        곡 선택
    */

    document
        .getElementById("menuButton")
        .addEventListener(
            "click",
            function() {

                goMenu();

            }
        );


    /*
        계속하기
    */

    document
        .getElementById("resumeButton")
        .addEventListener(
            "click",
            function() {

                resumeGame();

            }
        );


    /*
        나가기
    */

    document
        .getElementById("quitButton")
        .addEventListener(
            "click",
            function() {

                goMenu();

            }
        );

}


/* =====================================================
   곡 시작
===================================================== */

async function startSong(
    songKey
) {

    /*
        기존 게임 정리
    */

    stopGame();


    /*
        곡 데이터 확인
    */

    if (
        !SONGS[songKey]
    ) {

        alert(
            "존재하지 않는 곡입니다."
        );

        return;

    }


    currentSong =
        SONGS[songKey]();


    if (
        !currentSong
    ) {

        alert(
            "이 곡의 데이터를 찾을 수 없습니다.\n\n" +
            "곡별 JS 파일이 제대로 연결되어 있는지 확인해주세요."
        );

        return;

    }


    if (
        !currentSong.notes ||
        !Array.isArray(
            currentSong.notes
        )
    ) {

        alert(
            "곡의 노트 데이터가 없습니다."
        );

        return;

    }


    /*
        현재 곡 저장
    */

    currentSongKey =
        songKey;


    /*
        화면 이동
    */

    showScreen(
        "gameScreen"
    );


    /*
        곡 이름
    */

    playingSong.textContent =
        currentSong.title ||
        "COLOR BEAT";


    /*
        기록 초기화
    */

    resetGameData();


    /*
        MP3 연결
    */

    music.pause();

    music.currentTime = 0;

    music.src =
        currentSong.music;


    /*
        캐시에서 문제 생기는 것을
        방지하기 위해 load
    */

    music.load();


    /*
        카운트다운
    */

    await runCountdown();


    /*
        사용자가 메뉴로 나갔다면
        시작하지 않음
    */

    if (
        currentSongKey !==
        songKey
    ) {

        return;

    }


    /*
        음악 재생
    */

    try {

        await music.play();

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "음악을 재생하지 못했습니다.\n\n" +
            "music 폴더 안의 MP3 파일 이름과 경로를 확인해주세요."
        );

        goMenu();

        return;

    }


    /*
        게임 시작
    */

    gameRunning = true;

    gamePaused = false;

    nextNoteIndex = 0;

    activeNotes = [];


    /*
        첫 프레임
    */

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =====================================================
   게임 데이터 초기화
===================================================== */

function resetGameData() {

    hitCount = 0;

    missCount = 0;

    nextNoteIndex = 0;

    activeNotes = [];

    totalNotes =
        currentSong &&
        Array.isArray(
            currentSong.notes
        )
            ? currentSong.notes.length
            : 0;


    hitCountElement.textContent =
        "0";

    missCountElement.textContent =
        "0";


    /*
        화면에 남은 노트 삭제
    */

    clearNotes();


    /*
        결과 화면 초기화
    */

    resultHit.textContent =
        "0";

    resultMiss.textContent =
        "0";

    resultAccuracy.textContent =
        "0%";

}


/* =====================================================
   카운트다운
===================================================== */

function runCountdown() {

    return new Promise(
        resolve => {

            countdownRunning =
                true;


            const numbers = [
                "3",
                "2",
                "1",
                "START!"
            ];


            let index = 0;


            function showNext() {

                /*
                    중간에 게임이 취소된 경우
                */

                if (
                    !countdownRunning
                ) {

                    countdown.textContent =
                        "";

                    resolve();

                    return;

                }


                countdown.textContent =
                    numbers[index];


                index++;


                if (
                    index >=
                    numbers.length
                ) {

                    setTimeout(
                        function() {

                            countdown.textContent =
                                "";

                            countdownRunning =
                                false;

                            resolve();

                        },
                        500
                    );

                    return;

                }


                setTimeout(
                    showNext,
                    700
                );

            }


            showNext();

        }
    );

}


/* =====================================================
   게임 루프
===================================================== */

function gameLoop() {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    const currentTime =
        music.currentTime;


    /*
        노트 생성
    */

    spawnNotes(
        currentTime
    );


    /*
        노트 이동
    */

    updateNotes(
        currentTime
    );


    /*
        계속 실행
    */

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =====================================================
   노트 생성
===================================================== */

function spawnNotes(
    currentTime
) {

    if (
        !currentSong
    ) {

        return;

    }


    const notes =
        currentSong.notes;


    while (
        nextNoteIndex <
        notes.length
    ) {

        const data =
            notes[nextNoteIndex];


        if (
            !data ||
            typeof data.time !==
            "number"
        ) {

            nextNoteIndex++;

            continue;

        }


        /*
            판정 시간보다
            1.5초 먼저 생성
        */

        const spawnTime =
            data.time -
            NOTE_TRAVEL_TIME;


        if (
            currentTime <
            spawnTime
        ) {

            break;

        }


        createNote(
            data
        );


        nextNoteIndex++;

    }

}


/* =====================================================
   노트 생성
===================================================== */

function createNote(
    data
) {

    const note =
        document.createElement(
            "div"
        );


    /*
        색깔
    */

    const color =
        normalizeColor(
            data.color
        );


    note.className =
        "note " +
        color;


    /*
        레인

        lane이 없는 경우
        색깔을 기준으로 자동 결정
    */

    let lane =
        Number(
            data.lane
        );


    if (
        !Number.isInteger(lane) ||
        lane < 0 ||
        lane > 2
    ) {

        lane =
            colorToLane(
                color
            );

    }


    /*
        X 위치
    */

    note.style.left =
        getLaneCenter(
            lane
        ) + "px";


    /*
        시작 위치

        게임 화면 위에서
        등장
    */

    note.style.top =
        "-60px";


    /*
        데이터 저장
    */

    note.noteTime =
        Number(
            data.time
        );

    note.lane =
        lane;

    note.color =
        color;

    note.hit =
        false;


    /*
        노트 추가
    */

    noteContainer.appendChild(
        note
    );


    activeNotes.push(
        note
    );

}


/* =====================================================
   색깔 정리
===================================================== */

function normalizeColor(
    color
) {

    if (
        color === "red"
    ) {

        return "red";

    }


    if (
        color === "yellow"
    ) {

        return "yellow";

    }


    if (
        color === "blue"
    ) {

        return "blue";

    }


    return "red";

}


/* =====================================================
   색깔 → 레인
===================================================== */

function colorToLane(
    color
) {

    if (
        color === "red"
    ) {

        return 0;

    }


    if (
        color === "yellow"
    ) {

        return 1;

    }


    return 2;

}


/* =====================================================
   레인 중앙 위치
===================================================== */

function getLaneCenter(
    lane
) {

    const width =
        gameArea.clientWidth;


    const laneWidth =
        width / 3;


    return (
        laneWidth *
        lane +
        laneWidth / 2
    );

}


/* =====================================================
   노트 이동
===================================================== */

function updateNotes(
    currentTime
) {

    const judgeLine =
        document.getElementById(
            "judgeLine"
        );


    if (
        !judgeLine
    ) {

        return;

    }


    /*
        노트 시작 위치
    */

    const startY =
        -NOTE_SIZE;


    /*
        판정선 중앙

        노트 중심이 판정선에
        오도록 계산
    */

    const endY =
        judgeLine.offsetTop -
        NOTE_SIZE / 2;


    for (
        let i =
            activeNotes.length - 1;

        i >= 0;

        i--
    ) {

        const note =
            activeNotes[i];


        if (
            note.hit
        ) {

            continue;

        }


        /*
            판정선까지 남은 시간
        */

        const remaining =
            note.noteTime -
            currentTime;


        /*
            진행률
        */

        let progress =
            1 -
            (
                remaining /
                NOTE_TRAVEL_TIME
            );


        /*
            0~1 사이로 제한
        */

        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        /*
            위치
        */

        const y =
            startY +
            (
                endY -
                startY
            ) *
            progress;


        note.style.top =
            y + "px";


        /*
            판정 시간을 지나친 경우
        */

        if (
            currentTime -
            note.noteTime >
            GOOD_WINDOW
        ) {

            missNote(
                note
            );


            removeNote(
                note
            );

        }

    }

}


/* =====================================================
   레인 입력
===================================================== */

function pressLane(
    lane
) {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    /*
        버튼 효과
    */

    flashTouchButton(
        lane
    );


    /*
        현재 음악 시간
    */

    const currentTime =
        music.currentTime;


    /*
        가장 가까운 노트 찾기
    */

    let target =
        null;

    let smallestDifference =
        Infinity;


    for (
        const note of activeNotes
    ) {

        if (
            note.hit
        ) {

            continue;

        }


        if (
            note.lane !==
            lane
        ) {

            continue;

        }


        const difference =
            Math.abs(
                note.noteTime -
                currentTime
            );


        if (
            difference <
            smallestDifference
        ) {

            smallestDifference =
                difference;

            target =
                note;

        }

    }


    /*
        노트가 없는 경우
    */

    if (
        !target
    ) {

        return;

    }


    /*
        판정 범위
    */

    if (
        smallestDifference <=
        PERFECT_WINDOW
    ) {

        hitNote(
            target,
            "PERFECT"
        );

    }

    else if (
        smallestDifference <=
        GOOD_WINDOW
    ) {

        hitNote(
            target,
            "GOOD"
        );

    }

}


/* =====================================================
   버튼 효과
===================================================== */

function flashTouchButton(
    lane
) {

    const button =
        document.querySelector(
            `.touchButton[data-lane="${lane}"]`
        );


    if (
        !button
    ) {

        return;

    }


    button.classList.add(
        "pressed"
    );


    setTimeout(
        function() {

            button.classList.remove(
                "pressed"
            );

        },
        90
    );

}


/* =====================================================
   HIT
===================================================== */

function hitNote(
    note,
    result
) {

    if (
        note.hit
    ) {

        return;

    }


    note.hit =
        true;


    hitCount++;


    updateStats();


    showJudge(
        result
    );


    /*
        맞은 노트 제거
    */

    removeNote(
        note
    );

}


/* =====================================================
   MISS
===================================================== */

function missNote(
    note
) {

    if (
        note.hit
    ) {

        return;

    }


    note.hit =
        true;


    missCount++;


    updateStats();


    showJudge(
        "MISS"
    );

}


/* =====================================================
   기록 업데이트
===================================================== */

function updateStats() {

    hitCountElement.textContent =
        hitCount;

    missCountElement.textContent =
        missCount;

}


/* =====================================================
   노트 삭제
===================================================== */

function removeNote(
    note
) {

    const index =
        activeNotes.indexOf(
            note
        );


    if (
        index !== -1
    ) {

        activeNotes.splice(
            index,
            1
        );

    }


    if (
        note.parentNode
    ) {

        note.parentNode.removeChild(
            note
        );

    }

}


/* =====================================================
   모든 노트 삭제
===================================================== */

function clearNotes() {

    activeNotes.forEach(
        note => {

            if (
                note.parentNode
            ) {

                note.parentNode.removeChild(
                    note
                );

            }

        }
    );


    activeNotes = [];


    /*
        혹시 배열에 잡히지 않은
        노트까지 제거
    */

    noteContainer.innerHTML =
        "";

}


/* =====================================================
   판정 텍스트
===================================================== */

function showJudge(
    text
) {

    judgeText.textContent =
        text;


    judgeText.className =
        "";


    if (
        text === "PERFECT"
    ) {

        judgeText.classList.add(
            "perfect"
        );

    }

    else if (
        text === "GOOD"
    ) {

        judgeText.classList.add(
            "good"
        );

    }

    else {

        judgeText.classList.add(
            "miss"
        );

    }


    /*
        애니메이션 강제 초기화
    */

    void judgeText.offsetWidth;


    judgeText.classList.add(
        "show"
    );

}


/* =====================================================
   음악 종료
===================================================== */

function handleMusicEnded() {

    if (
        !gameRunning
    ) {

        return;

    }


    /*
        마지막 노트가
        아직 판정되지 않았다면
        잠시 기다린다.
    */

    setTimeout(
        function() {

            if (
                gameRunning
            ) {

                finishGame();

            }

        },
        300
    );

}


/* =====================================================
   게임 종료
===================================================== */

function finishGame() {

    if (
        !gameRunning
    ) {

        return;

    }


    gameRunning =
        false;

    gamePaused =
        false;


    /*
        애니메이션 중지
    */

    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame =
            null;

    }


    /*
        음악 정지
    */

    music.pause();


    /*
        남은 노트 처리

        음악이 끝났는데
        화면에 남아있는 노트는
        MISS로 처리
    */

    activeNotes.forEach(
        note => {

            if (
                !note.hit
            ) {

                missCount++;

                note.hit =
                    true;

            }

        }
    );


    updateStats();


    /*
        노트 삭제
    */

    clearNotes();


    /*
        결과 계산
    */

    const total =
        hitCount +
        missCount;


    let accuracy =
        0;


    if (
        total > 0
    ) {

        accuracy =
            hitCount /
            total;

    }


    const percentage =
        Math.round(
            accuracy * 100
        );


    /*
        CLEAR 판정
    */

    const cleared =
        accuracy >=
        CLEAR_ACCURACY;


    /*
        결과 화면
    */

    resultSongName.textContent =
        currentSong &&
        currentSong.title
            ? currentSong.title
            : "COLOR BEAT";


    resultHit.textContent =
        hitCount;


    resultMiss.textContent =
        missCount;


    resultAccuracy.textContent =
        percentage + "%";


    if (
        cleared
    ) {

        resultTitle.textContent =
            "CLEAR";

        resultTitle.className =
            "clear";


        rewardBox.classList.remove(
            "failed"
        );

        rewardBox.classList.add(
            "success"
        );


        rewardIcon.textContent =
            "🎁";


        rewardTitle.textContent =
            "CLEAR!";


        rewardMessage.textContent =
            "보상을 획득했습니다!";

    }

    else {

        resultTitle.textContent =
            "FAILED";

        resultTitle.className =
            "failed";


        rewardBox.classList.remove(
            "success"
        );

        rewardBox.classList.add(
            "failed"
        );


        rewardIcon.textContent =
            "✕";


        rewardTitle.textContent =
            "FAILED";


        rewardMessage.textContent =
            "클리어하지 못했습니다.";

    }


    showScreen(
        "resultScreen"
    );

}


/* =====================================================
   일시정지
===================================================== */

function togglePause() {

    if (
        !gameRunning
    ) {

        return;

    }


    if (
        gamePaused
    ) {

        resumeGame();

    }

    else {

        pauseGame();

    }

}


/* =====================================================
   일시정지
===================================================== */

function pauseGame() {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    gamePaused =
        true;


    music.pause();


    pauseOverlay.classList.add(
        "active"
    );


    pauseOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame =
            null;

    }

}


/* =====================================================
   계속하기
===================================================== */

function resumeGame() {

    if (
        !gameRunning ||
        !gamePaused
    ) {

        return;

    }


    gamePaused =
        false;


    pauseOverlay.classList.remove(
        "active"
    );


    pauseOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    music.play()
        .catch(
            error => {

                console.error(
                    error
                );

            }
        );


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =====================================================
   메뉴로 이동
===================================================== */

function goMenu() {

    stopGame();


    currentSongKey =
        null;

    currentSong =
        null;


    showScreen(
        "menuScreen"
    );

}


/* =====================================================
   게임 정지
===================================================== */

function stopGame() {

    gameRunning =
        false;

    gamePaused =
        false;

    countdownRunning =
        false;


    /*
        카운트다운 제거
    */

    countdown.textContent =
        "";


    /*
        애니메이션 중지
    */

    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame =
            null;

    }


    /*
        음악 정지
    */

    music.pause();

    music.currentTime =
        0;


    /*
        일시정지 창 제거
    */

    pauseOverlay.classList.remove(
        "active"
    );

    pauseOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
        노트 제거
    */

    clearNotes();

}


/* =====================================================
   화면 전환
===================================================== */

function showScreen(
    screenName
) {

    Object.values(
        screens
    ).forEach(
        screen => {

            screen.classList.remove(
                "active"
            );

        }
    );


    const target =
        screens[screenName];


    if (
        target
    ) {

        target.classList.add(
            "active"
        );

    }

}


/* =====================================================
   브라우저 크기 변경
===================================================== */

window.addEventListener(
    "resize",
    function() {

        /*
            화면 크기가 바뀌면
            현재 노트의 가로 위치를
            다시 계산
        */

        activeNotes.forEach(
            note => {

                if (
                    note.lane !==
                    undefined
                ) {

                    note.style.left =
                        getLaneCenter(
                            note.lane
                        ) + "px";

                }

            }
        );

    }
);


/* =====================================================
   페이지 종료
===================================================== */

window.addEventListener(
    "beforeunload",
    function() {

        stopGame();

    }
);


/* =====================================================
   시작
===================================================== */

init();
