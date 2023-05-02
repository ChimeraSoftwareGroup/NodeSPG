import { getGames } from "../../app/routes/controllers";

describe("get all games", function () {
    test("get all games", async () => {
        expect(await getGames()).toBeInstanceOf(Array);
    });
});
