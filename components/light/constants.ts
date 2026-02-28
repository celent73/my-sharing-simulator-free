export const LEVEL_COMMISSIONS = {
    DOMESTIC: {
        ONE_TUM: [50, 15, 5, 3, 2.5, 2.5],
        RECURRING: [1, 1, 1, 1, 1, 1], // Default month 1
        RECURRING_13_24: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
        RECURRING_25_PLUS: [2, 2, 2, 2, 2, 2]
    },
    BUSINESS: {
        ONE_TUM: [100, 30, 10, 6, 5, 5],
        RECURRING: [2, 2, 2, 2, 2, 2],
        RECURRING_13_24: [3, 3, 3, 3, 3, 3],
        RECURRING_25_PLUS: [4, 4, 4, 4, 4, 4]
    }
};

export const UNLOCK_CONDITIONS = {
    LEVEL_1: 3,  // 3 utenze per sbloccare liv 1
    LEVEL_2: 5,
    LEVEL_3: 7,
    LEVEL_4: 10,
    LEVEL_5: 10,
};
