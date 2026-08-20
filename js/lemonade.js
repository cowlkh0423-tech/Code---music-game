/* =====================================================
   LEMONADE - SONG DATA
===================================================== */

const lemonadeSong = {

    title: "LEMONADE",

    artist: "aespa",

    /*
       음악 파일 위치
    */

    music: "music/lemonade.mp3",


    /*
       노트

       time = 음악 시작 후 몇 초에 판정할지
       lane
         0 = 빨강
         1 = 노랑
         2 = 파랑

       color
         red
         yellow
         blue
    */

    notes: [

        { time: 2.00, lane: 0, color: "red" },
        { time: 2.50, lane: 1, color: "yellow" },
        { time: 3.00, lane: 2, color: "blue" },

        { time: 3.50, lane: 1, color: "yellow" },
        { time: 4.00, lane: 0, color: "red" },
        { time: 4.50, lane: 2, color: "blue" },

        { time: 5.00, lane: 0, color: "red" },
        { time: 5.35, lane: 1, color: "yellow" },
        { time: 5.70, lane: 2, color: "blue" },

        { time: 6.20, lane: 2, color: "blue" },
        { time: 6.70, lane: 1, color: "yellow" },
        { time: 7.20, lane: 0, color: "red" },

        { time: 7.70, lane: 1, color: "yellow" },
        { time: 8.10, lane: 2, color: "blue" },
        { time: 8.50, lane: 0, color: "red" },

        { time: 9.00, lane: 0, color: "red" },
        { time: 9.35, lane: 2, color: "blue" },
        { time: 9.70, lane: 1, color: "yellow" },

        { time: 10.20, lane: 2, color: "blue" },
        { time: 10.70, lane: 0, color: "red" },
        { time: 11.20, lane: 1, color: "yellow" },

        { time: 11.70, lane: 0, color: "red" },
        { time: 12.10, lane: 1, color: "yellow" },
        { time: 12.50, lane: 2, color: "blue" },

        { time: 13.00, lane: 2, color: "blue" },
        { time: 13.40, lane: 0, color: "red" },
        { time: 13.80, lane: 1, color: "yellow" },

        { time: 14.30, lane: 1, color: "yellow" },
        { time: 14.65, lane: 2, color: "blue" },
        { time: 15.00, lane: 0, color: "red" },

        { time: 15.50, lane: 0, color: "red" },
        { time: 15.85, lane: 1, color: "yellow" },
        { time: 16.20, lane: 2, color: "blue" },

        { time: 16.70, lane: 1, color: "yellow" },
        { time: 17.20, lane: 0, color: "red" },
        { time: 17.70, lane: 2, color: "blue" },

        { time: 18.20, lane: 2, color: "blue" },
        { time: 18.55, lane: 1, color: "yellow" },
        { time: 18.90, lane: 0, color: "red" },

        { time: 19.40, lane: 0, color: "red" },
        { time: 19.80, lane: 2, color: "blue" },
        { time: 20.20, lane: 1, color: "yellow" },

        { time: 20.70, lane: 2, color: "blue" },
        { time: 21.20, lane: 0, color: "red" },
        { time: 21.70, lane: 1, color: "yellow" },

        { time: 22.20, lane: 1, color: "yellow" },
        { time: 22.55, lane: 2, color: "blue" },
        { time: 22.90, lane: 0, color: "red" },

        { time: 23.40, lane: 0, color: "red" },
        { time: 23.80, lane: 1, color: "yellow" },
        { time: 24.20, lane: 2, color: "blue" }

    ]

};
