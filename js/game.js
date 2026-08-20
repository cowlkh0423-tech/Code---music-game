/* ========================================
   COLOR BEAT - GAME ENGINE
======================================== */


/* ========================================
   게임 상태
======================================== */

let currentSongKey = null;

let currentSongData = null;

let music = document.getElementById("music");

let gameArea = document.getElementById("gameArea");

let noteContainer =
    document.getElementById("noteContainer");

let gameRunning = false;

let gameStartTime = 0;

let animationFrame = null;


/* ========================================
   기록
======================================== */

let hitCount = 0;

let missCount = 0;

let totalNotes = 0;


/* ========================================
   노트
======================================== */

let activeNotes = [];

let nextNoteIndex = 0;


/* ========================================
   판정 설정
======================================== */

/*
   노트가 판정선에 도착하는 시간

   1.35초 전부터 화면 위에서
   내려오기 시작한다.
*/

const NOTE_TRAVEL_TIME = 1.35;


/*
   PERFECT

   ±0.08초
*/

const PERFECT_WINDOW = 0.08;


/*
   GOOD

   ±0.17초
*/

const GOOD_WINDOW = 0.17;


/*
   CLEAR 조건

   정확도 90% 이상
*/

const CLEAR_ACCURACY = 0.90;


/* ========================================
   레인 위치
======================================== */

function getLaneX(lane) {

    const width =
        gameArea.clientWidth;

    const laneWidth =
        width / 3;

    return (
        laneWidth * lane +
        laneWidth / 2
    );

}


/* ========================================
   곡 선택
======================================== */

async function selectSong(songKey) {

    /*
       이미 실행 중인 게임이 있으면
       먼저 정리한다.
    */

    stopGame();


    currentSongKey =
        songKey;


    /*
       곡별 데이터 가져오기
    */

    try {

        currentSongData =
            await loadSongData(
                songKey
            );

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "곡 데이터를 불러오지 못했습니다."
        );

        return;

    }


    /*
       화면 변경
    */

    showScreen(
        "gameScreen"
    );


    /*
       곡 제목 표시
    */

    document.getElementById(
        "playingSong"
    ).textContent =
        currentSongData.title;


    /*
       기록 초기화
    */

    hitCount = 0;

    missCount = 0;

    nextNoteIndex = 0;

    activeNotes = [];


    updateGameInfo();


    /*
       음악 파일 지정
    */

    music.pause();

    music.currentTime = 0;

    music.src =
        currentSongData.music;


    music.load();


    /*
       음악 재생
    */

    try {

        await music.play();

    }

    catch (error) {

        console.error(
            "음악 재생 오류:",
            error
        );

        alert(
            "음악을 재생할 수 없습니다.\n\n" +
            "music 폴더의 MP3 파일 이름을 확인해주세요."
        );

        goMenu();

        return;

    }


    /*
       게임 시작
    */

    gameRunning = true;

    gameStartTime =
        performance.now();


    totalNotes =
        currentSongData.notes.length;


    /*
       게임 루프
    */

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ========================================
   곡 데이터 불러오기
======================================== */

async function loadSongData(
    songKey
) {

    /*
       현재는 LEMONADE부터 시작한다.

       나중에 곡이 추가되면
       여기에 각각 연결한다.
    */


    if (
        songKey ===
        "lemonade"
    ) {

        /*
           lemonade.js가
           전역으로 lemonadeSong을
           만들어주도록 한다.
        */

        if (
            typeof lemonadeSong ===
            "undefined"
        ) {

            throw new Error(
                "lemonade.js가 연결되지 않았습니다."
            );

        }


        return lemonadeSong;

    }


    if (
        songKey ===
        "love_attack"
    ) {

        if (
            typeof loveAttackSong ===
            "undefined"
        ) {

            throw new Error(
                "love_attack.js가 연결되지 않았습니다."
            );

        }


        return loveAttackSong;

    }


    if (
        songKey ===
        "blue_valentine"
    ) {

        if (
            typeof blueValentineSong ===
            "undefined"
        ) {

            throw new Error(
                "blue_valentine.js가 연결되지 않았습니다."
            );

        }


        return blueValentineSong;

    }


    throw new Error(
        "존재하지 않는 곡입니다."
    );

}


/* ========================================
   게임 루프
======================================== */

function gameLoop() {

    if (
        !gameRunning
    ) {

        return;

    }


    const currentTime =
        music.currentTime;


    /*
       새로운 노트 생성
    */

    spawnNotes(
        currentTime
    );


    /*
       현재 노트 위치 업데이트
    */

    updateNotes(
        currentTime
    );


    /*
       음악이 끝났는지 확인
    */

    if (
        music.ended
    ) {

        finishGame();

        return;

    }


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ========================================
   노트 생성
======================================== */

function spawnNotes(
    currentTime
) {

    const notes =
        currentSongData.notes;


    /*
       여러 개의 노트가
       동시에 생성될 수도 있으므로
       while 사용
    */

    while (
        nextNoteIndex <
        notes.length
    ) {

        const data =
            notes[nextNoteIndex];


        /*
           실제 판정 시간보다
           NOTE_TRAVEL_TIME만큼
           일찍 생성한다.
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


/* ========================================
   노트 만들기
======================================== */

function createNote(
    data
) {

    const note =
        document.createElement(
            "div"
        );


    note.className =
        "note " +
        data.color;


    /*
       레인 위치
    */

    const x =
        getLaneX(
            data.lane
        );


    note.style.left =
        x + "px";


    /*
       시작 위치
    */

    const startY =
        -60;


    note.style.top =
        startY + "px";


    /*
       노트 데이터 저장
    */

    note.noteTime =
        data.time;


    note.lane =
        data.lane;


    note.color =
        data.color;


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


/* ========================================
   노트 이동
======================================== */

function updateNotes(
    currentTime
) {

    const judgeLine =
        document.getElementById(
            "judgeLine"
        );


    const startY =
        -60;


    /*
       판정선의 중심 위치
    */

    const endY =
        judgeLine.offsetTop -
        24;


    for (
        let i =
            activeNotes.length - 1;

        i >= 0;

        i--
    ) {

        const note =
            activeNotes[i];


        /*
           이미 맞춘 노트
        */

        if (
            note.hit
        ) {

            continue;

        }


        /*
           판정 시간까지
           남은 시간
        */

        const remaining =
            note.noteTime -
            currentTime;


        /*
           진행률

           0 = 위
           1 = 판정선
        */

        const progress =
            1 -
            (
                remaining /
                NOTE_TRAVEL_TIME
            );


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
           너무 지나간 노트
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
                note,
                i
            );

        }

    }

}


/* ========================================
   레인 입력
======================================== */

function pressLane(
    lane
) {

    if (
        !gameRunning
    ) {

        return;

    }


    /*
       버튼 효과
    */

    const button =
        document.querySelector(
            `.touchButton[data-lane="${lane}"]`
        );


    if (button) {

        button.classList.add(
            "pressed"
        );


        setTimeout(
            function() {

                button.classList.remove(
                    "pressed"
                );

            },
            80
        );

    }


    /*
       현재 음악 위치
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
       판정
    */

    if (
        target &&
        smallestDifference <=
        GOOD_WINDOW
    ) {

        if (
            smallestDifference <=
            PERFECT_WINDOW
        ) {

            hitNote(
                target,
                "PERFECT"
            );

        }

        else {

            hitNote(
                target,
                "GOOD"
            );

        }

    }

}


/* ========================================
   키보드 입력
======================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !gameRunning
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

    }
);


/* ========================================
   노트 성공
======================================== */

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


    showJudge(
        result
    );


    updateGameInfo();

}


/* ========================================
   MISS
======================================== */

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


    showJudge(
        "MISS"
    );


    updateGameInfo();

}


/* ========================================
   노트 삭제
======================================== */

function removeNote(
    note,
    index
) {

    if (
        note.parentNode
    ) {

        note.parentNode.removeChild(
            note
        );

    }


    activeNotes.splice(
        index,
        1
    );

}


/* ========================================
   판정 표시
======================================== */

function showJudge(
    text
) {

    const judge =
        document.getElementById(
            "judgeText"
        );


    judge.textContent =
        text;


    judge.className =
        "";


    if (
        text ===
        "PERFECT"
    ) {

        judge.classList.add(
            "perfect"
        );

    }

    else if (
        text ===
        "GOOD"
    ) {

        judge.classList.add(
            "good"
        );

    }

    else {

        judge.classList.add(
            "miss"
        );

    }


    /*
       애니메이션 다시 시작
    */

    void judge.offsetWidth;


    judge.classList.add(
        "show"
    );

}


/* ========================================
   상단 기록
======================================== */

function updateGameInfo() {

    document.getElementById(
        "hitCount"
    ).textContent =
        hitCount;


    document.getElementById(
        "missCount"
    ).textContent =
        missCount;

}


/* ========================================
   게임 종료
======================================== */

function finishGame() {

    if (
        !gameRunning
    ) {

        return;

    }


    gameRunning =
        false;


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
       남아있는 노트 삭제
    */

    activeNotes.forEach(
        function(note) {

            if (
                note.parentNode
            ) {

                note.parentNode.removeChild(
                    note
                );

            }

        }
    );


    activeNotes =
        [];


    /*
       정확도 계산
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
       CLEAR 여부
    */

    const clear =
        accuracy >=
        CLEAR_ACCURACY;


    /*
       결과 화면
    */

    const title =
        document.getElementById(
            "resultTitle"
        );


    if (
        clear
    ) {

        title.textContent =
            "CLEAR";

        title.className =
            "clear";

        document.getElementById(
            "rewardMessage"
        ).textContent =
            "🎁 보상 획득!";

    }

    else {

        title.textContent =
            "FAILED";

        title.className =
            "failed";

        document.getElementById(
            "rewardMessage"
        ).textContent =
            "아쉽지만 보상이 없습니다.";

    }


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
        percentage +
        "%";


    showScreen(
        "resultScreen"
    );

}


/* ========================================
   다시하기
======================================== */

function retrySong() {

    if (
        currentSongKey
    ) {

        selectSong(
            currentSongKey
        );

    }

}


/* ========================================
   메뉴
======================================== */

function goMenu() {

    stopGame();


    showScreen(
        "menuScreen"
    );

}


/* ========================================
   게임 정지
======================================== */

function stopGame() {

    gameRunning =
        false;


    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame =
            null;

    }


    if (
        music
    ) {

        music.pause();

        music.currentTime =
            0;

    }


    activeNotes.forEach(
        function(note) {

            if (
                note.parentNode
            ) {

                note.parentNode.removeChild(
                    note
                );

            }

        }
    );


    activeNotes =
        [];


    nextNoteIndex =
        0;

}


/* ========================================
   화면 전환
======================================== */

function showScreen(
    screenId
) {

    document
        .querySelectorAll(".screen")
        .forEach(
            function(screen) {

                screen.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.getElementById(
            screenId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }

}
