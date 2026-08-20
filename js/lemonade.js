/* ========================================
   aespa - LEMONADE
   COLOR BEAT SONG DATA
======================================== */

const lemonadeSong = {

    /*
       곡 이름
    */

    title: "LEMONADE",


    /*
       음악 파일

       GitHub의 music 폴더 안에
       lemonade.mp3가 있어야 한다.
    */

    music: "music/lemonade.mp3",


    /*
       노트 패턴

       lane

       0 = 빨강
       1 = 노랑
       2 = 파랑


       color

       red
       yellow
       blue


       time

       음악이 시작된 후
       몇 초에 판정되는지
    */

    notes: [

        /* =========================
           INTRO
        ========================== */

        {
            time: 2.00,
            lane: 0,
            color: "red"
        },

        {
            time: 2.45,
            lane: 1,
            color: "yellow"
        },

        {
            time: 2.90,
            lane: 2,
            color: "blue"
        },

        {
            time: 3.35,
            lane: 1,
            color: "yellow"
        },


        /* =========================
           PATTERN 1
        ========================== */

        {
            time: 3.80,
            lane: 0,
            color: "red"
        },

        {
            time: 4.15,
            lane: 1,
            color: "yellow"
        },

        {
            time: 4.50,
            lane: 2,
            color: "blue"
        },

        {
            time: 4.85,
            lane: 1,
            color: "yellow"
        },

        {
            time: 5.20,
            lane: 0,
            color: "red"
        },

        {
            time: 5.55,
            lane: 2,
            color: "blue"
        },

        {
            time: 5.90,
            lane: 1,
            color: "yellow"
        },

        {
            time: 6.25,
            lane: 0,
            color: "red"
        },


        /* =========================
           PATTERN 2
        ========================== */

        {
            time: 6.65,
            lane: 2,
            color: "blue"
        },

        {
            time: 6.98,
            lane: 1,
            color: "yellow"
        },

        {
            time: 7.31,
            lane: 0,
            color: "red"
        },

        {
            time: 7.64,
            lane: 1,
            color: "yellow"
        },

        {
            time: 7.97,
            lane: 2,
            color: "blue"
        },

        {
            time: 8.30,
            lane: 0,
            color: "red"
        },

        {
            time: 8.63,
            lane: 1,
            color: "yellow"
        },

        {
            time: 8.96,
            lane: 2,
            color: "blue"
        },


        /* =========================
           PATTERN 3
        ========================== */

        {
            time: 9.30,
            lane: 0,
            color: "red"
        },

        {
            time: 9.60,
            lane: 1,
            color: "yellow"
        },

        {
            time: 9.90,
            lane: 2,
            color: "blue"
        },

        {
            time: 10.20,
            lane: 1,
            color: "yellow"
        },

        {
            time: 10.50,
            lane: 0,
            color: "red"
        },

        {
            time: 10.80,
            lane: 2,
            color: "blue"
        },

        {
            time: 11.10,
            lane: 1,
            color: "yellow"
        },

        {
            time: 11.40,
            lane: 0,
            color: "red"
        },


        /* =========================
           빠른 패턴
        ========================== */

        {
            time: 11.72,
            lane: 0,
            color: "red"
        },

        {
            time: 11.96,
            lane: 1,
            color: "yellow"
        },

        {
            time: 12.20,
            lane: 2,
            color: "blue"
        },

        {
            time: 12.44,
            lane: 1,
            color: "yellow"
        },

        {
            time: 12.68,
            lane: 0,
            color: "red"
        },

        {
            time: 12.92,
            lane: 2,
            color: "blue"
        },

        {
            time: 13.16,
            lane: 1,
            color: "yellow"
        },

        {
            time: 13.40,
            lane: 0,
            color: "red"
        },


        /* =========================
           동시 노트
        ========================== */

        {
            time: 13.80,
            lane: 0,
            color: "red"
        },

        {
            time: 13.80,
            lane: 2,
            color: "blue"
        },

        {
            time: 14.25,
            lane: 1,
            color: "yellow"
        },

        {
            time: 14.70,
            lane: 0,
            color: "red"
        },

        {
            time: 14.70,
            lane: 2,
            color: "blue"
        },


        /* =========================
           테스트용 마지막 구간
        ========================== */

        {
            time: 15.15,
            lane: 1,
            color: "yellow"
        },

        {
            time: 15.48,
            lane: 0,
            color: "red"
        },

        {
            time: 15.81,
            lane: 2,
            color: "blue"
        },

        {
            time: 16.14,
            lane: 1,
            color: "yellow"
        },

        {
            time: 16.47,
            lane: 0,
            color: "red"
        },

        {
            time: 16.80,
            lane: 2,
            color: "blue"
        },

        {
            time: 17.13,
            lane: 1,
            color: "yellow"
        },

        {
            time: 17.46,
            lane: 0,
            color: "red"
        }

    ]

};
