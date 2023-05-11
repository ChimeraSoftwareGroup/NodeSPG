// Will generate a 4 random digit number for the password
export function createPassword() {
    var password = Math.floor(1000 + Math.random() * 9000);
    return password;
}

// This will give you a list of none same following numbers of minigames between two value
export function countGames(min, max, count) {
    min = parseInt(min) ?? min;
    max = parseInt(max) ?? max;
    count = parseInt(count) ?? count;
    const arrayGames = [];
    let previousNum = null;
    for (let i = 0; i < count; i++) {
        let randomGames = Math.floor(Math.random() * (max - min + 1)) + min;
        while (randomGames === previousNum) {
            randomGames = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        arrayGames.push(randomGames);
        previousNum = randomGames;
    }
    console.log(arrayGames);
    return arrayGames;
}

//counting remaining players in the game
export function countNull(list) {
    let count = 0;
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (!element.has_lost) {
            count++;
        }
    }
    return count;
}

export async function returnApi(request, response, callBack) {
    try {
        const results = await callBack(request);
        response.status(200).json(results);
    } catch (error) {
        response.status(500).json({ error: "azhjevauzevguyazgevuyazvbuye" });
    }
}
