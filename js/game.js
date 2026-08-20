/* =====================================================
   COLOR BEAT
   GAME ENGINE
===================================================== */


/* =====================================================
   기본 설정
===================================================== */

const music = document.getElementById("music");

const menuScreen =
    document.getElementById("menuScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");

const gameArea =
    document.getElementById("gameArea");

const noteContainer =
    document.getElementById("noteContainer");

const judgeLine =
    document.getElementById("judgeLine");

const judgeText =
    document.getElementById("judgeText");

const countdown =
    document.getElementById("countdown");

const hitCountText =
    document.getElementById("hitCount");

const missCountText =
    document.getElementById("missCount");

const songTitle =
    document.getElementById("songTitle");


/* =====================================================
   게임 설정
===================================================== */

/*
   노트가 위에서 판정선까지 내려오는 시간
*/

const TRAVEL_TIME = 1.5;


/*
   PERFECT 판정 범위

   ±0.09초
*/

const PERFECT_TIME = 0.09;


/*
   GOOD 판정 범위

   ±0.18초
*/

const GOOD_TIME = 0.18;


/*
   CLEAR 조건

   90% 이상
*/

const CLEAR_RATE = 0.90;


/* =====================================================
   게임 변수
===================================================== */

let currentSong = null;

let currentSongKey = null;

let gameRunning = false;

let paused = false;

let animationId = null;

let nextNote = 0;

let activeNotes = [];

let hitCount = 0;

let missCount = 0;


/* =====================================================
   곡 데이터
===================================================== */

const songList = {

    lemonade: function () {

        return lemonadeSong;

    }

};


/* =====================================================
   화면 전환
===================================================== */

function showScreen(screen) {

    menuScreen.classList.remove("active");

    gameScreen.classList.remove("active");

    resultScreen.classList.remove("active");


    screen.classList.add("active");

}


/* =====================================================
   초기화
===================================================== */

function init() {

    setupSongButton();

    setupControlButtons();

    setupKeyboard();

    setupResultButtons();

    setupBackButton();

}


/* =====================================================
   LEMONADE 선택
===================================================== */

function setupSongButton() {

    const button =
        document.getElementById(
            "lemonadeButton"
        );


    button.addEventListener(
        "click",
        function () {

            startGame(
                "lemonade"
            );

        }
    );

}


/* =====================================================
   게임 시작
===================================================== */

async function startGame(
    songKey
) {

    stopGame();


    currentSong =
        songList[songKey]();


    if (!currentSong) {

        alert(
            "곡 데이터를 찾을 수 없습니다."
        );

        return;

    }


    currentSongKey =
        songKey;


    /*
       기록 초기화
    */

    hitCount = 0;

    missCount = 0;

    nextNote = 0;

    activeNotes = [];


    updateScore();


    /*
       노트 삭제
    */

    noteContainer.innerHTML =
        "";


    /*
       곡 제목
    */

    songTitle.textContent =
        currentSong.title;


    /*
       음악 파일 연결
    */

    music.pause();

    music.currentTime = 0;

    music.src =
        currentSong.music;

    music.load();


    /*
       게임 화면
    */

    showScreen(
        gameScreen
    );


    /*
       카운트다운
    */

    const started =
        await countdownStart();


    if (!started) {

        return;

    }


    /*
       음악 시작
    */

    try {

        await music.play();

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "음악을 재생할 수 없습니다.\n\n" +
            "music/lemonade.mp3 파일을 확인해주세요."
        );

        showScreen(
            menuScreen
        );

        return;

    }


    /*
       게임 시작
    */

    gameRunning = true;

    paused = false;

    nextNote = 0;

    activeNotes = [];


    /*
       게임 루프
    */

    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


/* =====================================================
   카운트다운
===================================================== */

function countdownStart() {

    return new Promise(
        function (resolve) {

            let number = 3;


            function showNumber() {

                /*
                   게임이 취소된 경우
                */

                if (
                    !document
                        .getElementById(
                            "gameScreen"
                        )
                        .classList
                        .contains("active")
                ) {

                    countdown.textContent =
                        "";

                    resolve(false);

                    return;

                }


                if (
                    number > 0
                ) {

                    countdown.textContent =
                        number;

                    number--;

                    setTimeout(
                        showNumber,
                        700
                    );

                    return;

                }


                countdown.textContent =
                    "START!";


                setTimeout(
                    function () {

                        countdown.textContent =
                            "";

                        resolve(true);

                    },
                    500
                );

            }


            showNumber();

        }
    );

}


/* =====================================================
   게임 루프
===================================================== */

function gameLoop() {

    if (
        !gameRunning ||
        paused
    ) {

        return;

    }


    const time =
        music.currentTime;


    /*
       노트 생성
    */

    createUpcomingNotes(
        time
    );


    /*
       노트 이동
    */

    moveNotes(
        time
    );


    /*
       계속 실행
    */

    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


/* =====================================================
   노트 생성
===================================================== */

function createUpcomingNotes(
    time
) {

    if (
        !currentSong ||
        !currentSong.notes
    ) {

        return;

    }


    while (
        nextNote <
        currentSong.notes.length
    ) {

        const data =
            currentSong.notes[
                nextNote
            ];


        /*
           노트가 등장해야 하는 시간
        */

        const spawnTime =
            data.time -
            TRAVEL_TIME;


        /*
           아직 등장할 시간이 아니면
           종료
        */

        if (
            time <
            spawnTime
        ) {

            break;

        }


        createNote(
            data
        );


        nextNote++;

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

    let color =
        data.color;


    /*
       혹시 대문자로 적혀 있어도
       작동하도록 처리
    */

    color =
        String(
            color
        ).toLowerCase();


    /*
       색깔 클래스
    */

    note.classList.add(
        "note"
    );


    note.classList.add(
        color
    );


    /*
       레인
    */

    const lane =
        Number(
            data.lane
        );


    /*
       X 위치
    */

    const laneWidth =
        gameArea.clientWidth /
        3;


    const x =
        laneWidth *
        lane +
        laneWidth / 2;


    note.style.left =
        x + "px";


    /*
       시작 위치
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


    note.hit =
        false;


    /*
       화면에 추가
    */

    noteContainer.appendChild(
        note
    );


    activeNotes.push(
        note
    );

}


/* =====================================================
   노트 이동
===================================================== */

function moveNotes(
    time
) {

    /*
       판정선 위치
    */

    const endY =
        judgeLine.offsetTop -
        24;


    /*
       시작 위치
    */

    const startY =
        -60;


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
            time;


        /*
           이동률

           0 = 위
           1 = 판정선
        */

        let progress =
            1 -
            (
                remaining /
                TRAVEL_TIME
            );


        /*
           위치 제한
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
           Y 위치
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
           판정 시간이 지나면 MISS
        */

        if (
            time -
            note.noteTime >
            GOOD_TIME
        ) {

            miss(
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
        paused
    ) {

        return;

    }


    /*
       버튼 효과
    */

    const button =
        document.querySelector(
            `.controlButton[data-lane="${lane}"]`
        );


    if (button) {

        button.classList.add(
            "pressed"
        );


        setTimeout(
            function () {

                button.classList.remove(
                    "pressed"
                );

            },
            90
        );

    }


    /*
       현재 음악 시간
    */

    const currentTime =
        music.currentTime;


    /*
       가장 가까운 노트 찾기
    */

    let target = null;

    let difference =
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


        const diff =
            Math.abs(
                note.noteTime -
                currentTime
            );


        if (
            diff <
            difference
        ) {

            difference =
                diff;

            target =
                note;

        }

    }


    /*
       판정 가능한 노트가 없으면
       아무 일도 하지 않음
    */

    if (!target) {

        return;

    }


    /*
       PERFECT
    */

    if (
        difference <=
        PERFECT_TIME
    ) {

        hit(
            target,
            "PERFECT"
        );

        return;

    }


    /*
       GOOD
    */

    if (
        difference <=
        GOOD_TIME
    ) {

        hit(
            target,
            "GOOD"
        );

    }

}


/* =====================================================
   키보드
===================================================== */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.repeat
            ) {

                return;

            }


            if (
                event.key === "a" ||
                event.key === "A"
            ) {

                pressLane(0);

            }


            else if (
                event.key === "s" ||
                event.key === "S"
            ) {

                pressLane(1);

            }


            else if (
                event.key === "d" ||
                event.key === "D"
            ) {

                pressLane(2);

            }


            /*
               ESC = 메뉴
            */

            else if (
                event.key === "Escape"
            ) {

                if (
                    gameRunning
                ) {

                    goMenu();

                }

            }

        }
    );

}


/* =====================================================
   화면 버튼
===================================================== */

function setupControlButtons() {

    const buttons =
        document.querySelectorAll(
            ".controlButton"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "pointerdown",
                function (event) {

                    event.preventDefault();


                    const lane =
                        Number(
                            this.dataset.lane
                        );


                    pressLane(
                        lane
                    );

                }
            );

        }
    );

}


/* =====================================================
   HIT
===================================================== */

function hit(
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


    updateScore();


    showJudge(
        result
    );


    removeNote(
        note
    );

}


/* =====================================================
   MISS
===================================================== */

function miss(
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


    updateScore();


    showJudge(
        "MISS"
    );

}


/* =====================================================
   기록 업데이트
===================================================== */

function updateScore() {

    hitCountText.textContent =
        hitCount;


    missCountText.textContent =
        missCount;

}


/* =====================================================
   노트 제거
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
   판정 표시
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
       CSS 애니메이션 재시작
    */

    void judgeText.offsetWidth;


    judgeText.classList.add(
        "show"
    );

}


/* =====================================================
   음악 종료
===================================================== */

music.addEventListener(
    "ended",
    function () {

        if (
            gameRunning
        ) {

            finishGame();

        }

    }
);


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


    paused =
        false;


    /*
       애니메이션 정지
    */

    if (
        animationId
    ) {

        cancelAnimationFrame(
            animationId
        );

        animationId =
            null;

    }


    /*
       남은 노트는 MISS
    */

    activeNotes.forEach(
        function (note) {

            if (
                !note.hit
            ) {

                missCount++;

            }

        }
    );


    /*
       노트 삭제
    */

    activeNotes = [];

    noteContainer.innerHTML =
        "";


    /*
       전체 판정
    */

    const total =
        hitCount +
        missCount;


    let accuracy = 0;


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
       결과 화면
    */

    document.getElementById(
        "resultSong"
    ).textContent =
        currentSong.title;


    document.getElementById(
        "resultHit"
    ).textContent =
        hitCount;


    document.getElementById(
        "resultMiss"
    ).textContent =
        missCount;


    document.getElementById(
        "resultAccuracy"
    ).textContent =
        percentage + "%";


    const resultTitle =
        document.getElementById(
            "resultTitle"
        );


    const reward =
        document.getElementById(
            "reward"
        );


    const rewardTitle =
        document.getElementById(
            "rewardTitle"
        );


    const rewardMessage =
        document.getElementById(
            "rewardMessage"
        );


    const rewardIcon =
        document.getElementById(
            "rewardIcon"
        );


    /*
       CLEAR
    */

    if (
        accuracy >=
        CLEAR_RATE
    ) {

        resultTitle.textContent =
            "CLEAR";

        resultTitle.className =
            "clear";


        reward.className =
            "success";


        rewardIcon.textContent =
            "🎁";


        rewardTitle.textContent =
            "CLEAR!";


        rewardMessage.textContent =
            "보상을 획득했습니다!";

    }


    /*
       FAILED
    */

    else {

        resultTitle.textContent =
            "FAILED";

        resultTitle.className =
            "failed";


        reward.className =
            "failed";


        rewardIcon.textContent =
            "✕";


        rewardTitle.textContent =
            "FAILED";


        rewardMessage.textContent =
            "클리어하지 못했습니다.";

    }


    showScreen(
        resultScreen
    );

}


/* =====================================================
   다시하기
===================================================== */

function setupResultButtons() {

    document
        .getElementById(
            "retryButton"
        )
        .addEventListener(
            "click",
            function () {

                startGame(
                    currentSongKey
                );

            }
        );


    document
        .getElementById(
            "menuButton"
        )
        .addEventListener(
            "click",
            function () {

                goMenu();

            }
        );

}


/* =====================================================
   뒤로가기
===================================================== */

function setupBackButton() {

    document
        .getElementById(
            "backButton"
        )
        .addEventListener(
            "click",
            function () {

                goMenu();

            }
        );

}


/* =====================================================
   메뉴
===================================================== */

function goMenu() {

    stopGame();

    currentSong =
        null;

    currentSongKey =
        null;

    showScreen(
        menuScreen
    );

}


/* =====================================================
   게임 정지
===================================================== */

function stopGame() {

    gameRunning =
        false;

    paused =
        false;


    if (
        animationId
    ) {

        cancelAnimationFrame(
            animationId
        );

        animationId =
            null;

    }


    music.pause();

    music.currentTime =
        0;


    countdown.textContent =
        "";


    activeNotes = [];

    noteContainer.innerHTML =
        "";

}


/* =====================================================
   화면 크기 변경
===================================================== */

window.addEventListener(
    "resize",
    function () {

        activeNotes.forEach(
            function (note) {

                const lane =
                    note.lane;


                const laneWidth =
                    gameArea.clientWidth /
                    3;


                note.style.left =
                    (
                        laneWidth *
                        lane +
                        laneWidth / 2
                    ) + "px";

            }
        );

    }
);


/* =====================================================
   시작
===================================================== */

init();
