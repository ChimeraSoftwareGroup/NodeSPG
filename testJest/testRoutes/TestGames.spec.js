import { getGames } from "../../app/controller/controllers";

describe("get all games", function () {
    test("get all games", async () => {
        expect(await getGames()).toBeInstanceOf(Array);
    });
});
